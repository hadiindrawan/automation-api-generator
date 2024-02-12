import fs from 'fs'
import { isFileExisted } from 'utils/modul';
import basePath from 'utils/path';
import { waitFor } from 'utils/wait';

/**
 * @description asynchronous function to write utils into directory
 * @param {string} moduleType module type will be used
 * @returns {Promise<void>}
 */
export const writeUtils = async (moduleType: string): Promise<void> => {
    // create helper directory if it doesn't exists
    const utilsDir = "tests/utils";
    fs.mkdirSync(utilsDir, { recursive: true });

    const utilsList = [
        'config',
        'logger',
        'custom_file_transport'
    ]

    for (const util of utilsList) {
        // template dir name
        const templateDir = moduleType == "Javascript modules (import/export)" ? `lib/template/jsimport/${util}.dot` : `lib/template/commonjs/${util}.dot`

        // Check if a file named 'request.helper.js' exists in the tests/helper dir
        // If it does not exist then create a new file based on the template file 'requestHelper.dot'
        try {
            const [fileExists] = await isFileExisted(utilsDir, `${util}.js`);
            if (!fileExists) {
                // create file test
                fs.writeFileSync(
                    `tests/utils/${util}.js`,
                    fs.readFileSync(basePath() + templateDir, "utf8"),
                    'utf8'
                )
                await waitFor(500)
            }
        } catch (err) {
            console.log(err);
        }
    }
}
