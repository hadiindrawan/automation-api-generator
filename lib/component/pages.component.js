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
import basePath from '../utils/path.js';
import { toLowerCase } from '../utils/string.js';
import { waitFor } from '../utils/wait.js';
/**
 * @description asynchronous function to write pages into directory
 * @param {pagesComponentInterface} writePagesParams included element json and all needed path
 * @returns {Promise<void>}
 */
export const writePages = (writePagesParams) => __awaiter(void 0, void 0, void 0, function* () {
    const { element, path, schemaPath, dataPath, helperPath, moduleType, configPath, loggerPath } = writePagesParams;
    // template dir name
    const templateDir = moduleType == "Javascript modules (import/export)" ? "lib/template/jsimport/pages.dot" : "lib/template/commonjs/pages.dot";
    const templateDirAttach = moduleType == "Javascript modules (import/export)" ? "lib/template/jsimport/pages_attach.dot" : "lib/template/commonjs/pages_attach.dot";
    // read template file
    let contents = fs.readFileSync(basePath() + templateDir, 'utf8');
    let name = toLowerCase(element.name);
    // write method
    let method;
    if (element.request.hasOwnProperty('method')) {
        method = yield element.request.method;
    }
    // write body
    let payload = '';
    const request = element.request;
    const requestBody = request.body;
    if (element.request.hasOwnProperty('body')) {
        if ((requestBody === null || requestBody === void 0 ? void 0 : requestBody.mode) === 'raw') {
            payload = '\r\n\t\t.send(await this.getMappedBody(await new requestHelper().getPayload(args)))';
        }
        else if ((requestBody === null || requestBody === void 0 ? void 0 : requestBody.mode) === 'formdata') {
            const formData = requestBody.formdata;
            if (formData.some((data) => data.type === 'file')) {
                contents = fs.readFileSync(basePath() + templateDirAttach, 'utf8');
            }
            else {
                contents = fs.readFileSync(basePath() + templateDir, 'utf8');
                payload = '\r\n\t\t.send(await this.getMappedBody(await new requestHelper().getPayload(args)))';
            }
        }
    }
    // write headers
    let headers = '';
    if (element.request.hasOwnProperty('header')) {
        yield asyncForEach(element.request.header, (header) => __awaiter(void 0, void 0, void 0, function* () {
            if (!header.disabled) {
                headers += '\r\n' + '\t\t' + '.set("' + header.key + '", "' + header.value + '")';
            }
        }));
    }
    // if any auth
    if (element.request.hasOwnProperty('auth')) {
        let auth = yield element.request.auth;
        if (auth.hasOwnProperty('bearer')) {
            headers += '\r\n' + '\t\t' + '.set("Authorization", "' + (auth.type).replace(/\w\S*/g, (auth.type).charAt(0).toUpperCase() + (auth.type).substr(1).toLowerCase()) + ' ' + auth.bearer[0].value + '")';
        }
    }
    // write endpoint
    let queries = '';
    if (element.request.hasOwnProperty('url')) {
        if (element.request.url.hasOwnProperty('query')) {
            let firstData = true;
            queries += '\r\n' + '\t\t' + '.query({ ';
            yield asyncForEach(element.request.url.query, (query) => __awaiter(void 0, void 0, void 0, function* () {
                if (query.disabled != true) {
                    if (firstData === false)
                        queries += ', ';
                    queries += query.key + ': "' + query.value + '"';
                    firstData = false;
                }
            }));
            queries += ' })';
        }
    }
    // write url
    let url = '';
    if (element.request.hasOwnProperty('url')) {
        let raw_url = yield element.request.url.raw;
        if (raw_url.includes('http')) {
            url = new URL(raw_url).pathname;
        }
        else {
            const fakeBase = 'https://fake.dot';
            let base = raw_url.split('/');
            url = new URL((raw_url).replace(base[0], fakeBase)).pathname;
        }
    }
    let code = contents.replace("{{method}}", (method).toLowerCase());
    code = code.replace("{{url}}", url);
    code = code.replace("{{query}}", queries);
    code = code.replace("{{header}}", headers);
    code = code.replace("{{payload}}", payload);
    if (element.request.hasOwnProperty('body')) {
        code = code.replace("{{body_section}}", `
        // This method used for provide body or payload of the request and return object
        async getMappedBody(...args) {
            const defaultData = new requestHelper().getDefaultData(data.${name.replace('-', '_').replace('(', '').replace(')', '')}_data)
            const dataMapped = await new requestHelper().mapObject(defaultData.driven, args);

            return dataMapped
        }
        `);
    }
    else {
        code = code.replace("{{body_section}}", '');
    }
    if (payload == '')
        code = code.replace("{{data_attach_name}}", `${name.replace('-', '_')}_data`);
    code = code.replace("{{path_schema}}", schemaPath.replace(/\\/g, "/") + '/' + method + '_' + name + '.schema.js');
    if (element.request.hasOwnProperty('body')) {
        let importStatement = moduleType === "Javascript modules (import/export)" ? "\n import * as data from '" : "\n const data = require('";
        let endPath = moduleType === "Javascript modules (import/export)" ? ".data.js'" : ".data.js')";
        if (dataPath.replace(/\\/g, "/").split('/').length >= 2) {
            code = code.replace("{{path_data}}", importStatement + dataPath.replace(/\\/g, "/").split('/').slice(0, 2).join('/') + `/${toLowerCase(dataPath.replace(/\\/g, "/").split('/')[1])}` + endPath);
        }
        else {
            code = code.replace("{{path_data}}", importStatement + dataPath.replace(/\\/g, "/") + `/${name}` + endPath);
        }
    }
    else {
        code = code.replace("{{path_data}}", '');
    }
    code = code.replace("{{path_helper}}", helperPath);
    code = code.replace("{{path_config}}", configPath);
    code = code.replace("{{path_logger}}", loggerPath);
    // check if pages file exists
    if (element.request.hasOwnProperty('url')) {
        try {
            const [fileExists] = yield isFileExisted(path, method + '_' + name + '.pages.js');
            if (!fileExists) {
                // create file test
                fs.writeFileSync(path + '/' + method + '_' + name + '.pages.js', code, 'utf8');
                yield waitFor(500);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
});
