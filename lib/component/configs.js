import fs from 'fs'
import isFileExisted from "../utils/check_dir.js";
import basePath, { basedir } from "../utils/base_path.js";
import waitFor from '../utils/wait.js';
import asyncForEach from '../utils/foreach.js';

// Asynchronous function to write data into directory
async function writeConfigs(configList) {
    await asyncForEach(configList, async (item) => {
        try {
            const [fileExists] = await isFileExisted(basedir(), `${item.filename}`);
            if (!fileExists) {
                // create file test
                fs.writeFileSync(
                    basedir() + `/${item.filename}`, item.template,
                    function (err) {
                        if (err) throw err;
                    }
                )
                await waitFor(500)
            }
        } catch (err) {
            console.log(err);
        }
    })
}

export default writeConfigs;
