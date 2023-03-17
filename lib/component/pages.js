const fs = require('fs');
const asyncForEach = require('../utils/foreach')
const waitFor = require('../utils/wait')
const isFileExisted = require('../utils/check_dir')
const basePath = require('../utils/base_path')

// Pages file generator
async function writePages(element, path, jsonSchemaRelativePath, helperPath) {
    let contents = fs.readFileSync(basePath() + 'lib/template/request.dot', 'utf8');

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

            if (data.some(datas => datas['type'] === 'file')) {
                contents = fs.readFileSync(basePath() + 'lib/template/requestWithAttach.dot', 'utf8');
                
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
                contents = fs.readFileSync(basePath() + 'lib/template/request.dot', 'utf8');
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
    let method = element.request.method
    let code = contents.replace("{{method}}", (method).toLowerCase())
    await waitFor(50);

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
        if (auth.hasOwnProperty('bearer')){
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
    code = code.replace("{{jsonSchemaPath}}", jsonSchemaRelativePath + '/' + method + '_'+ name + '.json')
    code = code.replace("{{bodyFunc}}", bodyFunc)
    code = code.replace("{{rawAtt}}", attKey)
    code = code.replace("{{helperPath}}", helperPath)

    await waitFor(50);

    // check if pages file exists
    await isFileExisted('tests/pages', 'main.pages.js', function(data) {
        if (!data[0] && data[1] == path) {
            // create file test
            fs.writeFile(path + '/' + 'main.pages.js',
                fs.readFileSync(basePath() + 'lib/template/mainPages.dot', 'utf8'), function (err) { if (err) throw err; });
        }
    })

    // check if pages file exists
    await isFileExisted('tests', method + '_' +name + '.js', function(data) {
        if (!data[0] && data[1] == path) {
            // create file test
            fs.writeFile(path + '/' + method + '_' +name + '.js',
            code, function (err) { if (err) throw err; });
        }
    })
}

module.exports = writePages