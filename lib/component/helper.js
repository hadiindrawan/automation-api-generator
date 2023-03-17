const fs = require('fs');
const isFileExisted = require('../utils/check_dir')
const basePath = require('../utils/base_path')

// Asynchronous function to write data into directory
async function writeHelper() {
    // create helper directory if it doesn't exists
    const helperDir = 'tests/helper';
    fs.mkdirSync(helperDir, { recursive: true })

    // Check if a file named 'request.helper.js' exists in the tests/helper dir
    // If it does not exist then create a new file based on the template file 'requestHelper.dot'
    await isFileExisted('tests', 'request.helper.js', function(data) {
        if (!data[0] && data[1] == 'tests/helper') {
            fs.writeFile('tests/helper/request.helper.js',
                fs.readFileSync(basePath() + 'lib/template/requestHelper.dot', 'utf8') , function (err) { if (err) throw err ; });
        }  
    })

    // Check if a file named 'general.helper.js' exists in the tests/helper dir
    // If it does not exist then create a new file based on the template file 'generalHelper.dot'
    await isFileExisted('tests', 'general.helper.js', function(data) {
        if (!data[0] && data[1] == 'tests/helper') {
            fs.writeFile('tests/helper/general.helper.js',
                fs.readFileSync(basePath() + 'lib/template/generalHelper.dot', 'utf8') , function (err) { if (err) throw err ; });
        }  
    })
}


module.exports = writeHelper