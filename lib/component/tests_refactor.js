import fs from "fs"
import { promisify } from 'util';
import waitFor from "../utils/wait.js"
import isFileExisted from "../utils/check_dir.js"
import basePath from "../utils/base_path.js"
import { toCamelCase, toLowerCase } from "../utils/string.js"

const writeFile = promisify(fs.writeFile);
// Test file generator
async function writeTest(element, path, pagesPath, dataPath, moduleType, configPath) {
    // template dir name
    const templateDir = moduleType == "Javascript modules (import/export)" ? "lib/template/jsimport/spec.dot" : "lib/template/commonjs/spec.dot"
    // read template file
    let contents = fs.readFileSync(basePath() + templateDir, 'utf8');

    let name = toLowerCase(element.name)
    
    const method = element.request?.method ?? '';
    
    let testFunc = ''
    if (element.request.hasOwnProperty('body')) {
        testFunc = `
        data.${toCamelCase(element.name)}.forEach(async (data) => {
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

    let suiteDataPath = toLowerCase(dataPath.includes('\\') ? dataPath.split('\\')[1] : element.name)
    
    let code = contents.replace("{{describe}}", 'Test ' + element.name)
    code = code.replace("{{page_path}}", pagesPath.replace(/\\/g, "/") + '/' + method + '_' + name + '.pages.js')

    if (element.request.hasOwnProperty('body')) {
        code = code.replace("{{data_path}}", `\n const data = require('@data/${suiteDataPath}.data.js')`)
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
                console.log(`${'\x1b[32m'}ø  Generate Test ${path.replace(/\\/g, "/") + '/' + method + '_' + name + '.spec.js'} completed successfully${'\x1b[0m'}`)
            } else {
                // file was existed
                console.log(`${'\x1b[33m'}ø The request of ${element.name} has already created${'\x1b[0m'}`)
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        // invalid request
        console.log(`${'\x1b[31m'}ø ${element.name} was invalid request!${'\x1b[0m'}`)
    }
}

export default writeTest