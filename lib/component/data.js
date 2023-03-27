import fs from "fs";

// This is an asynchronous function called writeData.

async function writeData(moduleType) {
    // Here, a constant variable dataDir is declared and assigned to the string 'tests/data/file'.

    const dataDir = "tests/data/file";

    // The method mkdirSync of the filesystem module (fs) is called with two parameters:
    // dataDir and { recursive: true }.
    // The former specifies the directory path to be created, and the latter enables
    // recursive directory creation such that any non-existent parent directories along
    // the specified path are also created.

    fs.mkdirSync(dataDir, { recursive: true });
}

export default writeData
