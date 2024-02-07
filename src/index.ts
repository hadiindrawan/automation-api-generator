#!/usr/bin/env node

import { PogenCommand } from "command/pogen.command"

const argument = process.argv[process.argv.length - 1];
const pogenCommand = new PogenCommand(argument);

if (argument === 'generate' || argument === '' || argument.includes('/.bin/generate') || argument.includes('/po-gen/lib') ) {
    console.log('Initiating automation generation');
    pogenCommand.automation();
} else if (argument === 'env-generate') {
    console.log('Initiating environment generation');
    pogenCommand.environment();
} else {
    console.log(`Unknown argument: ${argument}`);
}
