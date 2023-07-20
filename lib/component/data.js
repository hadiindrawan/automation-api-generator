import fs from "fs";
import basePath from "../utils/base_path.js";
import isFileExisted from "../utils/check_dir.js";
import asyncForEach from "../utils/foreach.js";
import { toLowerCase } from "../utils/string.js";
import waitFor from "../utils/wait.js";

// This is an asynchronous function called writeData.
async function writeData(element, path, moduleType) {
    // Here, a constant variable dataDir is declared and assigned to the string 'tests/data/file'.
    // console.log({ element, path });
    let template = `export const {{var_name}} = [{{ddt}}]`

    let ddt = {
        case: {
            name: "Successful login",
            schema: "success",
            status: 200,
            default: true
        },
        driven: {}
    }

    if (element.request.hasOwnProperty('body')) fs.mkdirSync(path, { recursive: true }, function (err) { if (err) throw err; })

    // write body
    let bodyRaw = ''
    let attKey = ''

    if (element.request.hasOwnProperty('body')) {
        if (element.request.body?.mode == 'raw') {
            bodyRaw = element.request.body.raw
        } else
        if (element.request.body?.mode == 'formdata') {
            let data = element.request.body.formdata
            let first = true
            let first1 = true
            bodyRaw += '{' + '\r\n' + '\t\t\t'
            attKey += '{' + '\r\n' + '\t\t\t'

            if (data.some(datas => datas['type'] === 'file')) {
                await asyncForEach(data, async (body) => {
                    if (body.disabled !== true) {
                        let value = body.value;
                    
                        if (body.type === 'text' && (value.includes('{') || value.includes('['))) {
                            bodyRaw += `"${body.key}": ${value}`;
                        } else {
                            let target = (typeof body.src !== 'object') ? attKey : JSON.stringify(body.src);
                            target += `${first1 === false ? ',' : ''}\r\n\t\t\t"${body.key}": "${value}"`;
                            first1 = false;
                        }
                    }
                });
            } else {
                await asyncForEach(data.filter(body => body.disabled !== true), async (body) => {
                    if (first === false) {
                        bodyRaw += ',\r\n\t\t\t';
                    }
                    bodyRaw += `"${body.key}": "${body.value}"`;
                    first = false;
                });
            }

            bodyRaw += '\r\n' + '\t\t' + '}'
            attKey += '\r\n' + '\t\t' + '}'
            await waitFor(50);
        }
    }

    let name = toLowerCase(element.name)

    if (element.request.hasOwnProperty('body')) {
        ddt.driven = JSON.parse(bodyRaw)
        template = template.replace('{{var_name}}', `${name.replace('-', '_').replace('(', '').replace(')', '')}_data`)
        template = template.replace('{{ddt}}', JSON.stringify(ddt))
        await waitFor(50);

        const path_split = path.split('/');
        if (path_split.length > 2) {
            const suite_name = path_split[2].toLowerCase().replace(/\s/g, '') + '.data.js';
            try {
                const [fileExists] = await isFileExisted(path, suite_name);
                if (!fileExists) {
                    // create file test
                    fs.writeFileSync(`${path}/${suite_name}`, template, (err) => {
                        if (err) throw err;
                    });

                    await waitFor(200);
                } else {
                    let current_contents = fs.readFileSync(basePath() + `${path}/${suite_name}`, 'utf8');
                    const regex = /(?<=export const\s)\w+(?=\s=)/g;
                    const var_name_list = current_contents.match(regex);

                    if (!var_name_list.includes(`${name.replace('-', '_')}_data`)) {
                        current_contents += '\n\n' + template;
                    }

                    fs.writeFileSync(`${path}/${suite_name}`, current_contents, (err) => {
                        if (err) throw err;
                    });
                    await waitFor(200);
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            const fileName = `${name}.data.js`;
            try {
                const [fileExists] = await isFileExisted(path, fileName);

                if (!fileExists) {
                    // create file test
                    fs.writeFileSync(`${path}/${fileName}`, template, (err) => {
                        if (err) throw err;
                    });

                    await waitFor(500);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
}

export default writeData
