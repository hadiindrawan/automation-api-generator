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
import { defaultMochaConfig } from '../template/config.js';
import { isFileExisted } from '../utils/modul.js';
import { basedir } from '../utils/path.js';
import { waitFor } from '../utils/wait.js';
/**
 * @description asynchronous function to write runner into directory
 * @param {any[]} testsPath all generated test path
 * @returns {Promise<void>}
 */
export const writeRunner = (testsPath) => __awaiter(void 0, void 0, void 0, function* () {
    const mapTestbySuite = yield testsPath.reduce((result, element) => {
        const parts = element.split('/');
        const key = parts[2].includes('.js') ? 'Base' : parts[2].replace(/\s/g, '');
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(element);
        return result;
    }, {});
    try {
        const [fileExists] = yield isFileExisted(basedir(), ".mocharc.js");
        if (!fileExists) {
            mapTestbySuite['Regression'] = 'tests/scenarios/**/*.spec.js';
            let contents = defaultMochaConfig.replace('{{runner}}', JSON.stringify(mapTestbySuite));
            contents = contents.replace('{{ignorelist}}', '[\n// write your ignore tests here \n]');
            // create file test
            fs.writeFileSync(basedir() + '/.mocharc.js', contents, 'utf8');
            yield waitFor(500);
        }
        else {
            let current_contents = fs.readFileSync(basedir() + `/.mocharc.js`, 'utf8');
            let contents = defaultMochaConfig;
            const getTestListVariable = /const\s+runTestsList\s+=\s+(\{[\s\S]*?\});/;
            const match = getTestListVariable.exec(current_contents);
            const getIgnoreListVariable = /const\s+ignoreTestsList\s+=\s+(\[[\s\S]*?\]);/;
            const matchIgnore = getIgnoreListVariable.exec(current_contents);
            if (match && match[1]) {
                const convertObjectKey = /(\w+)\s*:/g;
                const finalString = match[1].replace(convertObjectKey, '"$1":');
                const runTestsList = JSON.parse(finalString);
                contents = contents.replace('{{runner}}', JSON.stringify(Object.assign(runTestsList, mapTestbySuite)));
            }
            else {
                console.log("Variable ignoreTestsList not found in the input string.");
            }
            if (matchIgnore && matchIgnore[1]) {
                contents = contents.replace('{{ignorelist}}', matchIgnore[1]);
            }
            else {
                console.log("Variable runTestsList not found in the input string.");
            }
            // create file test
            fs.writeFileSync(basedir() + '/.mocharc.js', contents, 'utf8');
            yield waitFor(500);
        }
    }
    catch (err) {
        console.log(err);
    }
});
