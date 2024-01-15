import fs from 'fs';
/**
 * @param {string} path - some text to console log
 * @param {string} fileName - color 
 * @returns {Promise<Array[boolean, string | null]>}
 */
export async function isFileExisted(path: string, fileName: string): Promise<[boolean, string | null]> {
    const data: string[] = fs.readdirSync(path);

    for (let file of data) {
        const curPath: string = path + '/' + file;

        if (file === 'node_modules') {
            continue;
        } else if (fs.statSync(curPath).isDirectory()) {
            const res: [boolean, string | null] = await isFileExisted(curPath, fileName);

            if (res[0]) return [true, res[1]];
        } else if (file === fileName) {
            return [true, curPath];
        }
    }
    return [false, null];
}

export const existModuleType = async (): Promise<boolean | string> =>{
    try {
        const checkConfigImport = fs.readFileSync('./tests/utils/config.js').toString()
        const checkHelperImport = fs.readFileSync('./tests/helpers/request.helper.js').toString()

        if (checkConfigImport.includes('import dotenv from "dotenv"') || checkHelperImport.includes('import fs from "fs"')) return "Javascript modules (import/export)"

        return "CommonJS (require/exports)"
    } catch (e) {
        return true
    }
}

export const rebuildPackagejson = async () => {
    const scriptName = 'regression:dev'; // Name of your new script
    const scriptCommand = 'cross-env NODE_ENV=dev mocha --specs Regression --timeout 15000'; // Command to execute your script

    // Read the package.json answers.jsonFileQ
    const packageJson = await JSON.parse(fs.readFileSync('./package.json', 'utf8'));

    // Add the new script to the scripts object
    packageJson['scripts'] = packageJson['scripts'] || {}; // Initialize 'scripts' object if it doesn't exist
    packageJson.scripts[scriptName] = scriptCommand; // Assign the script command to the given script name

    // Write the updated package.json answers.jsonFileQ
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
}