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
import { asyncForEach } from "../utils/foreach.js";
import { isFileExisted } from "../utils/modul.js";
import { basedir } from "../utils/path.js";
import { toLowerCase } from "../utils/string.js";
import { waitFor } from "../utils/wait.js";
/**
 * @description asynchronous function to write data into directory
 * @param {dataComponentInterface} writeDataParams included element json, path and module type
 * @returns {Promise<void>}
 */
export const writeData = (writeDataParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { element, path, moduleType } = writeDataParams;
    // Here, a constant variable dataDir is declared and assigned to the string 'tests/data/file'.
    // console.log({ element, path });
    let template = `export const {{var_name}} = [{{ddt}}]`;
    const ddt = {
        case: {
            name: "Successful login",
            schema: "success",
            status: 200,
            default: true
        },
        driven: {},
        attachment: {}
    };
    if (element.request.hasOwnProperty('body')) {
        try {
            fs.mkdirSync(path, { recursive: true });
        }
        catch (err) {
            console.log(err);
        }
    }
    // write body
    let bodyRaw = '';
    let attKey = '';
    if (element.request.hasOwnProperty('body')) {
        if (((_a = element.request.body) === null || _a === void 0 ? void 0 : _a.mode) == 'raw') {
            bodyRaw = yield element.request.body.raw;
        }
        else if (((_b = element.request.body) === null || _b === void 0 ? void 0 : _b.mode) == 'formdata') {
            let data = yield element.request.body.formdata;
            let first = true;
            let first1 = true;
            bodyRaw += '{' + '\r\n' + '\t\t\t';
            attKey += '{' + '\r\n' + '\t\t\t';
            if (data.some((datas) => datas['type'] === 'file')) {
                yield asyncForEach(data, (body) => __awaiter(void 0, void 0, void 0, function* () {
                    // console.log(body);
                    if (body.disabled !== true) {
                        let value = yield body.value;
                        if (body.type === 'text') {
                            bodyRaw += `"${body.key}": "${value}"`;
                        }
                        else if (body.type === 'text' && (value.includes('{') || value.includes('['))) {
                            bodyRaw += `"${body.key}": ${value}`;
                        }
                        else {
                            let src = (typeof body.src !== 'object') ? body.src : JSON.stringify(body.src);
                            attKey += `${first1 === false ? ',' : ''}\r\n\t\t\t"${body.key}": "${src}"`;
                            first1 = false;
                        }
                    }
                }));
            }
            else {
                yield asyncForEach(data.filter((body) => body.disabled !== true), (body) => __awaiter(void 0, void 0, void 0, function* () {
                    if (first === false) {
                        bodyRaw += ',\r\n\t\t\t';
                    }
                    bodyRaw += `"${body.key}": "${body.value}"`;
                    first = false;
                }));
            }
            bodyRaw += '\r\n' + '\t\t' + '}';
            attKey += '\r\n' + '\t\t' + '}';
            yield waitFor(50);
        }
    }
    let name = toLowerCase(element.name);
    if (element.request.hasOwnProperty('body')) {
        ddt.driven = JSON.parse(bodyRaw);
        if (attKey != '')
            ddt.attachment = JSON.parse(attKey);
        template = template.replace('{{var_name}}', `${name.replace('-', '_').replace('(', '').replace(')', '')}_data`);
        template = template.replace('{{ddt}}', JSON.stringify(ddt));
        yield waitFor(50);
        const path_split = path.split('/');
        if (path_split.length > 2) {
            const suite_name = path_split[2].toLowerCase().replace(/\s/g, '') + '.data.js';
            try {
                const [fileExists] = yield isFileExisted(path, suite_name);
                if (!fileExists) {
                    // create file test
                    fs.writeFileSync(`${path}/${suite_name}`, template, 'utf8');
                    yield waitFor(200);
                }
                else {
                    let current_contents = fs.readFileSync(basedir() + `/${path}/${suite_name}`, 'utf8');
                    const regex = /(?<=export const\s)\w+(?=\s=)/g;
                    const var_name_list = current_contents.match(regex) || '';
                    if (!var_name_list.includes(`${name.replace('-', '_')}_data`)) {
                        current_contents += '\n\n' + template;
                    }
                    fs.writeFileSync(`${path}/${suite_name}`, current_contents, 'utf8');
                    yield waitFor(200);
                }
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            const fileName = `${name}.data.js`;
            try {
                const [fileExists] = yield isFileExisted(path, fileName);
                if (!fileExists) {
                    // create file test
                    fs.writeFileSync(`${path}/${fileName}`, template, 'utf8');
                    yield waitFor(500);
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    }
});
