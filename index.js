#!/usr/bin/env node
const { exec } = require("child_process")
const generator = require('./src/generate.js')

// This line of code will print "Installing dependencies..." on the console.
console.log("Installing dependencies...");


// Executing an npm command to install some dependencies
const installProcess = exec('npm install chai mocha chai-http chai-json-schema dotenv to-json-schema');


//This code is registering a listener to the exit event of installProcess
installProcess.on('exit', (code) => { 
    //checking if npm install failed or succeeded by checking exit code
    if (code !== 0) { 
        //if the exit code is not 0, it means the installation has failed. So, print error message and return.
        console.error(`npm install failed with code ${code}`)
        return;
    }
    //If the program reaches here, it means the install process was successful. Print a success message.
    console.log('Installation completed successfully')
    
    //Print message indicating automation test generation has started..
    console.log('Generating automation test..')
    
    //Call the generator function to generate automation tests.
    generator()
})
