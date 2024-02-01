import fs from 'fs';

/**
 * @description check import type on exist file
 * @param {string} filePath file path
 * @param {string[]} searchStrings string will be searched
 * @returns {boolean} check result
 */
const checkImportType = (filePath: string, searchStrings: string[]): boolean => {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return searchStrings.some((searchString) => fileContent.includes(searchString));
    } catch {
        return true;
    }
}
/**
 * @description validate import type on exist file
 * @returns {boolean} validation result
 */
export const projectModulesValidation = (): boolean => {
    const dotenvImportChecks = ['import dotenv from "dotenv"', 'const dotenv = require("dotenv")'];
    const fsImportChecks = ['import fs from "fs"', 'const fs = require("fs")'];

    if (checkImportType('./tests/utils/config.js', dotenvImportChecks)) return false;
    if (checkImportType('./tests/helpers/request.helper.js', fsImportChecks)) return false;

    return true;
}
/**
 * @description check mocha package is existed
 * @param {any} answers question answer
 * @param {any} packagesExist existing package list
 * @returns {boolean} check result
 */
export const mochawesomeValidation = (answers: any, packagesExist: any): boolean => {
    if (answers.hasOwnProperty('frameworkQ')) {
        return answers.frameworkQ == "Mocha chai" && !packagesExist.includes('mochawesome') ? true : false
    } else {
        return !packagesExist.includes('mochawesome') ? true : false
    }
}
/**
 * @description json file question validation (.json)
 * @param {any} input question answer
 * @returns {boolean | string} check result
 */
export const jsonFileValidation = (input: any): boolean | string => {
    return input.includes('json') ? true : 'Please type correct answer, the file must be json format!'
}
/**
 * @description env name question validation, should lowercase
 * @param {any} input question answer
 * @returns {boolean | string} check result
 */
export const envNameValidation = (input: any): boolean | string => {
    return /[A-Z]/.test(input) ? 'Input must be lowercase!' : true
}