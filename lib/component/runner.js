import fs from 'fs'
import { promisify } from 'util';
import isFileExisted from "../utils/check_dir.js";
import { basedir } from "../utils/base_path.js";
import { default_mocharc } from '../template/config.js';
import waitFor from '../utils/wait.js';

const writeFile = promisify(fs.writeFile);
// Asynchronous function to write data into directory
async function writeRunner(test_path_array) {
    const defaultTest = {
        default: test_path_array
    }
    
    let contents = default_mocharc.replace('{{runner}}', JSON.stringify(defaultTest))

    try {
        const [fileExists] = await isFileExisted(basedir(), ".mocharc.js");
        if (!fileExists) {
            // create file test
            writeFile(
                basedir() + '/.mocharc.js', contents,
                function (err) {
                    if (err) throw err;
                }
            )
            await waitFor(500)
        }
    } catch (err) {
        console.log(err);
    }
}

export default writeRunner;
