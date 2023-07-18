import fs from 'fs'
import { promisify } from 'util';
import asyncForEach from "../utils/foreach.js"
import waitFor from "../utils/wait.js"
import isFileExisted from "../utils/check_dir.js"
import basePath from "../utils/base_path.js"
import { toLowerCase } from '../utils/string.js';

const writeFile = promisify(fs.writeFile);
// Pages file generator
async function writePages(element, path, schemaPath, dataPath, helperPath, moduleType, configPath) {
    // template dir name
    const templateDir = moduleType == "Javascript modules (import/export)" ? "lib/template/jsimport/pages_refactor.dot" : "lib/template/commonjs/pages_refactor.dot"
    const templateDirAttach = moduleType == "Javascript modules (import/export)" ? "lib/template/jsimport/requestWithAttach.dot" : "lib/template/commonjs/requestWithAttach.dot"
    
    // read template file
    let contents = fs.readFileSync(basePath() + templateDir, 'utf8');

    let name = toLowerCase(element.name)

    // write method
    let method
    if (element.request.hasOwnProperty('method')) {
        method = await element.request.method
    }
        
    // write body
    let payload = '';
    const request = element.request;
    const requestBody = request.body;
    
    if (requestBody?.mode === 'raw') {
        payload = '\r\n\t\t.send(await this.getMappedBody(await new request_helper().getPayload(args)))';
    } else if (requestBody?.mode === 'formdata') {
        const formData = requestBody.formdata;
        if (formData.some(data => data.type === 'file')) {
            contents = fs.readFileSync(basePath() + templateDirAttach, 'utf8');
        } else {
            contents = fs.readFileSync(basePath() + templateDir, 'utf8');
            payload = '\r\n\t\t.send(await this.getMappedBody(await new request_helper().getPayload(args)))';
        }
    }
    

    // write headers
    let headers = '';
    if (element.request.hasOwnProperty('header')) {
        await asyncForEach(element.request.header, async (header) => {
            if (!header.disabled) {
                headers += '\r\n'+'\t\t'+'.set("' + header.key + '", "' + header.value + '")';
            }
        })
    }
    // if any auth
    if (element.request.hasOwnProperty('auth')){
        let auth = await element.request.auth
        if (auth.hasOwnProperty('bearer')){
            headers += '\r\n'+'\t\t'+'.set("Authorization", "' + (auth.type).replace(/\w\S*/g, (auth.type).charAt(0).toUpperCase() + (auth.type).substr(1).toLowerCase()) + ' ' + auth.bearer[0].value + '")';
        }
    }
    
    // write endpoint
    let queries = ''
    if (element.request.hasOwnProperty('url')) {
        if (element.request.url.hasOwnProperty('query')) {
            let firstData = true
            queries += '\r\n'+'\t\t'+ '.query({ '
            await asyncForEach(element.request.url.query, async (query) => {
                if (query.disabled != true) {
                    if (firstData === false) queries += ', ';
                        queries += query.key + ': "' + query.value + '"';
                        firstData = false;
                }
            })
            queries += ' })'
        }
    }

    // write url
    let url = ''
    if (element.request.hasOwnProperty('url')) {
        let raw_url = await element.request.url.raw
        if (raw_url.includes('http')) {
            url = new URL(raw_url).pathname
        } else {
            const fakeBase = 'https://fake.dot'
            let base = raw_url.split('/')
            url = new URL((raw_url).replace(base[0], fakeBase)).pathname
        }
    }

    let code = contents.replace("{{method}}", (method).toLowerCase())
    code = code.replace("{{url}}", url)
    code = code.replace("{{query}}", queries)
    code = code.replace("{{header}}", headers)
    code = code.replace("{{payload}}", payload)
    code = code.replace("{{data_body_name}}", `${name.replace('-', '_')}_data`)

    if (payload == '') code = code.replace("{{data_attach_name}}", name)
    code = code.replace("{{path_schema}}", schemaPath.replace(/\\/g, "/") + '/' + method + '_' + name + '.schema.js')
    
    if (dataPath.replace(/\\/g, "/").split('/').length >= 2) {
        code = code.replace("{{path_data}}", dataPath.replace(/\\/g, "/").split('/').slice(0, 2).join('/') + `/${toLowerCase(dataPath.replace(/\\/g, "/").split('/')[1])}` + '.data.js')
    } else {
        code = code.replace("{{path_data}}", dataPath.replace(/\\/g, "/") + `/${name}` + '.data.js')
    }
    code = code.replace("{{path_helper}}", helperPath)
    code = code.replace("{{path_config}}", configPath)
    
    // check if pages file exists
    if (element.request.hasOwnProperty('url')) {
        try {
            const [fileExists] = await isFileExisted(path, method + '_' + name + '.pages.js');
            if (!fileExists) {
                // create file test
                writeFile(path + '/' + method + '_' + name + '.pages.js', code, function (err) {
                    if (err) throw err;
                });
                await waitFor(500)
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default writePages