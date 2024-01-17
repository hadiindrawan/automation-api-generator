import fs from 'fs';

export const projectModulesValidation = (): boolean => {
    try {
        const checkConfigImport = fs.readFileSync('./tests/utils/config.js').toString()
        const checkHelperImport = fs.readFileSync('./tests/helpers/request.helper.js').toString()

        if (checkConfigImport.includes('import dotenv from "dotenv"') || checkHelperImport.includes('import fs from "fs"')) return false
        if (checkConfigImport.includes('const dotenv = require("dotenv")') || checkHelperImport.includes('const fs = require("fs")')) return false
        return true
    } catch (e) {
        return true
    }
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