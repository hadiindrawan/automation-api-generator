#!/usr/bin/env node
import fs from 'fs'
import inquirer from 'inquirer';
import { exec } from 'child_process';
import generate from './lib/generate.js';

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
    const packageType = packageJson.type || 'commonjs'

    return packageType === 'commonjs'
}

function validateInput(input) {
    return input.includes('json') ? true : 'Please type correct answer, the file must be json format!'
}

function generateCommand() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'jsonFileQ',
                message: 'Input your json file to be generate (example.json):',
                default: 'example.json',
                validate: validateInput
            }
        ])
        .then((answers) => {
            //Print message indicating automation test generation has started..
            console.log(`${'\x1b[34m'}Generating automation test..${'\x1b[0m'}`)

            //Call the generate function to generate automation tests.
            generate(answers.jsonFileQ.includes('"') ? answers.jsonFileQ.replace(/"/g, '') : answers.jsonFileQ, projectModules() ? "CommonJS (require/exports)" : "Javascript modules (import/export)")
            // write test script for run the regression test 
            addScriptRunner()
        })
        .catch((err) => {
            console.log(err);
            console.log('Please type correct answer!');
            generateCommand()
        })
}

const argRunner = process.argv[process.argv.length - 1]

if (argRunner != 'undefined' && argRunner == 'generate') {
    generateCommand()
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
                        validate: validateInput
                    }
                ])
                .then((answers) => {
                    let npm = ''
                    if (answers.eslintQ == 'Yes') {
                        npm += ' eslint'

                        // Write eslint configuration
                        let moduleType = answers.moduleQ || "Javascript modules (import/export)"
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
                        generate(answers.jsonFileQ.includes('"') ? answers.jsonFileQ.replace(/"/g, '') : answers.jsonFileQ, answers.moduleQ || "Javascript modules (import/export)")

                        // write test script for run the regression test 
                        addScriptRunner()
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

function addScriptRunner() {
    const scriptName = 'test:dev'; // Name of your new script
    const scriptCommand = 'cross-env NODE_ENV=dev mocha runner/regression.js --timeout 15000'; // Command to execute your script

    // Read the package.json answers.jsonFileQ
    const packageJson = JSON.parse(fs.readFileSync('./package.json'));

    // Add the new script to the scripts object
    packageJson.scripts[scriptName] = scriptCommand;

    // Write the updated package.json answers.jsonFileQ
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
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
            generate(jsonfile.includes('"') ? jsonfile.replace(/"/g, '') : jsonfile, moduleQ || "Javascript modules (import/export)")

            // write test script for run the regression test 
            addScriptRunner()
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
        generate(jsonfile.includes('"') ? jsonfile.replace(/"/g, '') : jsonfile, moduleQ || "Javascript modules (import/export)")

        // write test script for run the regression test 
        addScriptRunner()
    })
}


