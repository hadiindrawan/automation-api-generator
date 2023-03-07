const fs = require('fs');
const { hostname } = require('os');
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

// Test generator
async function writeTest(element, path, pagesPath) {
    let contents = fs.readFileSync('template/test.dot', 'utf8');

    const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
    let name = (element.name).toLowerCase().replace(/\s/g, '');
    name = name.replace(/\//g, '');
    // _postman_isSubFolder
    console.log('ø  Generate Test ' + path + '/' + name + '.js')
    // write describe
    let code = contents.replace("{{describe}}", 'Test ' + element.name)

    // write path body
    let body_path = pagesPath + '/' + name
    code = code.replace("{{pagesPath}}", body_path)

    let testFunc = ``
    let dataDriven = ``

    if (element.request.hasOwnProperty('body')) {
        testFunc = `
        data.forEach((datas) => {
            it(datas.response.case, (done) => {
                new Request().request(datas, 
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
    // { example: "value_example", attachment: {"file": "tests/data/file/example.png"}, response: { case: "Success cases", schema: "success", status: 201 } }
    { response: { case: "Success cases", schema: "success", status: 200 } }
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

    // create file test
    fs.writeFile(path + '/' + name + '.spec.js',
    code, function (err) { if (err) throw err; });

}

// Body generator
async function writePages(element, path, jsonSchemaPath, jsonSchemaRelativePath, helperPath) {
    let contents = fs.readFileSync('template/request.dot', 'utf8');

    const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
    let name = (element.name).toLowerCase().replace(/\s/g, '');
    name = name.replace(/\//g, '');

    // write body
    let bodyRaw = ''
    let bodyFunc = ''
    let attKey = ''

    if (element.request.hasOwnProperty('body')) {
        if (element.request.body?.mode == 'raw') {
            bodyRaw = element.request.body.raw
            bodyFunc = '\r\n'+'\t\t'+".send(this.body(new requestHelper().getParam(args[0])))"
        } else 
        if (element.request.body?.mode == 'formdata') {
            let data = element.request.body.formdata
            let first = true
            bodyRaw += '{'+'\r\n'+'\t\t\t'
            attKey += '{'+'\r\n'+'\t\t\t'
            let i = 1;

            if (data.some(datas => datas['type'] === 'file')) {
                contents = fs.readFileSync('template/requestWithAttach.dot', 'utf8');
                
                asyncForEach(data, async (body) => {
                    if (body.disabled != true) {
                        if(body.type == 'text') {
                            if(body.value.includes('{') || body.value.includes('[')) {
                                bodyRaw += '"' + body.key+'"'  + ': ' + body.value ;
                            } else {
                                if (first === false) bodyRaw += ','+'\r\n'+'\t\t\t';
                                bodyRaw += '"' + body.key+'"'  + ': ' + '"'+ body.value +'"';
                                first = false;
                            }
                        } else {
                            if(typeof body.src != 'object') {
                                if (first === false) attKey += ','+'\r\n'+'\t\t\t';
                                    attKey += '"' + body.key+'"'  + ': ' + '"'+ body.src +'"';
                                    first = false;
                            } else {
                                if (first === false) attKey += ','+'\r\n'+'\t\t\t';
                                    attKey += '"' + body.key+'"'  + ': ' + JSON.stringify(body.src);
                                    first = false;
                            }
                        }
                    }
                })
            } else {
                contents = fs.readFileSync('template/request.dot', 'utf8');
                asyncForEach(data, async (body) => {
                    if (body.disabled != true) {
                        if (first === false) bodyRaw += ','+'\r\n'+'\t\t\t';
                        bodyRaw += '"' + body.key+'"'  + ': ' + '"'+ body.value +'"';
                        first = false;
                    }
                })
            }
            
            await waitFor(50);
            bodyRaw += '\r\n'+'\t\t'+'}'
            await waitFor(50);
            attKey += '\r\n'+'\t\t'+'}'
            await waitFor(50);
            bodyFunc = '\r\n'+'\t\t'+".send(this.body(new requestHelper().getParam(args[0])))"
        }
    } else {
        await waitFor(50);
        bodyFunc = ""
        bodyRaw = "''"
    }
    await waitFor(50);

    // write method
    let code = contents.replace("{{method}}", (element.request.method).toLowerCase())
    // write headers
    let headers = '';
    asyncForEach(element.request.header, async (header) => {
        headers += '.set("' + header.key + '", "' + header.value + '")';
    })
    await waitFor(50);
    code = code.replace("{{header}}", headers)

    // write endpoint
    let dataQuery = ''
    if (element.request.url.hasOwnProperty('query')) {
        let firstData = true
        dataQuery += '\r\n'+ '\t\t'+ '.query({ '
        asyncForEach(element.request.url.query, async (query) => {
            if (firstData === false) dataQuery += ', ';
                dataQuery += query.key + ': "' + query.value + '"';
                firstData = false;
        })
        await waitFor(50);
        dataQuery += ' })'
    } else {
        dataQuery = ''
    }
    await waitFor(50);
    code = code.replace("{{query}}", dataQuery)

    let url = element.request.url.raw
    if (url.includes('http')) {
        code = code.replace("{{endpoint}}", new URL(url).pathname)
    } else {
        let base = url.split('/')
        code = code.replace("{{endpoint}}", (url).replace(base[0], ""))
    }

    code = code.replace("{{objectBody}}", bodyRaw)
    code = code.replace("{{jsonSchemaPath}}", jsonSchemaRelativePath + '/' + name + '.json')
    code = code.replace("{{bodyFunc}}", bodyFunc)
    code = code.replace("{{rawAtt}}", attKey)
    code = code.replace("{{helperPath}}", helperPath)

    // create request file
    fs.writeFile(path + '/' + name + '.js',
        code, function (err) { if (err) throw err ; });

    // create json_responses file
    fs.writeFile(jsonSchemaPath + '/' + name + '.json',
        fs.readFileSync('template/json_responses.dot', 'utf8') , function (err) { if (err) throw err ; });
}

fs.readFile(process.argv.slice(2)[0], (err, data) => {
    if (err) throw err;
    let items = JSON.parse(data).item;
    const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
    
    // write data dir
    const dataDir = 'tests/data';
    fs.mkdirSync(dataDir, { recursive: true })

    // write helper dir
    const requestHelper = 'tests/helper';
    fs.mkdirSync(requestHelper, { recursive: true })

    fs.writeFile('tests/helper/requestHelper.js',
        fs.readFileSync('template/requestHelper.dot', 'utf8') , function (err) { if (err) throw err ; });

    asyncForEach(items, async (element) => {
        // console.log(element);
        if (element.hasOwnProperty('item')) {
            // helper path
            const helperPath = '../../helper/requestHelper';
            // write test dir
            const testPath = 'tests/scenarios/' + element.name;
            fs.mkdirSync(testPath, { recursive: true })
            // write pages dir
            const pagesPath = 'tests/pages/' + element.name;
            const pagesPathRelativePath = '../../pages/' + element.name;
            fs.mkdirSync(pagesPath, { recursive: true })
            // write json_schema dir
            const jsonSchemaPath = 'tests/schema/' + element.name;
            const jsonSchemaRelativePath = '../../schema/' + element.name;
            fs.mkdirSync(jsonSchemaPath, { recursive: true })
            // await waitFor(50)
            asyncForEach(element.item, async (second) => {
                if (second.hasOwnProperty('item') == false) {
                    writeTest(second, testPath, pagesPathRelativePath)
                    writePages(second, pagesPath, jsonSchemaPath, jsonSchemaRelativePath, helperPath)
                    await waitFor(10)
                } else {
                    asyncForEach(second.item, async (third) => {
                        const third_test = testPath + '/' + second.name;
                        const third_req = pagesPath + '/' + second.name;
                        const third_reqRe = '../' + pagesPathRelativePath + '/' + second.name;
                        const third_sch = jsonSchemaPath + '/' + second.name;
                        const third_schRe = '../' + jsonSchemaRelativePath + '/' + second.name;
                        const third_helpRe = '../' + helperPath;

                        fs.mkdirSync(third_test + '/', { recursive: true })
                        fs.mkdirSync(third_req + '/', { recursive: true })
                        fs.mkdirSync(third_sch + '/', { recursive: true })
                        
                        if (third.hasOwnProperty('item') == false) {
                            writeTest(third, third_test, third_reqRe)
                            writePages(third, third_req, third_sch, third_schRe, third_helpRe)
                            await waitFor(10)
                        } else {
                            asyncForEach(third.item, async (fourth) => {
                                const fourth_test = third_test + '/' + second.name;
                                const fourth_req = third_req + '/' + second.name;
                                const fourth_reqRe = '../' + third_reqRe + '/' + second.name;
                                const fourth_sch = third_sch + '/' + second.name;
                                const fourth_schRe = '../' + third_schRe + '/' + second.name;
                                const fourth_helpRe = '../' + third_helpRe;

                                fs.mkdirSync(fourth_test + '/', { recursive: true })
                                fs.mkdirSync(fourth_req + '/', { recursive: true })
                                fs.mkdirSync(fourth_sch + '/', { recursive: true })
                                if (fourth.hasOwnProperty('item') == false) {
                                    writeTest(fourth, fourth_test, fourth_reqRe)
                                    writePages(fourth, fourth_req, fourth_sch, fourth_schRe, fourth_helpRe)
                                    await waitFor(10)
                                } else {
                                    asyncForEach(fourth.item, async (fifth) => {
                                        const fifth_test = fourth_test + '/' + second.name;
                                        const fifth_req = fourth_req + '/' + second.name;
                                        const fifth_reqRe = '../' + fourth_reqRe + '/' + second.name;
                                        const fifth_sch = fourth_sch + '/' + second.name;
                                        const fifth_schRe = '../' + fourth_schRe + '/' + second.name;
                                        const fifth_helpRe = '../' + fourth_helpRe;

                                        fs.mkdirSync(fifth_test + '/', { recursive: true })
                                        fs.mkdirSync(fifth_req + '/', { recursive: true })
                                        fs.mkdirSync(fifth_sch + '/', { recursive: true })
                                        await waitFor(50)
                                        if (fifth.hasOwnProperty('item') == false) {
                                            writeTest(fifth, fifth_test, fifth_reqRe)
                                            writePages(fifth, fifth_req, fifth_sch, fifth_schRe, fifth_helpRe)
                                            await waitFor(10)
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        } else {
            // helper path
            const helperPath = '../helper/requestHelper';
            // write test dir
            const testPath = 'tests/scenarios';
            fs.mkdirSync(testPath, { recursive: true })
            // write pages dir
            const pagesPath = 'tests/pages';
            const pagesPathRelativePath = '../pages';
            fs.mkdirSync(pagesPath, { recursive: true })

            // write json_schema dir
            const jsonSchemaPath = 'tests/schema';
            const jsonSchemaRelativePath = '../schema';
            fs.mkdirSync(jsonSchemaPath, { recursive: true })

            writeTest(element, testPath, pagesPathRelativePath)
            writePages(element, pagesPath, jsonSchemaPath, jsonSchemaRelativePath, helperPath)
            await waitFor(10)
        }
    });
});