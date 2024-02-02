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
import { asyncForEach } from '../utils/foreach.js';
import { isFileExisted } from '../utils/modul.js';
import { waitFor } from '../utils/wait.js';
const readFile = promisify(fs.readFile);
/**
 * @description main environment generator
 * @param {any} file json file (.json)
 * @param {any} envName environment name
 * @returns {Promise<void>}
 */
export const generateEnv = (file, envName) => __awaiter(void 0, void 0, void 0, function* () {
    let envStr = '';
    const data = yield readFile(file, 'utf8');
    const { item: items } = JSON.parse(data);
    let first;
    asyncForEach(items, (item) => __awaiter(void 0, void 0, void 0, function* () {
        if (item.enabled) {
            if (first === false)
                envStr += '\r\n';
            envStr += item.key + '=' + item.value;
            first = false;
        }
    }));
    yield waitFor(100);
    // check if pages file exists
    isFileExisted(process.cwd(), '.env.' + envName)
        .then((data) => {
        if (!data[0]) {
            // create file test
            fs.writeFile('.env.' + envName, envStr, function (err) { if (err)
                throw err; });
            // _postman_isSubFolder
            console.log(`${'\x1b[32m'}ø  Generate environment file completed successfully${'\x1b[0m'}`);
        }
        else {
            console.log(`${'\x1b[33m'}ø The environment file has already created${'\x1b[0m'}`);
        }
    })
        .catch((err) => console.log(err));
});
