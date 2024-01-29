import fs from 'fs';

const checkForImport = (filePath: string, searchStrings: string[]): boolean => {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return searchStrings.some((searchString) => fileContent.includes(searchString));
    } catch {
        return true;
    }
}

export const projectModulesValidation = (): boolean => {
    const dotenvImportChecks = ['import dotenv from "dotenv"', 'const dotenv = require("dotenv")'];
    const fsImportChecks = ['import fs from "fs"', 'const fs = require("fs")'];

    if (checkForImport('./tests/utils/config.js', dotenvImportChecks)) return false;
    if (checkForImport('./tests/helpers/request.helper.js', fsImportChecks)) return false;

    return true;
}


export const mochawesomeValidation = (answers: any, packagesExist: any): boolean => {
    if (answers.hasOwnProperty('frameworkQ')) {
        return answers.frameworkQ == "Mocha chai" && !packagesExist.includes('mochawesome') ? true : false
    } else {
        return !packagesExist.includes('mochawesome') ? true : false
    }
}

export const jsonFileValidation = (input: any): boolean | string => {
    return input.includes('json') ? true : 'Please type correct answer, the file must be json format!'
}

export const envNameValidation = (input: any): boolean | string => {
    return /[A-Z]/.test(input) ? 'Input must be lowercase!' : true
}