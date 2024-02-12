import fs from 'fs'
import { promisify } from 'util';
import { asyncForEach } from 'utils/foreach';
import { isFileExisted } from 'utils/modul.js';
import { waitFor } from 'utils/wait';
const readFile = promisify(fs.readFile);

/**
 * @description main environment generator 
 * @param {any} file json file (.json)
 * @param {any} envName environment name
 * @returns {Promise<void>}
 */
export const generateEnv = async (file: any, envName: any): Promise<void> => {
    let envStr = ''

    const data: string = await readFile(file, 'utf8');
    const { item: items } = JSON.parse(data);

    let first: any;
    asyncForEach(items, async (item: any) => {
        if (item.enabled) {
            if (first === false) envStr += '\r\n'
            envStr += item.key + '=' + item.value
            first = false;
        }
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