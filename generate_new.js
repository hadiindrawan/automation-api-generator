const fs = require('fs');
const { hostname } = require('os');
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

// Test generator
async function writeTest(element, path, requestPath) {
    let contents = fs.readFileSync('template/test.dot', 'utf8');

    const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
    let name = (element.name).toLowerCase().replace(/\s/g, '');
    name = name.replace(/\//g, '');
    // _postman_isSubFolder
    console.log('ø  Generate Test ' + path + '/' + name + '.js')
    // write describe
    let code = contents.replace("{{describe}}", 'Test ' + element.name)

    // write path body
    let body_path = '../../' + requestPath + '/' + name
    code = code.replace("{{requestPath}}", body_path)

    let testFunc = ``
    let dataDriven = ``

    if (element.request.hasOwnProperty('body')) {
        testFunc = `
        data.forEach((datas) => {
            it(datas.response.case, function (done) {
                new Request().request(datas, 
                    function (err, res) {
                        expect(res.status).to.equals(datas.response.status);
                        expect(res.body).to.be.jsonSchema(new Request().expect(datas.response.case))
                        done();
                })
            });
        })
        `
        dataDriven = 
`
// If you need data driven, just write driven keys (no need all keys)
let data = [
    { example: "value_example", example2: "value_example2", response: { case: "Success", status: 201 } }
]`
    } else {
        testFunc = `
        it('Success', function (done) {
            new Request().request( 
                function (err, res) {
                    expect(res.status).to.equals(200);
                    expect(res.body).to.be.jsonSchema(new Request().expect('Success'))
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
async function writeSrcRequest(element, path, jsonSchemaPath, jsonSchemaRelativePath) {
    let contents = fs.readFileSync('template/request.dot', 'utf8');

    const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
    let name = (element.name).toLowerCase().replace(/\s/g, '');
    name = name.replace(/\//g, '');

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
    let url = element.request.url.raw
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

    if (url.includes('http')) {
        code = code.replace("{{endpoint}}", new URL(url).pathname)
    } else {
        code = code.replace("{{endpoint}}", (url).replace("{{url}}", ""))
    }

    // write body
    let bodyRaw = ''
    let bodyFunc = ''

    if (element.request.hasOwnProperty('body')) {
        if (element.request.body?.mode == 'raw') {
            bodyRaw = element.request.body.raw
            bodyFunc = '\r\n'+'\t\t'+".send(this.body(new requestHelper().getParams(args[0])))"
        } else 
        if (element.request.body?.mode == 'formdata') {
            let first = true;
            bodyRaw += '{'+'\r\n'+'\t\t\t'

            asyncForEach(element.request.body.formdata, async (body) => {
                if (first === false) bodyRaw += ','+'\r\n'+'\t\t\t';
                bodyRaw += '"' + body.key+'"'  + ': ' + '"' + body.value +'"';
                first = false;
            })
            await waitFor(50);
            bodyRaw += '\r\n'+'\t\t'+'}'
            await waitFor(50);
            bodyFunc = '\r\n'+'\t\t'+".send(this.body(new requestHelper().getParams(args[0])))"
        }
    } else {
        await waitFor(50);
        bodyFunc = ""
        bodyRaw = "''"
    }
    await waitFor(50);

    code = code.replace("{{objectBody}}", bodyRaw)
    code = code.replace("{{jsonSchemaPath}}", '../../' + jsonSchemaRelativePath + '/' + name + '.json')
    code = code.replace("{{bodyFunc}}", bodyFunc)

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
    asyncForEach(items, async (element) => {
        // console.log(element);
        if (element.hasOwnProperty('item')) {
            // write test dir
            const testPath = 'tests/' + element.name;
            fs.mkdirSync(testPath, { recursive: true })
            // write request dir
            const requestPath = 'src/request_config/' + element.name;
            fs.mkdirSync(requestPath, { recursive: true })
            // write json_schema dir
            const jsonSchemaPath = 'src/json_responses/' + element.name;
            const jsonSchemaRelativePath = 'json_responses/' + element.name;
            fs.mkdirSync(jsonSchemaPath, { recursive: true })
            // await waitFor(50)
            asyncForEach(element.item, async (second) => {
                const second_path = testPath
                if (second.hasOwnProperty('item') == false) {
                    // console.log(second.name)
                    writeTest(second, testPath, requestPath)
                    writeSrcRequest(second, requestPath, jsonSchemaPath, jsonSchemaRelativePath)
                    // await waitFor(10)
                } else {
                    // console.log('write third')
                    asyncForEach(second.item, async (third) => {
                        // console.log(third);
                        const third_path = second_path + '/' + second.name;
                        fs.mkdirSync(third_path + '/', { recursive: true })
                        if (third.hasOwnProperty('item') == false) {
                            write(third, third_path, contents)
                        } else {
                            asyncForEach(third.item, async (fourth) => {
                                const fourth_path = third_path + '/' + third.name;
                                fs.mkdirSync(fourth_path + '/', { recursive: true })
                                if (fourth.hasOwnProperty('item') == false) {
                                    write(fourth, fourth_path, contents)
                                } else {
                                    asyncForEach(fourth.item, async (fifth) => {
                                        const fifth_path = fourth_path + '/' + fourth.name;
                                        fs.mkdirSync(fifth_path + '/', { recursive: true })
                                        await waitFor(50)
                                        if (fifth.hasOwnProperty('item') == false) {
                                            write(fifth, fifth_path, contents)
                                            await waitFor(10)
                                        } else {

                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        } else {
            // _postman_isSubFolder
            console.log('ø  Generate Test tests/' + (element.name).toLowerCase().replace(/\s/g, '') + '.js')

            // write describe
            let code = contents.replace("{{describe}}", 'Test ' + element.name)
            // write method
            code = code.replace("{{method}}", (element.request.method).toLowerCase())
            // write endpoint
            code = code.replace("{{endpoint}}", (element.request.url.raw).replace("{{url}}", ""))
            // write headers
            let headers = '';
            asyncForEach(element.request.header, async (header) => {
                headers += '.set("' + header.key + '", "' + header.value + '")';
            })
            await waitFor(50);
            code = code.replace("{{header}}", headers)
            // write bodies
            let bodies = '';
            if (element.request.method != "GET") {
                bodies += '.send('
                if (element.request.body.mode == 'formdata') {
                    bodies += '{'
                    let first = true;
                    asyncForEach(element.request.body.formdata, async (body) => {
                        if (first === false) bodies += ',';
                        bodies += body.key + ":'" + body.value + "'";
                        // console.log(body.key+":'"+body.value+"'");
                        first = false;
                    })
                    await waitFor(50);
                    bodies += '})'
                }
                if (element.request.body.mode == 'raw') {
                    let first = true;
                    bodies += element.request.body.raw
                    await waitFor(50);
                    bodies += ')'
                }
            }
            code = code.replace("{{body}}", bodies)
            // create file test
            fs.writeFile('tests/' + (element.name).toLowerCase().replace(/\s/g, '') + '.js',
                code, function (err) { if (err) throw err; });
        }
    });
});