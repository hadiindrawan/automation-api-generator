import fs from 'fs';
/**
 * @description check import type on exist file
 * @param {string} filePath file path
 * @param {string[]} searchStrings string will be searched
 * @returns {boolean} check result
 */
const checkImportType = (filePath, searchStrings) => {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return searchStrings.some((searchString) => fileContent.includes(searchString));
    }
    catch (_a) {
        return true;
    }
};
/**
 * @description validate import type on exist file
 * @returns {boolean} validation result
 */
export const projectModulesValidation = () => {
    const dotenvImportChecks = ['import dotenv from "dotenv"', 'const dotenv = require("dotenv")'];
    const fsImportChecks = ['import fs from "fs"', 'const fs = require("fs")'];
    if (checkImportType('./tests/utils/config.js', dotenvImportChecks))
        return false;
    if (checkImportType('./tests/helpers/request.helper.js', fsImportChecks))
        return false;
    return true;
};
/**
 * @description check mocha package is existed
 * @param {any} answers question answer
 * @param {any} packagesExist existing package list
 * @returns {boolean} check result
 */
export const mochawesomeValidation = (answers, packagesExist) => {
    if (answers.hasOwnProperty('frameworkQ')) {
        return answers.frameworkQ == "Mocha chai" && !packagesExist.includes('mochawesome') ? true : false;
    }
    else {
        return !packagesExist.includes('mochawesome') ? true : false;
    }
};
/**
 * @description json file question validation (.json)
 * @param {any} input question answer
 * @returns {boolean | string} check result
 */
export const jsonFileValidation = (input) => {
    return input.includes('json') ? true : 'Please type correct answer, the file must be json format!';
};
/**
 * @description env name question validation, should lowercase
 * @param {any} input question answer
 * @returns {boolean | string} check result
 */
export const envNameValidation = (input) => {
    return /[A-Z]/.test(input) ? 'Input must be lowercase!' : true;
};
