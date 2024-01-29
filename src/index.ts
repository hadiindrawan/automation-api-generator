#!/usr/bin/env node

import { PogenCommand } from "command/pogen.command"

const argument = process.argv[process.argv.length - 1];
const pogenCommand = new PogenCommand(argument);

switch (argument) {
    case 'generate':
    case '':
        console.log('Initiating automation generation');
        pogenCommand.automation();
        break;
    case 'env-generate':
        console.log('Initiating environment generation');
        pogenCommand.environment();
        break;
    case 'curl':
        console.log('Initiating curl generation');
        pogenCommand.curl();
        break;
    default:
        console.log(`Unknown argument: ${argument}`);
}