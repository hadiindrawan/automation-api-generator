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
import inquirer from 'inquirer';
import { envNameValidation, jsonFileValidation, mochawesomeValidation, projectModulesValidation } from "./validation.js";
const readFile = promisify(fs.readFile);
/**
 * @description questions list for automation generation
 * @param {CLIAutomationQuestionInterface} automationQuestionParams included the script arguments and needed package states
 * @returns {Promise<any>}
 */
export const CLIAutomationQuestion = (automationQuestionParams) => __awaiter(void 0, void 0, void 0, function* () {
    const { argument, packagesList, mochaExist, eslintExist } = automationQuestionParams;
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
            validate: (answers) => jsonFileValidation(answers)
        }
    ];
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
            when: (answers) => mochawesomeValidation(answers, packagesList)
        },
        ...commonQuestions,
    ];
    const questions = (argument === "generate") ? commonQuestions : fullQuestions;
    return questions;
});
/**
 * @description questions list for json selected options
 * @param {any} answers options
 * @returns {Promise<any>}
 */
export const CLIJSONQuestion = (answers) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield readFile(answers.jsonFileQ.includes('"') ? answers.jsonFileQ.replace(/"/g, '') : answers.jsonFileQ, 'utf8');
        const { item: items } = JSON.parse(data);
        // Assuming that we want to push items with the 'item' property to the end of the array
        const sortedArr = items.sort((a, b) => {
            return (a.item === undefined ? -1 : 0) + (b.item === undefined ? 0 : 1);
        });
        const option = sortedArr.map((item) => ({
            name: `${item.name} - ${item.hasOwnProperty('item') ? '(suite)' : '(test)'}`
        }));
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
    }
    catch (error) {
        console.error(`Error processing file: ${error.message}`);
    }
});
/**
 * @description questions list for environment generation
 * @returns {Promise<any>}
 */
export const CLIEnvironmentQuestion = () => __awaiter(void 0, void 0, void 0, function* () {
    return [
        {
            type: 'input',
            name: 'jsonFileQ',
            message: 'Input your json file to be generate (example.json):',
            default: 'example-env.json',
            validate: (answers) => jsonFileValidation(answers)
        },
        {
            type: 'input',
            name: 'envQ',
            message: 'Input your environment name:',
            default: 'dev',
            validate: (answers) => envNameValidation(answers)
        }
    ];
});
