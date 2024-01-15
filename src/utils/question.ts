import { jsonFileValidation, mochawesomeValidation, projectModulesValidation } from "./validation";

export const CLIQuestion = (scriptArg: string = "", packageList: any): any => {
	const {
		packagesExist,
		mochaExist,
		eslintExist
	} = packageList;

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
			when: (answers: any) => mochawesomeValidation(answers, packagesExist)
		},
		...commonQuestions,
	]

	const questions = (scriptArg === "generate") ? commonQuestions : fullQuestions;

	return questions
}