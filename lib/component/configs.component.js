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
import { asyncForEach } from '../utils/foreach.js';
import { isFileExisted } from '../utils/modul.js';
import { basedir } from '../utils/path.js';
import { waitFor } from '../utils/wait.js';
/**
 * @description asynchronous function to write config into directory
 * @param {any[]} configList config list will be write
 * @returns {Promise<void>}
 */
export const writeConfigs = (configList) => __awaiter(void 0, void 0, void 0, function* () {
    yield asyncForEach(configList, (item) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [fileExists] = yield isFileExisted(basedir(), `${item.filename}`);
            if (!fileExists) {
                // create file test
                fs.writeFileSync(basedir() + `/${item.filename}`, item.template, "utf8");
                yield waitFor(500);
            }
        }
        catch (err) {
            console.log(err);
        }
    }));
});
