import fs from 'fs'
import { promisify } from 'util';
import { exec } from 'child_process';
import inquirer from 'inquirer';
import { CLIAutomationQuestion, CLIEnvironmentQuestion, CLIJSONQuestion } from 'utils/question';
import { existModuleType } from 'utils/modul';
import { runPrettier } from './prettier.command';
import { rebuildPackagejson } from 'utils/modul';
import { installDevPackge, installPackage } from './package_install.command';
import { log } from 'utils/logs';
import { generateEnv } from 'generator/generate_env';
import { defaultEslintConfig } from 'template/config';
import { generate } from 'generator/generate';

export class PogenCommand {
	private scriptArg?: string | undefined;

	constructor(scriptArg: string = "") {
		this.scriptArg = scriptArg;
	}

	initiation = async (): Promise<{ [key: string]: boolean | string[] | string }> => {
		const execAsync = promisify(exec);

		try {
			const { stdout } = await execAsync('npm list --json');
			const packageList = JSON.parse(stdout).dependencies || {};
			const packagesExist = Object.keys(packageList);

			// Define required packages
			const needPackage = [
				'@babel/preset-env',
				'@babel/register',
				'babel-plugin-module-resolver',
				'chai',
				'mocha',
				'chai-http',
				'chai-json-schema',
				'dotenv',
				'to-json-schema',
				'cross-env',
				'winston',
			];

			// Filter packages that are not installed
			const matchedPack = needPackage.filter(key => !packagesExist.includes(key));

			// Join packages into a string
			const stringPackage = matchedPack.join(' ');

			return {
				packagesExist,
				stringPackage,
				mochaExist: !packagesExist.includes('mocha'),
				eslintExist: !packagesExist.includes('eslint'),
				prettierExist: !packagesExist.includes('prettier'),
			};
		} catch (error) {
			console.error(`exec error: ${error}`);
			throw new Error('Failed to check packages.');
		}
	}

	automation = async (): Promise<void> => {
		const {
			packagesExist,
			stringPackage,
			mochaExist,
			eslintExist,
			prettierExist,
		} = await this.initiation();

		let allAnswer: any = {};
		inquirer
			.prompt(
				await CLIAutomationQuestion({
					argument: this.scriptArg,
					packagesList: packagesExist,
					mochaExist,
					eslintExist
				})
			)
			.then(async (answers) => {
				Object.assign(allAnswer, answers);
				return await CLIJSONQuestion(answers);
			})
			.then(async (answers) => {
				Object.assign(allAnswer, answers);

				const moduleType = allAnswer.moduleQ || await existModuleType()
				let stringDevPackage = ''
				if (allAnswer.eslintQ == 'Yes') {
					stringDevPackage += ' eslint'

					// Write eslint configuration
					let newEslintConfig = defaultEslintConfig;
					if (moduleType == "Javascript modules (import/export)") {
						const jsonConfig = JSON.parse(defaultEslintConfig)
						jsonConfig.parserOptions = { ecmaVersion: 'latest', sourceType: 'module' }
						newEslintConfig = JSON.stringify(jsonConfig, null, 2)
					}

					fs.writeFile('.eslintrc.json', newEslintConfig, function (err) { if (err) throw err; });
				}

				if (allAnswer.mochaweQ == 'Yes') stringDevPackage += ' mochawesome'

				switch (true) {
					case stringPackage !== '' && stringDevPackage !== '':
						console.log("Installing dependencies...");
						await installPackage({
							stringPackage,
							stringDevPackage,
							jsonfile: allAnswer,
							moduleType,
							prettierExist
						})
						break;

					case stringPackage !== '' && stringDevPackage === '':
						console.log("Installing dependencies...");
						await installPackage({
							stringPackage,
							stringDevPackage,
							jsonfile: allAnswer,
							moduleType,
							prettierExist
						})
						break;

					case stringPackage === '' && stringDevPackage !== '':
						console.log("Installing dependencies...");
						await installDevPackge({
							stringDevPackage,
							jsonfile: allAnswer,
							moduleType,
							prettierExist
						})
						break;

					case stringPackage === '' && stringDevPackage === '':
						console.log(`${'\x1b[32m'}Dependencies already installed${'\x1b[0m'}`)
						await generate(allAnswer, moduleType);
						await runPrettier(prettierExist);
						await rebuildPackagejson();
						break;

					default:
						break;
				}
			})
			.catch(async (err) => {
				log('Please type correct answer!', 'yellow')
				await this.automation()
			})
	}

	environment = async (): Promise<void> => {
		inquirer
			.prompt(await CLIEnvironmentQuestion())
			.then(async (answers) => {
				//Print message indicating environment test generation has started..
				log(`Generating environment test..`, 'blue')

				//Call the generate function to generate environment tests.
				await generateEnv(answers.jsonFileQ.includes('"') ? answers.jsonFileQ.replace(/"/g, '') : answers.jsonFileQ, answers.envQ)
			})
			.catch(async (err) => {
				log('Please type correct answer!', 'yellow')
				await this.environment()
			})
	}
}