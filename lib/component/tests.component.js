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
import { log } from "../utils/logs.js";
import { isFileExisted } from "../utils/modul.js";
import basePath from "../utils/path.js";
import { toLowerCase } from "../utils/string.js";
import { waitFor } from "../utils/wait.js";
/**
 * @description asynchronous function to write tests into directory
 * @param {testComponentInterface} writeTestParams included element json and all needed path
 * @returns {Promise<void>}
 */
export const writeTest = (writeTestParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { element, path, pagesPath, dataPath, moduleType, configPath } = writeTestParams;
    // template dir name
    const templateDir = moduleType == "Javascript modules (import/export)" ? "lib/template/jsimport/spec.dot" : "lib/template/commonjs/spec.dot";
    // read template fileimport { log } from './../utils/logs.js';
    let contents = fs.readFileSync(basePath() + templateDir, 'utf8');
    let name = toLowerCase(element.name);
    const method = (_b = (_a = element.request) === null || _a === void 0 ? void 0 : _a.method) !== null && _b !== void 0 ? _b : '';
    let testFunc = '';
    if (element.request.hasOwnProperty('body')) {
        testFunc = `
        data.${toLowerCase(element.name).replace('(', '').replace(')', '')}_data.forEach(async (data) => {
            it(data.case.name, async () => {
                const response = await new Request().api(data.driven)

                expect(response.status).to.equals(data.case.status)
                expect(response.body).to.be.jsonSchema(new Request().expect(data.case.schema))
            })
        })
        `;
    }
    else {
        testFunc = `
        it("Successful case", async () => {
            const response = await new Request().api()

            expect(response.status).to.equals(200)
            expect(response.body).to.be.jsonSchema(new Request().expect("success"))
        })
        `;
    }
    let suiteDataPath = toLowerCase(element.name);
    let code = contents.replace("{{describe}}", 'Test ' + element.name);
    code = code.replace("{{page_path}}", pagesPath.replace(/\\/g, "/") + '/' + method + '_' + name + '.pages.js');
    if (element.request.hasOwnProperty('body')) {
        let importStatement = moduleType === "Javascript modules (import/export)" ? "\n import * as data from '" : "\n const data = require('";
        let endPath = moduleType === "Javascript modules (import/export)" ? ".data.js'" : ".data.js')";
        if (dataPath.replace(/\\/g, "/").split('/').length >= 2) {
            code = code.replace("{{data_path}}", importStatement + dataPath.replace(/\\/g, "/").split('/').slice(0, 2).join('/') + `/${toLowerCase(dataPath.replace(/\\/g, "/").split('/')[1])}` + endPath);
        }
        else {
            code = code.replace("{{data_path}}", importStatement + dataPath.replace(/\\/g, "/") + `/${suiteDataPath}` + endPath);
        }
    }
    else {
        code = code.replace("{{data_path}}", '');
    }
    code = code.replace("{{config_path}}", configPath);
    code = code.replace("{{test_section}}", testFunc);
    // check if file exists
    if (element.request.hasOwnProperty('url')) {
        try {
            const [fileExists] = yield isFileExisted(path, method + '_' + name + '.spec.js');
            if (!fileExists) {
                // create file test
                fs.writeFileSync(path + '/' + method + '_' + name + '.spec.js', code, 'utf8');
                yield waitFor(500);
                log(`ø  Generate Test ${path.replace(/\\/g, "/") + '/' + method + '_' + name + '.spec.js'} completed successfully`, 'green');
            }
            else {
                // file was existed
                log(`ø The request of ${element.name} has already created`, 'yellow');
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    else {
        // invalid request
        log(`ø ${element.name} was invalid request!`, 'red');
    }
});
