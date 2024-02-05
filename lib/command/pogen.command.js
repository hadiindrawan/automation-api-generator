var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';
import inquirer from 'inquirer';
import { CLIAutomationQuestion, CLIEnvironmentQuestion, CLIJSONQuestion } from '../utils/question.js';
import { existModuleType } from '../utils/modul.js';
import { runPrettier } from './prettier.command.js';
import { rebuildPackagejson } from '../utils/modul.js';
import { installDevPackge, installPackage } from './package_install.command.js';
import { log } from '../utils/logs.js';
import { generateEnv } from '../generator/generate_env.js';
import { defaultEslintConfig } from '../template/config.js';
import { generate } from '../generator/generate.js';
export class PogenCommand {
    constructor(scriptArg = "") {
        this.initiation = () => __awaiter(this, void 0, void 0, function* () {
            const execAsync = promisify(exec);
            try {
                const { stdout } = yield execAsync('npm list --json');
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
            }
            catch (error) {
                console.error(`exec error: ${error}`);
                throw new Error('Failed to check packages.');
            }
        });
        this.automation = () => __awaiter(this, void 0, void 0, function* () {
            const { packagesExist, stringPackage, mochaExist, eslintExist, prettierExist, } = yield this.initiation();
            let allAnswer = {};
            inquirer
                .prompt(yield CLIAutomationQuestion({
                argument: this.scriptArg,
                packagesList: packagesExist,
                mochaExist,
                eslintExist
            }))
                .then((answers) => __awaiter(this, void 0, void 0, function* () {
                Object.assign(allAnswer, answers);
                return yield CLIJSONQuestion(answers);
            }))
                .then((answers) => __awaiter(this, void 0, void 0, function* () {
                Object.assign(allAnswer, answers);
                const moduleType = allAnswer.moduleQ || (yield existModuleType());
                let stringDevPackage = '';
                if (allAnswer.eslintQ == 'Yes') {
                    stringDevPackage += ' eslint';
                    // Write eslint configuration
                    let newEslintConfig = defaultEslintConfig;
                    if (moduleType == "Javascript modules (import/export)") {
                        const jsonConfig = JSON.parse(defaultEslintConfig);
                        jsonConfig.parserOptions = { ecmaVersion: 'latest', sourceType: 'module' };
                        newEslintConfig = JSON.stringify(jsonConfig, null, 2);
                    }
                    fs.writeFile('.eslintrc.json', newEslintConfig, function (err) { if (err)
                        throw err; });
                }
                if (allAnswer.mochaweQ == 'Yes')
                    stringDevPackage += ' mochawesome';
                switch (true) {
                    case stringPackage !== '' && stringDevPackage !== '':
                        console.log("Installing dependencies...");
                        yield installPackage({
                            stringPackage,
                            stringDevPackage,
                            jsonfile: allAnswer,
                            moduleType,
                            prettierExist
                        });
                        break;
                    case stringPackage !== '' && stringDevPackage === '':
                        console.log("Installing dependencies...");
                        yield installPackage({
                            stringPackage,
                            stringDevPackage,
                            jsonfile: allAnswer,
                            moduleType,
                            prettierExist
                        });
                        break;
                    case stringPackage === '' && stringDevPackage !== '':
                        console.log("Installing dependencies...");
                        yield installDevPackge({
                            stringDevPackage,
                            jsonfile: allAnswer,
                            moduleType,
                            prettierExist
                        });
                        break;
                    case stringPackage === '' && stringDevPackage === '':
                        console.log(`${'\x1b[32m'}Dependencies already installed${'\x1b[0m'}`);
                        yield generate(allAnswer, moduleType);
                        yield runPrettier(prettierExist);
                        yield rebuildPackagejson();
                        break;
                    default:
                        break;
                }
            }))
                .catch((err) => __awaiter(this, void 0, void 0, function* () {
                log('Please type correct answer!', 'yellow');
                yield this.automation();
            }));
        });
        this.environment = () => __awaiter(this, void 0, void 0, function* () {
            inquirer
                .prompt(yield CLIEnvironmentQuestion())
                .then((answers) => __awaiter(this, void 0, void 0, function* () {
                //Print message indicating environment test generation has started..
                log(`Generating environment test..`, 'blue');
                //Call the generate function to generate environment tests.
                yield generateEnv(answers.jsonFileQ.includes('"') ? answers.jsonFileQ.replace(/"/g, '') : answers.jsonFileQ, answers.envQ);
            }))
                .catch((err) => __awaiter(this, void 0, void 0, function* () {
                log('Please type correct answer!', 'yellow');
                yield this.environment();
            }));
        });
        this.scriptArg = scriptArg;
    }
}
