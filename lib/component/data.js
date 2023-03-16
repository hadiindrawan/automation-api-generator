const fs = require('fs');

// This is an asynchronous function called writeData.

async function writeData() {

    // Here, a constant variable dataDir is declared and assigned to the string 'tests/data'.

    const dataDir = 'tests/data';

    // The method mkdirSync of the filesystem module (fs) is called with two parameters: 
    // dataDir and { recursive: true }.
    // The former specifies the directory path to be created, and the latter enables
    // recursive directory creation such that any non-existent parent directories along 
    // the specified path are also created.

    fs.mkdirSync(dataDir, { recursive: true });
}


module.exports = writeData