import fs from 'fs'
import { promisify } from 'util';
import { exec } from 'child_process';
import inquirer from 'inquirer';
import { CLIAutomationQuestion, CLIEnvironmentQuestion } from 'utils/question';
import { existModuleType } from 'utils/modul';
import { runPrettier } from './prettier.command';
import { rebuildPackagejson } from 'utils/modul';
import { installDevPackge, installPackage } from './package_install.command';
import { log } from 'utils/logs';
import generateEnv from 'generator/generate_env';
import { defaultEslintConfig } from 'template/config';
import { generate } from 'generator/generate';
const readFile = promisify(fs.readFile);

export class PogenCommand {
	private scriptArg?: string | undefined;

	constructor(scriptArg: string = "") {
		this.scriptArg = scriptArg;
	}

	automation = async () => {
		exec('npm list --json', (error, stdout) => {
			if (error) {
				console.error(`exec error: ${error}`);
				return;
			}
			// Parse the JSON object from stdout, and assign any dependencies to packageList variable
			const packageList = JSON.parse(stdout).dependencies;
			// Set packagesExist variable to list of object keys if packageList is not undefined, otherwise set packagesExist to an empty array
			const packagesExist = packageList !== undefined ? Object.keys(packageList) : [];

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
			const matchedPack = needPackage.filter(key => !packagesExist.includes(key));
			const stringPackage = matchedPack.join(' ');

			const mochaExist = packagesExist.includes('mocha') ? false : true;
			const eslintExist = packagesExist.includes('eslint') ? false : true;
			const prettierExist = packagesExist.includes('prettier') ? false : true;

			async function question(this: PogenCommand) {
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
						const data = await readFile(answers.jsonFileQ.includes('"') ? answers.jsonFileQ.replace(/"/g, '') : answers.jsonFileQ, 'utf8');
						const { item: items } = JSON.parse(data)

						const sortedArr = await items.sort((a: any, b: any) => {
							// Check if 'item' property exists in both objects
							const aHasItem = Object.prototype.hasOwnProperty.call(a, 'item');
							const bHasItem = Object.prototype.hasOwnProperty.call(b, 'item');

							// Sort based on presence of 'item' property
							if (aHasItem && !bHasItem) return 1;
							if (!aHasItem && bHasItem) return -1;

							return 0;
						});

						const option = await sortedArr.map((item: any) => item.hasOwnProperty('item') ? { name: `${item.name} - (suite)` } : { name: `${item.name} - (test)` });

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
								console.log("Installing dependencies...");
								await generate(allAnswer, moduleType);
								await runPrettier(prettierExist);
								await rebuildPackagejson();
								break;

							default:
								break;
						}
					})
					.catch(async (err) => {
						console.log(err);
						console.log('Please type correct answer!');
						await this.automation()
					})
			}
			question.call(this)
		})
	}

	environment = async () => {
		inquirer
			.prompt(await CLIEnvironmentQuestion())
			.then((answers) => {
				//Print message indicating environment test generation has started..
				log(`Generating environment test..`, 'blue')

				//Call the generate function to generate environment tests.
				generateEnv(answers.jsonFileQ.includes('"') ? answers.jsonFileQ.replace(/"/g, '') : answers.jsonFileQ, answers.envQ)
			})
			.catch((err) => {
				console.log(err);
				log('Please type correct answer!', 'yellow')
				this.environment()
			})
	}
}