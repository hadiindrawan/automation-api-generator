#!/usr/bin/env node
/* eslint-disable no-unused-vars */
const { exec } = require("child_process")
const generator = require('./generate.js')

console.log("Installing dependencies...")

const installProcess = exec('npm install chai mocha chai-http chai-json-schema dotenv to-json-schema')
installProcess.on('exit', (code) => {
    if (code !== 0) {
        console.error(`npm install failed with code ${code}`)
        return;
    }

    console.log('Installation completed successfully')
    console.log('Generating automation test..')
    generator()
})