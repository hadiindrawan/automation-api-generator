#!/usr/bin/env node
import fs from 'fs'
import { promisify } from 'util';
import inquirer from 'inquirer';
import { exec } from 'child_process';
import generate from './lib/generate_refactor.js';
import generateEnv from './lib/generate_env.js';
import { log } from './lib/utils/logs.js';
import asyncForEach from './lib/utils/foreach.js';

let eslintConfig = 
`{
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "no-undef": 0,
        "no-prototype-builtins": 0
    }
}`

function projectModules() {
    const packageJson = JSON.parse(fs.readFileSync('./package.json'))
    return packageJson.type == undefined ? true : false
}

async function existModuleType() {
    // const packageJson = JSON.parse(fs.readFileSync('./package.json'))
    // if (packageJson.type != undefined) {
    //     return packageJson.type == 'module' ? "Javascript modules (import/export)" : "CommonJS (require/exports)"
    // }
    return 'CommonJS (require/exports)'
}

function validateInputJson(input) {
    return input.includes('json') ? true : 'Please type correct answer, the file must be json format!'
}

function validateInputEnvName(input) {
    return /[A-Z]/.test(input) ? 'Input must be lowercase!' : true
}

const readFile = promisify(fs.readFile);

async function generateCommand() {
    let allAnswer = {}
    inquirer
        .prompt([
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
            const data = await readFile(answers.jsonFileQ);
            const { item: items } = JSON.parse(data)

            const sortedArr = await items.sort((a, b) => {
              // Check if 'item' property exists in both objects
              const aHasItem = Object.prototype.hasOwnProperty.call(a, 'item');
              const bHasItem = Object.prototype.hasOwnProperty.call(b, 'item');
            
              // Sort based on presence of 'item' property
              if (aHasItem && !bHasItem) return 1;
              if (!aHasItem && bHasItem) return -1;
            
              return 0;
            });

            const option = await sortedArr.map(item => item.hasOwnProperty('item') ? { name: `${item.name} - (suite)` } : { name: `${item.name} - (test)` });


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
            log(`Generating automation test..`, 'blue')

            // Call the generate function to generate automation tests.
            await generate(allAnswer, await existModuleType())
            // write test script for run the regression test 
            // await rebuildPackagejson()
        })
        .catch(async (err) => {
            console.log(err);
            console.log('Please type correct answer!');
            await generateCommand()
        })
}

function generateEnvCommand() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'jsonFileQ',
                message: 'Input your json file to be generate (example.json):',
                default: 'example-env.json',
                validate: validateInputJson
            },
            {
                type: 'input',
                name: 'envQ',
                message: 'Input your environment name:',
                default: 'dev',
                validate: validateInputEnvName
            }
        ])
        .then((answers) => {
            //Print message indicating environment test generation has started..
            log(`Generating environment test..`, 'blue')

            //Call the generate function to generate environment tests.
            generateEnv(answers.jsonFileQ.includes('"') ? answers.jsonFileQ.replace(/"/g, '') : answers.jsonFileQ, answers.envQ)
        })
        .catch((err) => {
            console.log(err);
            log('Please type correct answer!', 'yellow')
            generateEnvCommand()
        })
}

const argRunner = process.argv[process.argv.length - 1]

if (argRunner == 'generate') {
    await generateCommand()
} else if (argRunner == 'env-generate') {
    generateEnvCommand()
} else {
    exec('npm list --json', (error, stdout) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        // Parse the JSON object from stdout, and assign any dependencies to packageList variable
        const packageList = JSON.parse(stdout).dependencies;
        // Set packagesExist variable to list of object keys if packageList is not undefined, otherwise set packagesExist to an empty array
        const packagesExist = packageList !== undefined ? Object.keys(packageList) : [];

        let needPackage = ['chai', 'mocha', 'chai-http', 'chai-json-schema', 'dotenv', 'to-json-schema', 'cross-env']
        let matchedPack = needPackage.filter(key => !packagesExist.includes(key))
        let strPack = matchedPack.join(' ')

        let mochaExist = packagesExist.includes('mocha') ? false : true
        let eslintExist = packagesExist.includes('eslint') ? false : true

        function mochaweExist(answers) {
            if (answers.hasOwnProperty('frameworkQ')) {
                return answers.frameworkQ == "Mocha chai" && !packagesExist.includes('mochawesome') ? true : false
            } else {
                return !packagesExist.includes('mochawesome') ? true : false
            }
        }

        function question() {
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'frameworkQ',
                        message: 'What framework will be used?',
                        choices: ["Mocha chai"],
                        when: () => mochaExist
                    },
                    {
                        type: 'list',
                        name: 'moduleQ',
                        message: 'What type of modules does your project use?',
                        choices: ["Javascript modules (import/export)", "CommonJS (require/exports)"],
                        when: () => projectModules()
                    },
                    {
                        type: 'list',
                        name: 'eslintQ',
                        message: 'Do you want to install ESlint?',
                        choices: ["Yes", "No"],
                        when: () => eslintExist
                    },
                    {
                        type: 'list',
                        name: 'mochaweQ',
                        message: 'Do you want to install Mochawesome?',
                        choices: ["Yes", "No"],
                        when: (answers) => mochaweExist(answers)
                    },
                    {
                        type: 'input',
                        name: 'jsonFileQ',
                        message: 'Type your json file to be generate (example.json):',
                        default: 'example.json',
                        validate: validateInputJson
                    }
                ])
                .then((answers) => {
                    let npm = ''
                    if (answers.eslintQ == 'Yes') {
                        npm += ' eslint'

                        // Write eslint configuration
                        let moduleType = answers.moduleQ || existModuleType()
                        if (moduleType == "Javascript modules (import/export)") {
                            const jsonConfig = JSON.parse(eslintConfig)
                            jsonConfig.parserOptions = { ecmaVersion: 'latest', sourceType: 'module' }

                            eslintConfig = JSON.stringify(jsonConfig, null,2)
                        }

                        fs.writeFile('.eslintrc.json', eslintConfig, function (err) { if (err) throw err; });
                    }
                    if (answers.mochaweQ == 'Yes') {
                        npm += ' mochawesome'
                    }

                    if (strPack != '' && npm != '') {
                        // This line of code will print "Installing dependencies..." on the console.
                        console.log("Installing dependencies...");
                        installPackage(strPack, npm, answers.jsonFileQ, answers.moduleQ)
                    } else if (strPack != '' && npm == '') {
                        // This line of code will print "Installing dependencies..." on the console.
                        console.log("Installing dependencies...");
                        installPackage(strPack, npm, answers.jsonFileQ, answers.moduleQ)
                    } else if (strPack == '' && npm != '') {
                        // This line of code will print "Installing dependencies..." on the console.
                        console.log("Installing dependencies...");
                        installDevPackge(npm, answers.jsonFileQ, answers.moduleQ)
                    } else {
                        //Print message indicating automation test generation has started..
                        console.log(`${'\x1b[34m'}Generating automation test..${'\x1b[0m'}`)

                        //Call the generate function to generate automation tests.
                        generate(answers.jsonFileQ.includes('"') ? answers.jsonFileQ.replace(/"/g, '') : answers.jsonFileQ, answers.moduleQ || existModuleType())

                        // write test script for run the regression test 
                        rebuildPackagejson(answers.moduleQ)
                    }

                })
                .catch((err) => {
                    console.log('Please type correct answer!');
                    question()
                })
        }
        question()
    })
}

async function rebuildPackagejson(answers) {
    const scriptName = 'test:dev'; // Name of your new script
    const scriptCommand = 'cross-env NODE_ENV=dev mocha runner/regression.js --timeout 15000'; // Command to execute your script
    
    const typeKey = 'type'; // Name of your new script
    const typeValue = answers == "CommonJS (require/exports)" ? 'commonjs' : 'module'; // Command to execute your script

    // Read the package.json answers.jsonFileQ
    const packageJson = await JSON.parse(fs.readFileSync('./package.json'));

    // Add the new script to the scripts object
    packageJson.scripts[scriptName] = scriptCommand;
    // Add type project
    if (answers != undefined) {
        packageJson[typeKey] = typeValue
    }

    // Write the updated package.json answers.jsonFileQ
    await fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
}

function installPackage(strPack, npm, jsonfile, moduleQ) {
    const installProcess = exec('npm install ' + strPack);
    //This code is registering a listener to the exit event of installProcess
    installProcess.on('exit', (code) => {
        //checking if npm install failed or succeeded by checking exit code
        if (code !== 0) {
            //if the exit code is not 0, it means the installation has failed. So, print error message and return.
            console.error(`${'\x1b[31m'}npm install failed with code ${code}${'\x1b[0m'}`)
            return;
        }

        if (npm != '') {
            installDevPackge(npm, jsonfile)
        } else {
            //If the program reaches here, it means the install process was successful. Print a success message.
            console.log(`${'\x1b[32m'}Installation completed successfully!${'\x1b[0m'}`)

            //Print message indicating automation test generation has started..
            console.log(`${'\x1b[34m'}Generating automation test..${'\x1b[0m'}`)

            //Call the generate function to generate automation tests.
            generate(jsonfile.includes('"') ? jsonfile.replace(/"/g, '') : jsonfile, moduleQ || existModuleType())

            // write test script for run the regression test 
            rebuildPackagejson(moduleQ)
        }
    })
}

function installDevPackge(npm, jsonfile, moduleQ) {
    const installOption = exec('npm install' + npm + ' --save-dev')
    installOption.on('exit', (res) => {
        //checking if npm install failed or succeeded by checking exit code
        if (res !== 0) {
            //if the exit code is not 0, it means the installation has failed. So, print error message and return.
            console.error(`${'\x1b[31m'}npm install failed with code ${res}${'\x1b[0m'}`)
            return;
        }

        //If the program reaches here, it means the install process was successful. Print a success message.
        console.log(`${'\x1b[32m'}Installation completed successfully!${'\x1b[0m'}`)

        //Print message indicating automation test generation has started..
        console.log(`${'\x1b[34m'}Generating automation test..${'\x1b[0m'}`)

        //Call the generate function to generate automation tests.
        generate(jsonfile.includes('"') ? jsonfile.replace(/"/g, '') : jsonfile, moduleQ || existModuleType())

        // write test script for run the regression test 
        rebuildPackagejson(moduleQ)
    })
}


