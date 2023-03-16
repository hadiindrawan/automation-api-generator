const fs = require('fs');
const asyncForEach = require('../utils/foreach')
const waitFor = require('../utils/wait')
const isFileExisted = require('../utils/check_dir')


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
}

module.exports = writeRunner