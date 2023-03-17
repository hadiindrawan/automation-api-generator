#!/usr/bin/env node
const fs = require('fs');
const { exec } = require("child_process")
const readline = require('readline');
const generator = require('./lib/generate.js')

function addScriptRunner() {
    const scriptName = 'test:regression'; // Name of your new script
    const scriptCommand = 'mocha runner/regression.js --timeout 15000 --dev'; // Command to execute your script

    // Read the package.json file
    const packageJson = JSON.parse(fs.readFileSync('./package.json'));

    // Add the new script to the scripts object
    packageJson.scripts[scriptName] = scriptCommand;

    // Write the updated package.json file
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
}

const eslintConfig = 
`{
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
}`

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function runGenAll(strPack) {
    rl.question('Do you want to install ESlint? (y/n) : ', (eslint) => {
        if(eslint == 'y' || eslint == 'Y' || eslint == 'n' || eslint == 'N') {
            rl.question('Do you want to install Mochawesome? (y/n) : ', (mochawe) => {
                if(mochawe == 'y' || mochawe == 'Y' || mochawe == 'n' || mochawe == 'N') {
                    rl.question('Type your json file to be generate : ', (file) => {
                        if(file.includes('.json')) {
                            let npm = ''
                            if(eslint == 'y' || eslint == 'Y') {
                                npm += ' eslint'
                            }
                            if(mochawe == 'y' || mochawe == 'Y') {
                                npm += ' mochawesome'
                            }
                            if(strPack != '' && npm != '') {
                                // This line of code will print "Installing dependencies..." on the console.
                                console.log("Installing dependencies...");
                                const installProcess = exec('npm install '+strPack);
                                //This code is registering a listener to the exit event of installProcess
                                installProcess.on('exit', (code) => { 
                                    //checking if npm install failed or succeeded by checking exit code
                                    if (code !== 0) { 
                                        //if the exit code is not 0, it means the installation has failed. So, print error message and return.
                                        console.error(`${'\x1b[31m'}npm install failed with code ${res}${'\x1b[0m'}`)
                                        return;
                                    }

                                    const installOption = exec('npm install'+npm+' --save-dev')
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
                                        
                                        //Call the generator function to generate automation tests.
                                        generator(file.includes('"') ? file.replace(/"/g, '') : file)

                                        // write test script for run the regression test 
                                        addScriptRunner()
                                    })
                                })
                            } else
                            if(strPack != '' && npm == '') {
                                // This line of code will print "Installing dependencies..." on the console.
                                console.log("Installing dependencies...");
                                const installProcess = exec('npm install '+strPack);
                                //This code is registering a listener to the exit event of installProcess
                                installProcess.on('exit', (code) => { 
                                    //checking if npm install failed or succeeded by checking exit code
                                    if (code !== 0) { 
                                        //if the exit code is not 0, it means the installation has failed. So, print error message and return.
                                        console.error(`${'\x1b[31m'}npm install failed with code ${res}${'\x1b[0m'}`)
                                        return;
                                    }

                                    //If the program reaches here, it means the install process was successful. Print a success message.
                                    console.log(`${'\x1b[32m'}Installation completed successfully!${'\x1b[0m'}`)
                                    
                                    //Print message indicating automation test generation has started..
                                    console.log(`${'\x1b[34m'}Generating automation test..${'\x1b[0m'}`)
                                    
                                    //Call the generator function to generate automation tests.
                                    generator(file.includes('"') ? file.replace(/"/g, '') : file)

                                    // write test script for run the regression test 
                                    addScriptRunner()
                                })
                            } else
                            if(strPack == '' && npm != '') {
                                // This line of code will print "Installing dependencies..." on the console.
                                console.log("Installing dependencies...");
                                const installProcess = exec('npm install'+npm+' --save-dev');
                                //This code is registering a listener to the exit event of installProcess
                                installProcess.on('exit', (code) => { 
                                    //checking if npm install failed or succeeded by checking exit code
                                    if (code !== 0) { 
                                        //if the exit code is not 0, it means the installation has failed. So, print error message and return.
                                        console.error(`${'\x1b[31m'}npm install failed with code ${res}${'\x1b[0m'}`)
                                        return;
                                    }

                                    //If the program reaches here, it means the install process was successful. Print a success message.
                                    console.log(`${'\x1b[32m'}Installation completed successfully!${'\x1b[0m'}`)
                                    
                                    //Print message indicating automation test generation has started..
                                    console.log(`${'\x1b[34m'}Generating automation test..${'\x1b[0m'}`)
                                    
                                    //Call the generator function to generate automation tests.
                                    generator(file.includes('"') ? file.replace(/"/g, '') : file)

                                    // write test script for run the regression test 
                                    addScriptRunner()
                                })
                            } else {
                                //Print message indicating automation test generation has started..
                                console.log(`${'\x1b[34m'}Generating automation test..${'\x1b[0m'}`)
                                
                                //Call the generator function to generate automation tests.
                                generator(file.includes('"') ? file.replace(/"/g, '') : file)

                                // write test script for run the regression test 
                                addScriptRunner()
                            }

                            rl.close()
                        } else {
                            console.log(`${'\x1b[31m'}Please input correct answer, the file must json format!${'\x1b[0m'}`)
                            runGen()
                        }
                    })
                } else {
                    console.log(`${'\x1b[31m'}Please input correct answer!${'\x1b[0m'}`)
                    runGen()
                }
            })
        } else {
            console.log(`${'\x1b[31m'}Please input correct answer!${'\x1b[0m'}`)
            runGen()
        }
    })
}

function withMochawesome(strPack) {
    rl.question('Do you want to install Mochawesome? (y/n) : ', (mochawe) => {
        if(mochawe == 'y' || mochawe == 'Y' || mochawe == 'n' || mochawe == 'N') {
            rl.question('Type your json file to be generate : ', (file) => {
                if(file.includes('.json')) {
                    let npm = ''
                    if(mochawe == 'y' || mochawe == 'Y') {
                        npm += ' mochawesome'
                    }

                    if(strPack != '' && npm != '') {
                        // This line of code will print "Installing dependencies..." on the console.
                        console.log("Installing dependencies...");
                        const installProcess = exec('npm install '+strPack);
                        //This code is registering a listener to the exit event of installProcess
                        installProcess.on('exit', (code) => { 
                            //checking if npm install failed or succeeded by checking exit code
                            if (code !== 0) { 
                                //if the exit code is not 0, it means the installation has failed. So, print error message and return.
                                console.error(`${'\x1b[31m'}npm install failed with code ${res}${'\x1b[0m'}`)
                                return;
                            }

                            const installOption = exec('npm install'+npm+' --save-dev')
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
                                
                                //Call the generator function to generate automation tests.
                                generator(file.includes('"') ? file.replace(/"/g, '') : file)

                                // write test script for run the regression test 
                                addScriptRunner()
                            })
                        })
                    } else
                    if(strPack != '' && npm == '') {
                        // This line of code will print "Installing dependencies..." on the console.
                        console.log("Installing dependencies...");
                        const installProcess = exec('npm install '+strPack);
                        //This code is registering a listener to the exit event of installProcess
                        installProcess.on('exit', (code) => { 
                            //checking if npm install failed or succeeded by checking exit code
                            if (code !== 0) { 
                                //if the exit code is not 0, it means the installation has failed. So, print error message and return.
                                console.error(`${'\x1b[31m'}npm install failed with code ${res}${'\x1b[0m'}`)
                                return;
                            }

                            //If the program reaches here, it means the install process was successful. Print a success message.
                            console.log(`${'\x1b[32m'}Installation completed successfully!${'\x1b[0m'}`)
                            
                            //Print message indicating automation test generation has started..
                            console.log(`${'\x1b[34m'}Generating automation test..${'\x1b[0m'}`)
                            
                            //Call the generator function to generate automation tests.
                            generator(file.includes('"') ? file.replace(/"/g, '') : file)

                            // write test script for run the regression test 
                            addScriptRunner()
                        })
                    } else
                    if(strPack == '' && npm != '') {
                        // This line of code will print "Installing dependencies..." on the console.
                        console.log("Installing dependencies...");
                        const installProcess = exec('npm install'+npm+' --save-dev');
                        //This code is registering a listener to the exit event of installProcess
                        installProcess.on('exit', (code) => { 
                            //checking if npm install failed or succeeded by checking exit code
                            if (code !== 0) { 
                                //if the exit code is not 0, it means the installation has failed. So, print error message and return.
                                console.error(`${'\x1b[31m'}npm install failed with code ${res}${'\x1b[0m'}`)
                                return;
                            }

                            //If the program reaches here, it means the install process was successful. Print a success message.
                            console.log(`${'\x1b[32m'}Installation completed successfully!${'\x1b[0m'}`)
                            
                            //Print message indicating automation test generation has started..
                            console.log(`${'\x1b[34m'}Generating automation test..${'\x1b[0m'}`)
                            
                            //Call the generator function to generate automation tests.
                            generator(file.includes('"') ? file.replace(/"/g, '') : file)

                            // write test script for run the regression test 
                            addScriptRunner()
                        })
                    } else {
                        //Print message indicating automation test generation has started..
                        console.log(`${'\x1b[34m'}Generating automation test..${'\x1b[0m'}`)
                        
                        //Call the generator function to generate automation tests.
                        generator(file.includes('"') ? file.replace(/"/g, '') : file)

                        // write test script for run the regression test 
                        addScriptRunner()
                    }
                    rl.close()
                } else {
                    console.log(`${'\x1b[31m'}Please input correct answer, the file must json format!${'\x1b[0m'}`)
                    runGen()
                }
            })
        } else {
            console.log(`${'\x1b[31m'}Please input correct answer!${'\x1b[0m'}`)
            runGen()
        }
    })
}

function withEslint(strPack) {
    rl.question('Do you want to install ESlint? (y/n) : ', (eslint) => {
        if(eslint == 'y' || eslint == 'Y' || eslint == 'n' || eslint == 'N') {
            rl.question('Type your json file to be generate : ', (file) => {
                if(file.includes('.json')) {
                    let npm = ''
                    if(eslint == 'y' || eslint == 'Y') {
                        npm += ' eslint'
                    }
                    if(strPack != '' && npm != '') {
                        // This line of code will print "Installing dependencies..." on the console.
                        console.log("Installing dependencies...");
                        const installProcess = exec('npm install '+strPack);
                        //This code is registering a listener to the exit event of installProcess
                        installProcess.on('exit', (code) => { 
                            //checking if npm install failed or succeeded by checking exit code
                            if (code !== 0) { 
                                //if the exit code is not 0, it means the installation has failed. So, print error message and return.
                                console.error(`${'\x1b[31m'}npm install failed with code ${res}${'\x1b[0m'}`)
                                return;
                            }

                            const installOption = exec('npm install'+npm+' --save-dev')
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
                                
                                //Call the generator function to generate automation tests.
                                generator(file.includes('"') ? file.replace(/"/g, '') : file)

                                // write test script for run the regression test 
                                addScriptRunner()
                            })
                        })
                    } else
                    if(strPack != '' && npm == '') {
                        // This line of code will print "Installing dependencies..." on the console.
                        console.log("Installing dependencies...");
                        const installProcess = exec('npm install '+strPack);
                        //This code is registering a listener to the exit event of installProcess
                        installProcess.on('exit', (code) => { 
                            //checking if npm install failed or succeeded by checking exit code
                            if (code !== 0) { 
                                //if the exit code is not 0, it means the installation has failed. So, print error message and return.
                                console.error(`${'\x1b[31m'}npm install failed with code ${res}${'\x1b[0m'}`)
                                return;
                            }

                            //If the program reaches here, it means the install process was successful. Print a success message.
                            console.log(`${'\x1b[32m'}Installation completed successfully!${'\x1b[0m'}`)
                            
                            //Print message indicating automation test generation has started..
                            console.log(`${'\x1b[34m'}Generating automation test..${'\x1b[0m'}`)
                            
                            //Call the generator function to generate automation tests.
                            generator(file.includes('"') ? file.replace(/"/g, '') : file)

                            // write test script for run the regression test 
                            addScriptRunner()
                        })
                    } else
                    if(strPack == '' && npm != '') {
                        // This line of code will print "Installing dependencies..." on the console.
                        console.log("Installing dependencies...");
                        const installProcess = exec('npm install'+npm+' --save-dev');
                        //This code is registering a listener to the exit event of installProcess
                        installProcess.on('exit', (code) => { 
                            //checking if npm install failed or succeeded by checking exit code
                            if (code !== 0) { 
                                //if the exit code is not 0, it means the installation has failed. So, print error message and return.
                                console.error(`${'\x1b[31m'}npm install failed with code ${res}${'\x1b[0m'}`)
                                return;
                            }

                            //If the program reaches here, it means the install process was successful. Print a success message.
                            console.log(`${'\x1b[32m'}Installation completed successfully!${'\x1b[0m'}`)
                            
                            //Print message indicating automation test generation has started..
                            console.log(`${'\x1b[34m'}Generating automation test..${'\x1b[0m'}`)
                            
                            //Call the generator function to generate automation tests.
                            generator(file.includes('"') ? file.replace(/"/g, '') : file)

                            // write test script for run the regression test 
                            addScriptRunner()
                        })
                    } else {
                        //Print message indicating automation test generation has started..
                        console.log(`${'\x1b[34m'}Generating automation test..${'\x1b[0m'}`)
                        
                        //Call the generator function to generate automation tests.
                        generator(file.includes('"') ? file.replace(/"/g, '') : file)

                        // write test script for run the regression test 
                        addScriptRunner()
                    }

                    rl.close()
                } else {
                    console.log(`${'\x1b[31m'}Please input correct answer, the file must json format!${'\x1b[0m'}`)
                    runGen()
                }
            })
        } else {
            console.log(`${'\x1b[31m'}Please input correct answer!${'\x1b[0m'}`)
            runGen()
        }
    })
}
function runGen(strPack) {
    rl.question('Type your json file to be generate : ', (file) => {
        if(file.includes('.json')) {
                //Print message indicating automation test generation has started..
                console.log(`${'\x1b[34m'}Generating automation test..${'\x1b[0m'}`)
                
                //Call the generator function to generate automation tests.
                generator(file.includes('"') ? file.replace(/"/g, '') : file)

                // write test script for run the regression test 
                addScriptRunner()

                rl.close()
        } else {
            console.log(`${'\x1b[31m'}Please input correct answer, the file must json format!${'\x1b[0m'}`)
            runGen()
        }
    })
}

exec('npm list --json', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    // Parse the JSON object from stdout, and assign any dependencies to packageList variable
    const packageList = JSON.parse(stdout).dependencies;
    // Set packagesExist variable to list of object keys if packageList is not undefined, otherwise set packagesExist to an empty array
    const packagesExist = packageList !== undefined ? Object.keys(packageList) : [];

    let beInstall = ['chai', 'mocha', 'chai-http', 'chai-json-schema', 'dotenv', 'to-json-schema']
    // let beInstall = ['chai']
    let matchedPack = beInstall.filter(key => !packagesExist.includes(key))
    let strPack = matchedPack.join(' ')

    if (!packagesExist.includes('eslint') && !packagesExist.includes('mochawesome')) {
        runGenAll(strPack)
    } else if (packagesExist.includes('eslint') && !packagesExist.includes('mochawesome')) {
        withMochawesome(strPack)
    } else if (!packagesExist.includes('eslint') && packagesExist.includes('mochawesome')) {
        withEslint(strPack)
    } else {
        runGen(strPack)
    }
})
