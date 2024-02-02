import fs from 'fs'
import { defaultMochaConfig } from 'template/config';
import { isFileExisted } from 'utils/modul';
import { basedir } from 'utils/path';
import { waitFor } from 'utils/wait';

/**
 * @description asynchronous function to write runner into directory
 * @param {any[]} testsPath all generated test path
 * @returns {Promise<void>}
 */
export const writeRunner = async (testsPath: any[]): Promise<void>  => {
    const mapTestbySuite = await testsPath.reduce((result: any, element: any): Promise<void> => {
        const parts = element.split('/');
        const key = parts[2].includes('.js') ? 'Base' : parts[2].replace(/\s/g, '');
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(element);
        return result;
    }, {});

    try {
        const [fileExists] = await isFileExisted(basedir(), ".mocharc.js");
        if (!fileExists) {
            mapTestbySuite['Regression'] = 'tests/scenarios/**/*.spec.js'
            let contents = defaultMochaConfig.replace('{{runner}}', JSON.stringify(mapTestbySuite))
            contents = contents.replace('{{ignorelist}}', '[\n// write your ignore tests here \n]')
            // create file test
            fs.writeFileSync(
                basedir() + '/.mocharc.js', contents,
                'utf8'
            )
            await waitFor(500)
        } else {
            let current_contents = fs.readFileSync(basedir() + `/.mocharc.js`, 'utf8');
            let contents = defaultMochaConfig;

            const getTestListVariable = /const\s+runTestsList\s+=\s+(\{[\s\S]*?\});/;
            const match = getTestListVariable.exec(current_contents);

            const getIgnoreListVariable = /const\s+ignoreTestsList\s+=\s+(\[[\s\S]*?\]);/;
            const matchIgnore = getIgnoreListVariable.exec(current_contents);

            if (match && match[1]) {
                const convertObjectKey = /(\w+)\s*:/g;
                const finalString = match[1].replace(convertObjectKey, '"$1":');
                const runTestsList = JSON.parse(finalString);
                contents = contents.replace('{{runner}}', JSON.stringify(Object.assign(runTestsList, mapTestbySuite)))
            } else {
                console.log("Variable ignoreTestsList not found in the input string.");
            }

            if (matchIgnore && matchIgnore[1]) {
                contents = contents.replace('{{ignorelist}}', matchIgnore[1])
            } else {
                console.log("Variable runTestsList not found in the input string.");
            }
            // create file test
            fs.writeFileSync(
                basedir() + '/.mocharc.js', contents,
                'utf8'
            )
            await waitFor(500)
        }
    } catch (err) {
        console.log(err);
    }
}