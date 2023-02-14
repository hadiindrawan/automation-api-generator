const fs = require('fs');
const { hostname } = require('os');
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

// Test generator
async function writeTest(element, path, requestPath) {
    let contents_POST = fs.readFileSync('template/test_POST.dot', 'utf8');
    let contents_GET = fs.readFileSync('template/test_GET.dot', 'utf8');

    const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
    let name = (element.name).toLowerCase().replace(/\s/g, '');
    name = name.replace(/\//g, '');
    // _postman_isSubFolder
    console.log('ø  Generate Test ' + path + '/' + name + '.js')

    if (element.request.method != "GET") {
        // write describe
        let code = contents_POST.replace("{{describe}}", 'Test ' + element.name)
        // write method
        code = code.replace("{{method}}", (element.request.method).toLowerCase())
        // write endpoint
        let url = element.request.url.raw
        if (url.includes('http')) {
            code = code.replace("{{endpoint}}", new URL(element.request.url.raw).pathname)
        } else {
            code = code.replace("{{endpoint}}", (url).replace("{{url}}", ""))
        }
        // write headers
        let headers = '';
        asyncForEach(element.request.header, async (header) => {
            headers += '.set("' + header.key + '", "' + header.value + '")';
        })
        await waitFor(50);
        code = code.replace("{{header}}", headers)

        // write path body
        let body_path = '../../' + requestPath + '/' + name
        code = code.replace("{{requestPath}}", body_path)

        let keysObj = '';
        let dataDriven = '';
        if (element.request.body?.mode == 'raw') {
            let firstObj = true;
            let firstddt = true;

            let dataraw = JSON.parse(element.request.body.raw)
            dataDriven += '{ '
            Object.keys(dataraw).forEach(element1 => {
                console.log(element1);
                if (firstObj === false) keysObj += ', ';
                keysObj += element1;
                firstObj = false;

                if (firstddt === false) dataDriven += ', ';
                dataDriven += element1 + ': ' + '"' + dataraw[element1] + '"';
                firstddt = false;
            });
            await waitFor(50);
            dataDriven += ', cases: "success", responseStatus: 200 }'
        } else 
        if (element.request.body?.mode == 'formdata') {
            let firstObj = true;
            let firstddt = true;

            dataDriven += '{ '
            asyncForEach(element.request.body.formdata, async (body) => {
                if (firstObj === false) keysObj += ', ';
                keysObj += body.key;
                firstObj = false;

                if (firstddt === false) dataDriven += ', ';
                dataDriven += body.key + ': ' + '"' + body.value + '"';
                firstddt = false;
            })
            await waitFor(50);
            dataDriven += ', cases: "success", responseStatus: 200 }'
        }

        await waitFor(50);

        code = code.replace("{{dataDriven}}", dataDriven) 
        code = code.replace("{{keyDataDriven1}}", keysObj) 
        code = code.replace("{{keyDataDriven2}}", keysObj) 

        // create file test
        fs.writeFile(path + '/' + name + '.spec.js',
        code, function (err) { if (err) throw err; });
    } else {
        // write describe
        let code = contents_GET.replace("{{describe}}", 'Test ' + element.name)
        // write method
        code = code.replace("{{method}}", (element.request.method).toLowerCase())
        // write endpoint
        let url = element.request.url.raw
        if (url.includes('http')) {
            code = code.replace("{{endpoint}}", new URL(url).pathname+new URL(url).search)
        } else {
            code = code.replace("{{endpoint}}", (url).replace("{{url}}", ""))
        }
        // write headers
        let headers = '';
        asyncForEach(element.request.header, async (header) => {
            headers += '.set("' + header.key + '", "' + header.value + '")';
        })
        await waitFor(50);
        code = code.replace("{{header}}", headers)

        // create test file
        fs.writeFile(path + '/' + name + '.spec.js',
        code, function (err) { if (err) throw err; });
    }

}

// Body generator
async function writeRequest(element, path) {
    let contents = fs.readFileSync('template/body.dot', 'utf8');

    const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
    let name = (element.name).toLowerCase().replace(/\s/g, '');
    name = name.replace(/\//g, '');

    if (element.request.method != "GET") {
        let keysraw = '';
        let params = '';
        let constructor = '';

        if (element.request.body?.mode == 'raw') {
            keysraw += '{'+'\r\n'
            let first = true;
            let firstparam = true;
            let firstcons = true;
            let dataraw = JSON.parse(element.request.body.raw)

            Object.keys(dataraw).forEach(element1 => {
                if (first === false) keysraw += ','+'\r\n';
                keysraw += '"' + element1+'"'  + ': ' + 'this.value_' + element1;
                first = false;

                if (firstparam === false) params += ', ';
                params += 'param_' + element1 + '=' + '"' + dataraw[element1] + '"';
                firstparam = false;

                if (firstcons === false) constructor += ','+'\r\n';
                constructor += 'this.value_' + element1 + ' = ' + 'param_' + element1;
                firstcons = false;
            });
            keysraw += '\r\n'+'}'

        } else 
        if (element.request.body?.mode == 'formdata') {
            keysraw += '{'+'\r\n'
            let first = true;
            let firstparam = true;
            let firstcons = true;

            asyncForEach(element.request.body.formdata, async (body) => {
                if (first === false) keysraw += ','+'\r\n';
                keysraw += '"' + body.key+'"'  + ': ' + 'this.value_' + body.key;
                first = false;

                if (firstparam === false) params += ', ';
                params += 'param_' + body.key + '=' + '"' + body.value + '"';
                firstparam = false;

                if (firstcons === false) constructor += ','+'\r\n';
                constructor += 'this.value_' + body.key + ' = ' + 'param_' + body.key;
                firstcons = false;
            })
            await waitFor(50);
            keysraw += '\r\n'+'}'
        }
        await waitFor(50);

        let code = contents.replace("{{objectBody}}", keysraw)
        code = code.replace("{{params}}", params)
        code = code.replace("{{constructor}}", constructor)

        // create request file
        fs.writeFile(path + '/' + name + '.js',
            code, function (err) { if (err) throw err ; });
    }
    
}

fs.readFile('Reqres.json', (err, data) => {
    if (err) throw err;
    let items = JSON.parse(data).item;
    const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
    console.log('')
    asyncForEach(items, async (element) => {
        // console.log(element);
        if (element.hasOwnProperty('item')) {
            const testPath = 'tests/' + element.name;
            fs.mkdirSync(testPath, { recursive: true })
            const requestPath = 'requests/' + element.name;
            fs.mkdirSync(requestPath, { recursive: true })
            // await waitFor(50)
            asyncForEach(element.item, async (second) => {
                const second_path = testPath
                if (second.hasOwnProperty('item') == false) {
                    // console.log(second.name)
                    writeTest(second, testPath, requestPath)
                    writeRequest(second, requestPath)
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