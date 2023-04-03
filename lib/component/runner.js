import fs from "fs"
import asyncForEach from "../utils/foreach.js"
import waitFor from "../utils/wait.js"
import isFileExisted from "../utils/check_dir.js"


// Runner file generator
async function writeRunner(element, testPath, runPath, moduleType) {
    let name = (element.name).toLowerCase().replace(/\s/g, '');
    name = name.replace(/\//g, '');

    let first
    let fisrtExe
    let runner = ''
    let importExe = ''
    if (element.hasOwnProperty('item')) {
        asyncForEach(element.item, async (item) => {
            if (!item.hasOwnProperty('item')) {
                let namet = (item.name).toLowerCase().replace(/\s/g, '')
                namet = namet.replace(/\//g, '')
                namet = namet.replace('-', '_')
                namet = namet.replace('(', '_')
                namet = namet.replace(')', '_')

                let method
                if (item.request.hasOwnProperty('method')) {
                    method = item.request.method
                }
                if (item.request.hasOwnProperty('url')) {
                    if (moduleType == "Javascript modules (import/export)") {
                        if (first === false) runner += '\r\n'
                            runner += "import " + namet + " from '"+ testPath + '/' + method + '_' + namet + ".spec.js'"
                            first = false;

                        if (fisrtExe === false) importExe += '\r\n'
                            importExe +=  namet + "()"
                            fisrtExe = false;
                    } else {
                        if (first === false) runner += '\r\n'
                            runner += "require('"+ testPath+'/'+method+'_'+namet+".spec')()"
                            first = false;
                    }
                }
            }
        })
    } else {
        let namet = (element.name).toLowerCase().replace(/\s/g, '')
        namet = namet.replace(/\//g, '')
        namet = namet.replace('-', '_')
        namet = namet.replace('-', '_')
        namet = namet.replace('(', '_')
        namet = namet.replace(')', '_')

        let method
        if (element.request.hasOwnProperty('method')) {
            method = element.request.method
        }
        if (element.request.hasOwnProperty('url')) {
            if (first === false) runner += '\r\n'
                runner += "require('"+ testPath+'/'+method+'_'+namet+".spec')()"
                first = false;
        }
    }
    await waitFor(10)
    runner += '\r\n' + '\r\n' + importExe + '\r\n'
    await waitFor(10)
    if (moduleType == "Javascript modules (import/export)") {
        runner += '\r\n' + 'export default () => {}'
        await waitFor(10)
    } else {
        runner += '\r\n' + 'module.exports = () => {}'
        await waitFor(10)
    }

    // check if file exists
    isFileExisted(runPath, name + '.js')
        .then((data) => {
            if (!data[0]) {
                // create write runner content
                if (moduleType == "Javascript modules (import/export)") {
                    if (runner.includes('import'))
                        fs.writeFile(runPath + '/' + name + '.js', runner, function (err) { if (err) throw err; });
                } else {
                    if (runner.includes('require'))
                        fs.writeFile(runPath + '/' + name + '.js', runner, function (err) { if (err) throw err; });
                }
            }
        })
        .catch(err => console.log(err));

    // check if file exists
    isFileExisted(runPath, 'regression.js')
        .then((data) => {
            if (!data[0]) {
                // create write runner content
                if (moduleType == "Javascript modules (import/export)") {
                    if (runner.includes('import'))
                        fs.writeFile('runner/regression.js', '// Write your suite test runner here', function (err) { if (err) throw err; });
                } else {
                    if (runner.includes('require'))
                        fs.writeFile('runner/regression.js', '// Write your suite test runner here', function (err) { if (err) throw err; });
                }
            }
        })
        .catch(err => console.log(err));
}

export default writeRunner