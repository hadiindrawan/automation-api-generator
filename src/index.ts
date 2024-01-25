#!/usr/bin/env node

import { PogenCommand } from "command/pogen.command"

const argument = process.argv[process.argv.length - 1];
if (argument == 'generate' || argument == '') {
    console.log('Initiating automation generation')
    /**
     * Run generate command
     * @param argument - custom argument on script
     */
    new PogenCommand(argument).automation()
} 

if (argument == 'env-generate') {
    console.log('Initiating environment generation')
    /**
     * Run generate command
     * @param argument - custom argument on script
     */
    new PogenCommand(argument).environment()
}