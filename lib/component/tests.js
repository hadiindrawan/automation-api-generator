const fs = require('fs');
const waitFor = require('../utils/wait')
const isFileExisted = require('../utils/check_dir')
const basePath = require('../utils/base_path')

// Test file generator
async function writeTest(element, path, pagesPath) {
    let contents = fs.readFileSync(basePath() + 'lib/template/test.dot', 'utf8');

    let name = (element.name).toLowerCase().replace(/\s/g, '');
    name = name.replace(/\//g, '');
    let method = element.request.method

    // write describe
    let code = contents.replace("{{describe}}", 'Test ' + element.name)

    // write path body
    let body_path = pagesPath + '/' + method + '_' + name
    code = code.replace("{{pagesPath}}", body_path)
    await waitFor(50);

    let testFunc = ``
    let dataDriven = ``

    if (element.request.hasOwnProperty('body')) {
        testFunc = `
        data.forEach((datas) => {
            it(datas.response.case, (done) => {
                new Request().request(datas.ddt, 
                    (err, res) => {
                        expect(res.status).to.equals(datas.response.status);
                        expect(res.body).to.be.jsonSchema(new Request().expect(datas.response.schema))
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
            new Request().request( 
                (err, res) => {
                    expect(res.status).to.equals(200);
                    expect(res.body).to.be.jsonSchema(new Request().expect('success'))
                    done();
            })
        });
        `
        dataDriven = ''
    }
 
    await waitFor(50);

    code = code.replace("{{testFunc}}", testFunc)
    code = code.replace("{{dataDriven}}", dataDriven)
    await waitFor(50);
    

    // check if file exists
    await isFileExisted('tests', method + '_' +name + '.spec.js', function(data) {
        if (!data[0] && data[1] == path) {
            // _postman_isSubFolder
            console.log(`${'\x1b[32m'}ø  Generate Test ${path + '/' + method + '_' + name + '.spec.js'} completed successfully${'\x1b[0m'}`)
            // create file test
            fs.writeFile(path + '/' + method + '_' +name + '.spec.js',
            code, function (err) { if (err) throw err; });
        } else { 
            if(data[0] && data[1] == path) {
                // file existed
                console.log(`${'\x1b[33m'}ø The request of ${element.name} has already created${'\x1b[0m'}`) 
            } 
        }
    })
}

module.exports = writeTest