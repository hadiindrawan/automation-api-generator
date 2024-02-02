var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs";
import { isFileExisted } from "../utils/modul.js";
import basePath from "../utils/path.js";
import { waitFor } from "../utils/wait.js";
/**
 * @description asynchronous function to write schema into directory
 * @param {schemaComponentInterface} writeSchemaParams included element json, path, and module type
 * @returns {Promise<void>}
 */
export const writeSchema = (writeSchemaParams) => __awaiter(void 0, void 0, void 0, function* () {
    const { element, path, moduleType } = writeSchemaParams;
    // template dir name
    const templateDir = moduleType == "Javascript modules (import/export)" ? "lib/template/jsimport/schema.dot" : "lib/template/commonjs/schema.dot";
    // The following code creates a variable called 'name' and assigns it the value obtained from the 'name' property of the 'element' object, which is then converted to lowercase and all spaces in it are removed.
    let name = (element.name).toLowerCase().replace(/\s/g, '');
    name = name.replace(/\//g, '');
    // A variable called 'method' is created and assigned the value obtained from the 'method' property of the 'element.request' object.
    let method;
    if (element.request.hasOwnProperty('method')) {
        method = element.request.method;
    }
    // check if file exists
    if (element.request.hasOwnProperty('url')) {
        try {
            const [fileExists] = yield isFileExisted(path, method + '_' + name + '.schema.js');
            if (!fileExists) {
                // create file test
                fs.writeFileSync(path + '/' + method + '_' + name + '.schema.js', fs.readFileSync(basePath() + templateDir, 'utf8'), 'utf8');
                yield waitFor(500);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
});
