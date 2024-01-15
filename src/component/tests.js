import fs from "fs"
import { promisify } from 'util';
import waitFor from "../utils/wait.js"
import isFileExisted from "../utils/check_dir.js"
import basePath from "../utils/base_path.js"
import { toCamelCase, toLowerCase } from "../utils/string.js"
import { log } from "../utils/logs.js";

// Test file generator
async function writeTest(element, path, pagesPath, dataPath, moduleType, configPath) {
    // template dir name
    const templateDir = moduleType == "Javascript modules (import/export)" ? "lib/template/jsimport/spec.dot" : "lib/template/commonjs/spec.dot"
    // read template fileimport { log } from './../utils/logs';

    let contents = fs.readFileSync(basePath() + templateDir, 'utf8');

    let name = toLowerCase(element.name)
    
    const method = element.request?.method ?? '';
    
    let testFunc = ''
    if (element.request.hasOwnProperty('body')) {
        testFunc = `
        data.${toLowerCase(element.name).replace('(', '').replace(')', '')}_data.forEach(async (data) => {
            it(data.case.name, async () => {
                const response = await new Request().api(data.driven)

                expect(response.status).to.equals(data.case.status)
                expect(response.body).to.be.jsonSchema(new Request().expect(data.case.schema))
            })
        })
        `
    } else {
        testFunc = `
        it("Successful case", async () => {
            const response = await new Request().api()

            expect(response.status).to.equals(200)
            expect(response.body).to.be.jsonSchema(new Request().expect("success"))
        })
        `
    }

    let suiteDataPath = toLowerCase(element.name)
    
    let code = contents.replace("{{describe}}", 'Test ' + element.name)
    code = code.replace("{{page_path}}", pagesPath.replace(/\\/g, "/") + '/' + method + '_' + name + '.pages.js')

    if (element.request.hasOwnProperty('body')) {
        let importStatement = moduleType === "Javascript modules (import/export)" ? "\n import * as data from '" : "\n const data = require('";
        let endPath = moduleType === "Javascript modules (import/export)" ? ".data.js'" : ".data.js')";

        if (dataPath.replace(/\\/g, "/").split('/').length >= 2) {
            code = code.replace("{{data_path}}", importStatement + dataPath.replace(/\\/g, "/").split('/').slice(0, 2).join('/') + `/${toLowerCase(dataPath.replace(/\\/g, "/").split('/')[1])}` + endPath)
        } else {
            code = code.replace("{{data_path}}", importStatement + dataPath.replace(/\\/g, "/") + `/${suiteDataPath}` + endPath)
        }
    } else {
        code = code.replace("{{data_path}}", '')
    }

    code = code.replace("{{config_path}}", configPath)
    code = code.replace("{{test_section}}", testFunc)

    // check if file exists
    if (element.request.hasOwnProperty('url')) {
        try {
            const [fileExists] = await isFileExisted(path, method + '_' + name + '.spec.js');
            if (!fileExists) {
                // create file test
                fs.writeFileSync(path + '/' + method + '_' + name + '.spec.js', code, function (err) {
                    if (err) throw err;
                });
                await waitFor(500)
                log(`ø  Generate Test ${path.replace(/\\/g, "/") + '/' + method + '_' + name + '.spec.js'} completed successfully`, 'green')
            } else {
                // file was existed
                log(`ø The request of ${element.name} has already created`, 'yellow')
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        // invalid request
        log(`ø ${element.name} was invalid request!`, 'red')
    }
}

export default writeTest