/**
 * @description validate import type on exist file
 * @returns {boolean} validation result
 */
export declare const projectModulesValidation: () => boolean;
/**
 * @description check mocha package is existed
 * @param {any} answers question answer
 * @param {any} packagesExist existing package list
 * @returns {boolean} check result
 */
export declare const mochawesomeValidation: (answers: any, packagesExist: any) => boolean;
/**
 * @description json file question validation (.json)
 * @param {any} input question answer
 * @returns {boolean | string} check result
 */
export declare const jsonFileValidation: (input: any) => boolean | string;
/**
 * @description env name question validation, should lowercase
 * @param {any} input question answer
 * @returns {boolean | string} check result
 */
export declare const envNameValidation: (input: any) => boolean | string;
