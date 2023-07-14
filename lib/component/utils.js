import fs from 'fs'
import { promisify } from 'util';
import isFileExisted from "../utils/check_dir.js";
import basePath from "../utils/base_path.js";

const writeFile = promisify(fs.writeFile);
// Asynchronous function to write data into directory
async function writeUtils(moduleType) {
    // create helper directory if it doesn't exists
    const utilsDir = "tests/utils";
    fs.mkdirSync(utilsDir, { recursive: true }, function (err) {
        if (err) throw err;
    });

    // template dir name
    const templateDir = moduleType == "Javascript modules (import/export)" ? "lib/template/jsimport/config.dot" : "lib/template/commonjs/config.dot"

    // Check if a file named 'request.helper.js' exists in the tests/helper dir
    // If it does not exist then create a new file based on the template file 'requestHelper.dot'
    try {
        const [fileExists] = await isFileExisted(utilsDir, "config.js");
        if (!fileExists) {
            // create file test
            writeFile(
                "tests/utils/config.js",
                fs.readFileSync(basePath() + templateDir, "utf8"),
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

export default writeUtils;
