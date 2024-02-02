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
import { isFileExisted } from '../utils/modul.js';
import basePath from '../utils/path.js';
import { waitFor } from '../utils/wait.js';
/**
 * @description asynchronous function to write utils into directory
 * @param {string} moduleType module type will be used
 * @returns {Promise<void>}
 */
export const writeUtils = (moduleType) => __awaiter(void 0, void 0, void 0, function* () {
    // create helper directory if it doesn't exists
    const utilsDir = "tests/utils";
    fs.mkdirSync(utilsDir, { recursive: true });
    const utilsList = [
        'config',
        'logger',
        'custom_file_transport'
    ];
    for (const util of utilsList) {
        // template dir name
        const templateDir = moduleType == "Javascript modules (import/export)" ? `lib/template/jsimport/${util}.dot` : `lib/template/commonjs/${util}.dot`;
        // Check if a file named 'request.helper.js' exists in the tests/helper dir
        // If it does not exist then create a new file based on the template file 'requestHelper.dot'
        try {
            const [fileExists] = yield isFileExisted(utilsDir, `${util}.js`);
            if (!fileExists) {
                // create file test
                fs.writeFileSync(`tests/utils/${util}.js`, fs.readFileSync(basePath() + templateDir, "utf8"), 'utf8');
                yield waitFor(500);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
});
