import fs from 'fs'
import { promisify } from 'util';
import inquirer from 'inquirer';
import { CLIAutomationQuestionInterface } from "interface/question.interface";
import { envNameValidation, jsonFileValidation, mochawesomeValidation, projectModulesValidation } from "./validation";
const readFile = promisify(fs.readFile);

export const CLIAutomationQuestion = async (params: CLIAutomationQuestionInterface): Promise<any> => {
	const {
		argument,
		packagesList,
		mochaExist,
		eslintExist
	} = params;

	const commonQuestions = [
		{
			type: 'list',
			name: 'moduleQ',
			message: 'What type of modules does your project use?',
			choices: ["Javascript modules (import/export)", "CommonJS (require/exports)"],
			when: () => projectModulesValidation()
		},
		{
			type: 'input',
			name: 'jsonFileQ',
			message: 'Type your json file to be generate (example.json):',
			default: 'example.json',
			validate: (answers: any) => jsonFileValidation(answers)
		}
	]

	const fullQuestions = [
		{
			type: 'list',
			name: 'frameworkQ',
			message: 'What framework will be used?',
			choices: ["Mocha chai"],
			when: () => mochaExist
		},
		{
			type: 'list',
			name: 'eslintQ',
			message: 'Do you want to install ESlint?',
			choices: ["Yes", "No"],
			when: () => eslintExist
		},
		{
			type: 'list',
			name: 'mochaweQ',
			message: 'Do you want to install Mochawesome?',
			choices: ["Yes", "No"],
			when: (answers: any) => mochawesomeValidation(answers, packagesList)
		},
		...commonQuestions,
	]

	// ontest
	const questions = (argument !== "generate") ? commonQuestions : fullQuestions;

	return questions
}

export const CLIJSONQuestion = async (answers: any): Promise<any> => {
	interface Item {
		name: string;
		item?: any;
	}

	try {
		const data = await readFile(answers.jsonFileQ.includes('"') ? answers.jsonFileQ.replace(/"/g, '') : answers.jsonFileQ, 'utf8');
		const { item: items } = JSON.parse(data)

		// Assuming that we want to push items with the 'item' property to the end of the array
		const sortedArr: Item[] = items.sort((a: Item, b: Item) => {
			return (a.item === undefined ? -1 : 0) + (b.item === undefined ? 0 : 1);
		});

		const option = sortedArr.map((item: Item) => ({
			name: `${item.name} - ${item.hasOwnProperty('item') ? '(suite)' : '(test)'}`
		}));

		return inquirer.prompt([
			{
				type: 'checkbox',
				name: 'customKey',
				message: 'Select one or more case or suite:',
				pageSize: 10,
				choices: option,
				validate: function (value: any) {
					if (value.length === 0) {
						return 'Please select at least one case or suite';
					}

					return true;
				},
			},
		]);
	} catch (error: any) {
		console.error(`Error processing file: ${error.message}`);
	}
};

export const CLIEnvironmentQuestion = async (): Promise<any> => {
	return [
		{
			type: 'input',
			name: 'jsonFileQ',
			message: 'Input your json file to be generate (example.json):',
			default: 'example-env.json',
			validate: (answers: any) => jsonFileValidation(answers)
		},
		{
			type: 'input',
			name: 'envQ',
			message: 'Input your environment name:',
			default: 'dev',
			validate: (answers: any) => envNameValidation(answers)
		}
	]
}