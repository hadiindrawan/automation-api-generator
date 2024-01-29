import fs from "fs";
import { asyncForEach } from "utils/foreach";
import { isFileExisted } from "utils/modul";
import { basedir } from "utils/path";
import { toLowerCase } from "utils/string";
import { waitFor } from "utils/wait";

interface dataComponentInterface {
    element: any,
    path: string,
    moduleType?: string,
}

interface ddtTemplateInterface {
    case: ddtCaseInterface,
    driven?: any,
    attachment?: any | undefined,
}

interface ddtCaseInterface {
    name: string,
    schema: string,
    status: number,
    default?: boolean
}

// This is an asynchronous function called writeData.
export const writeData = async (params: dataComponentInterface): Promise<void> => {
    const {
        element,
        path,
        moduleType
    } = params;

    // Here, a constant variable dataDir is declared and assigned to the string 'tests/data/file'.
    // console.log({ element, path });
    let template = `export const {{var_name}} = [{{ddt}}]`

    const ddt: ddtTemplateInterface = {
        case: {
            name: "Successful login",
            schema: "success",
            status: 200,
            default: true
        },
        driven: {},
        attachment: {}
    }

    if (element.request.hasOwnProperty('body')) {
        try {
            fs.mkdirSync(path, { recursive: true });
        } catch (err) {
            console.log(err);
        }
    }

    // write body
    let bodyRaw = ''
    let attKey = ''

    if (element.request.hasOwnProperty('body')) {
        if (element.request.body?.mode == 'raw') {
            bodyRaw = await element.request.body.raw
        } else
        if (element.request.body?.mode == 'formdata') {
            let data = await element.request.body.formdata
            let first = true
            let first1 = true
            bodyRaw += '{' + '\r\n' + '\t\t\t'
            attKey += '{' + '\r\n' + '\t\t\t'

            if (data.some((datas: any) => datas['type'] === 'file')) {
                await asyncForEach(data, async (body: any) => {
                    // console.log(body);
                    if (body.disabled !== true) {
                        let value = await body.value;
                    
                        if (body.type === 'text') {
                            bodyRaw += `"${body.key}": "${value}"`;
                        } else
                        if (body.type === 'text' && (value.includes('{') || value.includes('['))) {
                            bodyRaw += `"${body.key}": ${value}`;
                        } else {
                            let src = (typeof body.src !== 'object') ? body.src : JSON.stringify(body.src);
                            attKey += `${first1 === false ? ',' : ''}\r\n\t\t\t"${body.key}": "${src}"`;
                            first1 = false;
                        }
                    }
                });
            } else {
                await asyncForEach(
                    data.filter((body: any) => body.disabled !== true),
                    async (body: any) => {
                        if (first === false) {
                            bodyRaw += ',\r\n\t\t\t';
                        }
                        bodyRaw += `"${body.key}": "${body.value}"`;
                        first = false;
                    }
                );
            }

            bodyRaw += '\r\n' + '\t\t' + '}'
            attKey += '\r\n' + '\t\t' + '}'
            await waitFor(50);
        }
    }

    let name = toLowerCase(element.name)

    if (element.request.hasOwnProperty('body')) {
        ddt.driven = JSON.parse(bodyRaw)
        if(attKey != '') ddt.attachment = JSON.parse(attKey)
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
                    fs.writeFileSync(`${path}/${suite_name}`, template, 'utf8');

                    await waitFor(200);
                } else {
                    let current_contents = fs.readFileSync(basedir() + `/${path}/${suite_name}`, 'utf8');
                    const regex = /(?<=export const\s)\w+(?=\s=)/g;
                    const var_name_list = current_contents.match(regex) || '';

                    if (!var_name_list.includes(`${name.replace('-', '_')}_data`)) {
                        current_contents += '\n\n' + template;
                    }

                    fs.writeFileSync(`${path}/${suite_name}`, current_contents, 'utf8');
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
                    fs.writeFileSync(`${path}/${fileName}`, template, 'utf8');
                    await waitFor(500);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
}
