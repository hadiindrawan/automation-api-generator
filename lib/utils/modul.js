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
import { log } from './logs.js';
/**
 * @description Check the file is existed or not
 * @param {string} path the path for destination
 * @param {string} fileName filename which want to search
 * @returns {Promise<Array[boolean, string | null]>}
 */
export function isFileExisted(path, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = fs.readdirSync(path);
        for (let file of data) {
            const curPath = path + '/' + file;
            if (file === 'node_modules') {
                continue;
            }
            else if (fs.statSync(curPath).isDirectory()) {
                const res = yield isFileExisted(curPath, fileName);
                if (res[0])
                    return [true, res[1]];
            }
            else if (file === fileName) {
                return [true, curPath];
            }
        }
        return [false, null];
    });
}
/**
 * @description Check JS module type
 * @returns {Promise<boolean | string>}
 */
export const existModuleType = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkConfigImport = fs.readFileSync('./tests/utils/config.js').toString();
        const checkHelperImport = fs.readFileSync('./tests/helpers/request.helper.js').toString();
        if (checkConfigImport.includes('import dotenv from "dotenv"') || checkHelperImport.includes('import fs from "fs"'))
            return "Javascript modules (import/export)";
        return "CommonJS (require/exports)";
    }
    catch (e) {
        return true;
    }
});
/**
 * @description Rebuild script package
 * @returns {Promise<void>}
 */
export const rebuildPackagejson = () => __awaiter(void 0, void 0, void 0, function* () {
    const scriptName = 'regression:dev'; // Name of your new script
    const scriptCommand = 'cross-env NODE_ENV=dev mocha --specs Regression --timeout 15000'; // Command to execute your script
    try {
        // Read the package.json answers.jsonFileQ
        const packageJson = yield JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        // Add the new script to the scripts object
        packageJson['scripts'] = packageJson['scripts'] || {}; // Initialize 'scripts' object if it doesn't exist
        packageJson.scripts[scriptName] = scriptCommand; // Assign the script command to the given script name
        // Write the updated package.json answers.jsonFileQ
        fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
        log(`Script updated in package.json`, 'green');
    }
    catch (err) {
        console.error('Failed to update package.json:', err);
    }
});
