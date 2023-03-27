import fs from 'fs'
import isFileExisted from './utils/check_dir.js';
import asyncForEach from './utils/foreach.js';
import waitFor from './utils/wait.js';

async function generateEnv(file, envName) {
    let envStr = ''

    fs.readFile(file, (err, data) => {
        if (err) throw err;
        let items = JSON.parse(data).values;

        let first
        asyncForEach(items, async (data) => {
            if (data.enabled) {
                if (first === false) envStr += '\r\n'
                    envStr += data.key + '=' + data.value
                    first = false;
            }
        })
    })

    await waitFor(100)

    // check if pages file exists
    isFileExisted(process.cwd(), '.env.' + envName)
        .then((data) => {
            if (!data[0]) {
                // create file test
                fs.writeFile('.env.' + envName,
                    envStr, function (err) { if (err) throw err; });
                
                // _postman_isSubFolder
                console.log(`${'\x1b[32m'}ø  Generate environment file completed successfully${'\x1b[0m'}`)
            } else {
                console.log(`${'\x1b[33m'}ø The environment file has already created${'\x1b[0m'}`);
            }
        })
        .catch((err) => console.log(err));
}

export default generateEnv