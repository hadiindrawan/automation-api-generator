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
import { isFileExisted } from '../utils/modul.js';
import basePath from '../utils/path.js';
import { waitFor } from '../utils/wait.js';
/**
 * @description asynchronous function to write helper into directory
 * @param {string} moduleType module type will be used
 * @returns {Promise<void>}
 */
export const writeHelper = (moduleType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const writeFile = promisify(fs.writeFile);
        // template dir name
        const templateDirRequest = moduleType == "Javascript modules (import/export)" ? "lib/template/jsimport/request_helper.dot" : "lib/template/commonjs/request_helper.dot";
        // create helper directory if it doesn't exists
        const helperDir = "tests/helpers";
        fs.mkdirSync(helperDir, { recursive: true });
        // Check if a file named 'request.helper.js' exists in the tests/helper dir
        // If it does not exist then create a new file based on the template file 'requestHelper.dot'
        const [fileExists] = yield isFileExisted(helperDir, "request.helper.js");
        if (!fileExists) {
            // create file test
            writeFile("tests/helpers/request.helper.js", fs.readFileSync(basePath() + templateDirRequest, "utf8"));
            yield waitFor(500);
        }
    }
    catch (err) {
        console.log(err);
    }
});
