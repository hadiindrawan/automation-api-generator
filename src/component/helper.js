const fs = require('fs');
const isFileExisted = require('../utils/check_dir')

async function writeHelper() {
    // write helper dir
    const requestHelper = 'tests/helper';
    fs.mkdirSync(requestHelper, { recursive: true })

    await isFileExisted('tests', 'request.helper.js', function(data) {
        if (!data[0] && data[1] == 'tests/helper') {
            fs.writeFile('tests/helper/request.helper.js',
                fs.readFileSync('src/template/requestHelper.dot', 'utf8') , function (err) { if (err) throw err ; });
        }
        
    })
}

module.exports = writeHelper