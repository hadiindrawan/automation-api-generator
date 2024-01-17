import fs from 'fs'
import { isFileExisted } from 'utils/modul';
import basePath from 'utils/path';
import { waitFor } from 'utils/wait';

// Asynchronous function to write data into directory
export const writeUtils = async (moduleType: string) => {
    // create helper directory if it doesn't exists
    const utilsDir = "tests/utils";
    fs.mkdirSync(utilsDir, { recursive: true });

    // template dir name
    const templateDir = moduleType == "Javascript modules (import/export)" ? "lib/template/jsimport/config.dot" : "lib/template/commonjs/config.dot"

    // Check if a file named 'request.helper.js' exists in the tests/helper dir
    // If it does not exist then create a new file based on the template file 'requestHelper.dot'
    try {
        const [fileExists] = await isFileExisted(utilsDir, "config.js");
        if (!fileExists) {
            // create file test
            fs.writeFileSync(
                "tests/utils/config.js",
                fs.readFileSync(basePath() + templateDir, "utf8"),
                'utf8'
            )
            await waitFor(500)
        }
    } catch (err) {
        console.log(err);
    }
}
