import fs from 'fs'
import { promisify } from 'util';
import { exec } from 'child_process';
import inquirer from 'inquirer';
import { CLIQuestion } from 'utils/question';
import { existModuleType } from 'utils/modul';
import { default_eslint } from 'template/config';
import { runPrettier } from './prettier.command';
import generate from 'generator/generate';
import { rebuildPackagejson } from 'utils/modul';
import { installDevPackge, installPackage } from './package_install.command';
const readFile = promisify(fs.readFile);

async function generateCommand(scriptArg: string = "") {
	exec('npm list --json', (error, stdout) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		// Parse the JSON object from stdout, and assign any dependencies to packageList variable
		const packageList = JSON.parse(stdout).dependencies;
		// Set packagesExist variable to list of object keys if packageList is not undefined, otherwise set packagesExist to an empty array
		const packagesExist = packageList !== undefined ? Object.keys(packageList) : [];

		let needPackage = ['@babel/preset-env', '@babel/register', 'babel-plugin-module-resolver', 'chai', 'mocha', 'chai-http', 'chai-json-schema', 'dotenv', 'to-json-schema', 'cross-env']
		let matchedPack = needPackage.filter(key => !packagesExist.includes(key))
		let strPackageList = matchedPack.join(' ')

		let mochaExist = packagesExist.includes('mocha') ? false : true
		let eslintExist = packagesExist.includes('eslint') ? false : true
		let prettierExist = packagesExist.includes('prettier') ? false : true

		const packageData = {
			packagesExist,
			mochaExist,
			eslintExist
		}

		function question() {
			let allAnswer: any = {};

			inquirer
				.prompt(CLIQuestion(scriptArg, packageData))
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
							validate: function (value) {
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
					let moduleType = allAnswer.moduleQ || await existModuleType()

					let npm = ''
					if (allAnswer.eslintQ == 'Yes') {
						npm += ' eslint'

						// Write eslint configuration
						let newEslintConfig = default_eslint;
						if (moduleType == "Javascript modules (import/export)") {
							const jsonConfig = JSON.parse(default_eslint)
							jsonConfig.parserOptions = { ecmaVersion: 'latest', sourceType: 'module' }

							newEslintConfig = JSON.stringify(jsonConfig, null, 2)
						}

						fs.writeFile('.eslintrc.json', newEslintConfig, function (err) { if (err) throw err; });
					}

					if (allAnswer.mochaweQ == 'Yes') npm += ' mochawesome'

					switch (true) {
						case strPackageList !== '' && npm !== '':
							console.log("Installing dependencies...");
							await installPackage(strPackageList, npm, allAnswer, moduleType, prettierExist);
							break;

						case strPackageList !== '' && npm === '':
							console.log("Installing dependencies...");
							await installPackage(strPackageList, npm, allAnswer, moduleType, prettierExist);
							break;

						case strPackageList === '' && npm !== '':
							console.log("Installing dependencies...");
							await installDevPackge(npm, allAnswer, moduleType, prettierExist);
							break;

						case strPackageList === '' && npm === '':
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
					await generateCommand()
				})
		}
		question()
	})
}