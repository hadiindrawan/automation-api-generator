const fs = require('fs');
const { hostname } = require('os');
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

// Test generator
async function writeTest(element, path, pagesPath) {
    let contents = fs.readFileSync('template/test.dot', 'utf8');

    let name = (element.name).toLowerCase().replace(/\s/g, '');
    name = name.replace(/\//g, '');
    // _postman_isSubFolder
    console.log('ø  Generate Test ' + path + '/' + name + '.spec.js')
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

    // create file test
    fs.writeFile(path + '/' + name + '.spec.js',
    code, function (err) { if (err) throw err; });

}

// Body generator
async function writePages(element, path, jsonSchemaRelativePath, helperPath) {
    let contents = fs.readFileSync('template/request.dot', 'utf8');

    let name = (element.name).toLowerCase().replace(/\s/g, '');
    name = name.replace(/\//g, '');

    // write body
    let bodyRaw = ''
    let bodyFunc = ''
    let attKey = ''

    if (element.request.hasOwnProperty('body')) {
        if (element.request.body?.mode == 'raw') {
            bodyRaw = element.request.body.raw
            bodyFunc = '\r\n'+'\t\t'+".send(this.body(new requestHelper().getParam(args)))"
        } else 
        if (element.request.body?.mode == 'formdata') {
            let data = element.request.body.formdata
            let first = true
            let first1 = true
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
                                if (first1 === false) attKey += ','+'\r\n'+'\t\t\t';
                                    attKey += '"' + body.key+'"'  + ': ' + '"'+ body.src +'"';
                                    first1 = false;
                            } else {
                                if (first1 === false) attKey += ','+'\r\n'+'\t\t\t';
                                    attKey += '"' + body.key+'"'  + ': ' + JSON.stringify(body.src);
                                    first1 = false;
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
            bodyFunc = '\r\n'+'\t\t'+".send(this.body(new requestHelper().getParam(args)))"
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
        if (header.disabled != true) {
            headers += '\r\n'+'\t\t'+'.set("' + header.key + '", "' + header.value + '")';
        }
    })
    await waitFor(50);
    // if any auth
    if (element.request.hasOwnProperty('auth')){
        let auth = element.request.auth
        if (auth.type == "bearer"){
            headers += '\r\n'+'\t\t'+'.set("Authorization", "' + (auth.type).replace(/\w\S*/g, (auth.type).charAt(0).toUpperCase() + (auth.type).substr(1).toLowerCase()) + ' ' + auth.bearer[0].value + '")';
        }
    }
    await waitFor(50);

    code = code.replace("{{header}}", headers)
    
    // write endpoint
    let dataQuery = ''
    if (element.request.url.hasOwnProperty('query')) {
        let firstData = true
        dataQuery += '\r\n'+'\t\t'+ '.query({ '
        asyncForEach(element.request.url.query, async (query) => {
            if (query.disabled != true) {
                if (firstData === false) dataQuery += ', ';
                    dataQuery += query.key + ': "' + query.value + '"';
                    firstData = false;
            }
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
        const fakeBase = 'https://fake.dot'
        let base = url.split('/')
        code = code.replace("{{endpoint}}", new URL((url).replace(base[0], fakeBase)).pathname)
    }

    code = code.replace("{{objectBody}}", bodyRaw)
    code = code.replace("{{jsonSchemaPath}}", jsonSchemaRelativePath + '/' + name + '.json')
    code = code.replace("{{bodyFunc}}", bodyFunc)
    code = code.replace("{{rawAtt}}", attKey)
    code = code.replace("{{helperPath}}", helperPath)

    // create request file
    fs.writeFile(path + '/' + name + '.js',
        code, function (err) { if (err) throw err ; });
}

async function writeJsonSchema(element, jsonSchemaPath) {
    let name = (element.name).toLowerCase().replace(/\s/g, '');
    name = name.replace(/\//g, '');

    // create json_responses file
    fs.writeFile(jsonSchemaPath + '/' + name + '.json',
        fs.readFileSync('template/json_responses.dot', 'utf8') , function (err) { if (err) throw err ; });
}

async function writeRunner(element, testPath, runPath) {
    let name = (element.name).toLowerCase().replace(/\s/g, '');
    name = name.replace(/\//g, '');

    let first
    let runner = ''
    asyncForEach(element.item, async (item) => {
        if (!item.hasOwnProperty('item')) {
            let namet = (item.name).toLowerCase().replace(/\s/g, '');
            namet = namet.replace(/\//g, '');

            if (first === false) runner += '\r\n'
                runner += "require('"+ testPath+'/'+namet+".spec')()"
                first = false;
        }
    })
    await waitFor(10)
    runner += '\r\n'+'module.exports = () => {}'
    await waitFor(10)
    // create write runner content
    fs.writeFile(runPath + '/' + name + '.js', runner, function (err) { if (err) throw err ; });
}

fs.readFile(process.argv.slice(2)[0], (err, data) => {
    if (err) throw err;
    let items = JSON.parse(data).item;
    
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
            const testRelativePath = '../tests/scenarios/' + element.name;
            fs.mkdirSync(testPath, { recursive: true })
            // write pages dir
            const pagesPath = 'tests/pages/' + element.name;
            const pagesPathRelativePath = '../../pages/' + element.name;
            fs.mkdirSync(pagesPath, { recursive: true })
            // write json_schema dir
            const jsonSchemaPath = 'tests/schema/' + element.name;
            const jsonSchemaRelativePath = '../../schema/' + element.name;
            fs.mkdirSync(jsonSchemaPath, { recursive: true })
            // write runner dir
            const runPath = 'runner'
            fs.mkdirSync(runPath, { recursive: true })
            writeRunner(element, testRelativePath, runPath)

            asyncForEach(element.item, async (second) => {
                if (second.hasOwnProperty('item') == false) {
                    writeTest(second, testPath, pagesPathRelativePath)
                    writePages(second, pagesPath, jsonSchemaRelativePath, helperPath)
                    writeJsonSchema(second, jsonSchemaPath)
                    await waitFor(10)
                } else {
                    asyncForEach(second.item, async (third) => {
                        const third_test = testPath + '/' + second.name;
                        const third_testRe = '../' + testRelativePath + '/' + second.name;
                        const third_page = pagesPath + '/' + second.name;
                        const third_pageRe = '../' + pagesPathRelativePath + '/' + second.name;
                        const third_sch = jsonSchemaPath + '/' + second.name;
                        const third_schRe = '../' + jsonSchemaRelativePath + '/' + second.name;
                        const third_helpRe = '../' + helperPath;
                        const third_runPath = runPath + '/' + element.name;

                        fs.mkdirSync(third_test + '/', { recursive: true })
                        fs.mkdirSync(third_page + '/', { recursive: true })
                        fs.mkdirSync(third_sch + '/', { recursive: true })
                        fs.mkdirSync(third_runPath, { recursive: true })
                        writeRunner(second, third_testRe, third_runPath)
                        if (third.hasOwnProperty('item') == false) {
                            writeTest(third, third_test, third_pageRe)
                            writePages(third, third_page, third_schRe, third_helpRe)
                            writeJsonSchema(third, third_sch)
                            await waitFor(10)
                        } else {
                            asyncForEach(third.item, async (fourth) => {
                                const fourth_test = third_test + '/' + third.name;
                                const fourth_testRe = '../' + third_testRe + '/' + third.name;
                                const fourth_page = third_page + '/' + third.name;
                                const fourth_pageRe = '../' + third_pageRe + '/' + third.name;
                                const fourth_sch = third_sch + '/' + third.name;
                                const fourth_schRe = '../' + third_schRe + '/' + third.name;
                                const fourth_helpRe = '../' + third_helpRe;
                                const fourth_runPath = third_runPath + '/' + second.name;

                                fs.mkdirSync(fourth_test + '/', { recursive: true })
                                fs.mkdirSync(fourth_page + '/', { recursive: true })
                                fs.mkdirSync(fourth_sch + '/', { recursive: true })
                                fs.mkdirSync(fourth_runPath, { recursive: true })
                                writeRunner(third, fourth_testRe, fourth_runPath)
                                if (fourth.hasOwnProperty('item') == false) {
                                    writeTest(fourth, fourth_test, fourth_pageRe)
                                    writePages(fourth, fourth_page, fourth_schRe, fourth_helpRe)
                                    writeJsonSchema(fourth, fourth_sch)
                                    await waitFor(10)
                                } else {
                                    asyncForEach(fourth.item, async (fifth) => {
                                        const fifth_test = fourth_test + '/' + fourth.name;
                                        const fifth_testRe = '../' + fourth_testRe + '/' + fourth.name;
                                        const fifth_page = fourth_page + '/' + fourth.name;
                                        const fifth_pageRe = '../' + fourth_pageRe + '/' + fourth.name;
                                        const fifth_sch = fourth_sch + '/' + fourth.name;
                                        const fifth_schRe = '../' + fourth_schRe + '/' + fourth.name;
                                        const fifth_helpRe = '../' + fourth_helpRe;
                                        const fifth_runPath = fourth_runPath + '/' + third.name;

                                        fs.mkdirSync(fifth_test + '/', { recursive: true })
                                        fs.mkdirSync(fifth_page + '/', { recursive: true })
                                        fs.mkdirSync(fifth_sch + '/', { recursive: true })
                                        fs.mkdirSync(fifth_runPath, { recursive: true })
                                        writeRunner(fourth, fifth_testRe, fifth_runPath)
                                        await waitFor(50)
                                        if (fifth.hasOwnProperty('item') == false) {
                                            writeTest(fifth, fifth_test, fifth_pageRe)
                                            writePages(fifth, fifth_page, fifth_schRe, fifth_helpRe)
                                            writeJsonSchema(fifth, fifth_sch)
                                            await waitFor(10)
                                        } else {
                                            asyncForEach(fifth.item, async (sixth) => {
                                                const sixth_test = fifth_test + '/' + fifth.name;
                                                const sixth_testRe = '../' + fifth_testRe + '/' + fifth.name;
                                                const sixth_page = fifth_page + '/' + fifth.name;
                                                const sixth_pageRe = '../' + fifth_pageRe + '/' + fifth.name;
                                                const sixth_sch = fifth_sch + '/' + fifth.name;
                                                const sixth_schRe = '../' + fifth_schRe + '/' + fifth.name;
                                                const sixth_helpRe = '../' + fifth_helpRe;
                                                const sixth_runPath = fifth_runPath + '/' + third.name;

                                                fs.mkdirSync(sixth_test + '/', { recursive: true })
                                                fs.mkdirSync(sixth_page + '/', { recursive: true })
                                                fs.mkdirSync(sixth_sch + '/', { recursive: true })
                                                fs.mkdirSync(sixth_runPath, { recursive: true })
                                                writeRunner(fifth, sixth_testRe, sixth_runPath)
                                                await waitFor(50)
                                                if (sixth.hasOwnProperty('item') == false) {
                                                    writeTest(sixth, sixth_test, sixth_pageRe)
                                                    writePages(sixth, sixth_page, sixth_schRe, sixth_helpRe)
                                                    writeJsonSchema(sixth, sixth_sch)
                                                    await waitFor(10)
                                                }
                                            })
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