import fs from "fs"
import waitFor from "../utils/wait.js"
import isFileExisted from "../utils/check_dir.js"
import basePath from "../utils/base_path.js"
import { log } from "../utils/logs.js"

// Test file generator
async function writeTest(element, path, pagesPath, moduleType, configPath) {
    // template dir name
    const templateDir = moduleType == "Javascript modules (import/export)" ? "lib/template/jsimport/spec.dot" : "lib/template/commonjs/spec.dot"
    // read template file
    let contents = fs.readFileSync(basePath() + templateDir, 'utf8');

    let name = (element.name).toLowerCase().replace(/\s/g, '');
    name = name.replace(/\//g, '');
    let method
    if (element.request.hasOwnProperty('method')) {
        method = element.request.method
    }

    // write describe
    let code = contents.replace("{{describe}}", 'Test ' + element.name)

    // write path body
    let body_path = pagesPath.replace(/\\/g, "/") + '/' + method + '_' + name + '.pages.js'
    code = code.replace("{{pagesPath}}", body_path)
    await waitFor(50);

    let testFunc = ``
    let dataDriven = ``

    if (element.request.hasOwnProperty('body')) {
        testFunc = `
        data.forEach((datas) => {
            it(datas.response.case, (done) => {
                new pages().request(datas.ddt, 
                    (err, res) => {
                        expect(res.status).to.equals(datas.response.status);
                        expect(res.body).to.be.jsonSchema(new pages().expect(datas.response.schema))
                        done();
                })
            });
        })
        `
        dataDriven = 
`
// If you need data driven, just write driven keys (no need all keys), for example
let data = [
    // Example data driven, some default keys need exist: ddt, response, attachment (if any)
    { ddt: { example: "value_example", attachment: {"file": "tests/data/file/example.png"} }, response: { case: "Success cases", schema: "success", status: 200 } }
]`
    } else {
        testFunc = `
        it('Success', (done) => {
            new pages().request( 
                (err, res) => {
                    expect(res.status).to.equals(200);
                    expect(res.body).to.be.jsonSchema(new pages().expect('success'))
                    done();
            })
        });
        `
        dataDriven = ''
    }
 
    await waitFor(50);

    code = code.replace("{{testFunc}}", testFunc)
    code = code.replace("{{dataDriven}}", dataDriven)
    code = code.replace("{{configPath}}", configPath)
    await waitFor(50);
    // check if file exists
    if (element.request.hasOwnProperty('url')) {
        try {
            const [fileExists] = await isFileExisted(path, method + '_' + name + '.spec.js');
            if (!fileExists) {
                // create file test
                fs.writeFile(path + '/' + method + '_' + name + '.spec.js', code, function (err) {
                    if (err) throw err;
                });
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