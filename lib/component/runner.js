import fs from "fs"
import asyncForEach from "../utils/foreach.js"
import waitFor from "../utils/wait.js"
import isFileExisted from "../utils/check_dir.js"


// Runner file generator
async function writeRunner(element, testPath, runPath) {
    let name = (element.name).toLowerCase().replace(/\s/g, '');
    name = name.replace(/\//g, '');

    let first
    let runner = ''
    if (element.hasOwnProperty('item')) {
        asyncForEach(element.item, async (item) => {
            if (!item.hasOwnProperty('item')) {
                let namet = (item.name).toLowerCase().replace(/\s/g, '');
                namet = namet.replace(/\//g, '');
                let method = item.request.method

                if (first === false) runner += '\r\n'
                    runner += "require('"+ testPath+'/'+method+'_'+namet+".spec')()"
                    first = false;
            }
        })
    } else {
        let namet = (element.name).toLowerCase().replace(/\s/g, '');
        namet = namet.replace(/\//g, '');
        let method = element.request.method

        if (first === false) runner += '\r\n'
            runner += "require('"+ testPath+'/'+method+'_'+namet+".spec')()"
            first = false;
    }
    await waitFor(10)
    runner += '\r\n'+'module.exports = () => {}'
    await waitFor(10)
    
    // check if file exists
    await isFileExisted('runner', name + '.js', function(data) {
        if (!data[0] && data[1] == runPath) {
            // create write runner content
            if (runner.includes('require'))
                fs.writeFile(runPath + '/' + name + '.js', runner, function (err) { if (err) throw err ; });
        }
    })

    // check if file exists
    await isFileExisted('runner', 'regression.js', function(data) {
        if (!data[0] && data[1] == runPath) {
            // create write runner content
            if (runner.includes('require'))
                fs.writeFile('runner/regression.js', '// Write your suite test runner here', function (err) { if (err) throw err ; });
        }
    })
}

export default writeRunner