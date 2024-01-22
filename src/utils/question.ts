import { CLIAutomationQuestionInterface } from "interface/question.interface";
import { envNameValidation, jsonFileValidation, mochawesomeValidation, projectModulesValidation } from "./validation";

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