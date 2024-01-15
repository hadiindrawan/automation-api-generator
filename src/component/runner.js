import fs from 'fs'
import isFileExisted from "../utils/check_dir.js";
import basePath, { basedir } from "../utils/base_path.js";
import { default_mocharc } from '../template/config.js';
import waitFor from '../utils/wait.js';

// Asynchronous function to write data into directory
async function writeRunner(test_path_array) {
    const mapTestbySuite = await test_path_array.reduce((result, element) => {
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
            let contents = default_mocharc.replace('{{runner}}', JSON.stringify(mapTestbySuite))
            contents = contents.replace('{{ignorelist}}', '[\n// write your ignore tests here \n]')
            // create file test
            fs.writeFileSync(
                basedir() + '/.mocharc.js', contents,
                function (err) {
                    if (err) throw err;
                }
            )
            await waitFor(500)
        } else {
            let current_contents = fs.readFileSync(basedir() + `/.mocharc.js`, 'utf8');
            let contents = default_mocharc

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
