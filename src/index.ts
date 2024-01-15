import fs from 'fs';
import {promisify} from 'util';
import inquirer from 'inquirer';
import {exec} from 'child_process';
import generate from 'generator/generate';

const readFile = promisify(fs.readFile);


function validateInputJson(input: any) {
    return input.includes('json') ? true : 'Please type correct answer, the file must be json format!'
}

async function existModuleType(): Promise<boolean | string> {
    try {
        const checkConfigImport = fs.readFileSync('./tests/utils/config.js').toString()
        const checkHelperImport = fs.readFileSync('./tests/helpers/request.helper.js').toString()

        if (checkConfigImport.includes('import dotenv from "dotenv"') || checkHelperImport.includes('import fs from "fs"')) return "Javascript modules (import/export)"

        return "CommonJS (require/exports)"
    } catch (e) {
        return true
    }
}

async function generateCommand() {
    let allAnswer: any = {};

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'moduleQ',
                message: 'What type of modules does your project use?',
                choices: ["Javascript modules (import/export)", "CommonJS (require/exports)"],
                when: () => projectModules()
            },
            {
                type: 'input',
                name: 'jsonFileQ',
                message: 'Input your json file to be generate (example.json):',
                default: 'example.json',
                validate: validateInputJson
            }
        ])
        .then(async (answers) => {
            Object.assign(allAnswer, answers);
            const data = await readFile(answers.jsonFileQ, 'utf8');
            const { item: items } = JSON.parse(data)

            const sortedArr = await items.sort((a: any, b: any) => {
                // Check if 'item' property exists in both objects
                const aHasItem = Object.prototype.hasOwnProperty.call(a, 'item');
                const bHasItem = Object.prototype.hasOwnProperty.call(b, 'item');

                // Sort based on presence of 'item' property
                if (aHasItem && !bHasItem) return 1;
                if (!aHasItem && bHasItem) return -1;

                return 0;
            });

            const option = await sortedArr.map((item: any) => item.hasOwnProperty('item') ? { name: `${item.name} - (suite)` } : { name: `${item.name} - (test)` });

            return inquirer.prompt([
                {
                    type: 'checkbox',
                    name: 'customKey',
                    message: 'Select one or more case or suite:',
                    pageSize: 10,
                    choices: option,
                    validate: function (value) {
                        if (value.length === 0) {
                            return 'Please select at least one case or suite';
                        }
                        return true;
                    },
                },
            ]);
        })
        .then(async (answers) => {
            Object.assign(allAnswer, answers);
            //Print message indicating automation test generation has started..
            // log(`Generating automation test..`, 'blue')

            // Call the generate function to generate automation tests.
            await generate(allAnswer, await existModuleType())

            await runPrettier(true)
            // write test script for run the regression test 
            let moduleType = allAnswer.moduleQ || await existModuleType()
            await rebuildPackagejson(moduleType)
        })
        .catch(async (err) => {
            console.log(err);
            console.log('Please type correct answer!');
            await generateCommand()
        })
}

async function runPrettier(prettierExist: any) {
    if (!prettierExist) {
        const installProcess = exec('npm install --save-dev --save-exact prettier')
        //This code is registering a listener to the exit event of installProcess
        installProcess.on('exit', async (code) => {
            exec('npx prettier . --write --trailing-comma none')
        })
    } else {
        exec('npx prettier . --write --trailing-comma none', (err, stdout) => {
            if (err) console.log(err);
        })
    }
}

async function rebuildPackagejson(answers: any) {
    const scriptName = 'regression:dev'; // Name of your new script
    const scriptCommand = 'cross-env NODE_ENV=dev mocha --specs Regression --timeout 15000'; // Command to execute your script

    // Read the package.json answers.jsonFileQ
    const packageJsonStr: any = fs.readFileSync('./package.json');
    const packageJson = await JSON.parse(packageJsonStr);

    // Add the new script to the scripts object
    packageJson['scripts'] = packageJson['scripts'] || {}; // Initialize 'scripts' object if it doesn't exist
    packageJson.scripts[scriptName] = scriptCommand; // Assign the script command to the given script name

    // Write the updated package.json answers.jsonFileQ
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
}