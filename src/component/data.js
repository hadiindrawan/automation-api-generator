const fs = require('fs');

async function writeData() {
    // write data dir
    const dataDir = 'tests/data';
    fs.mkdirSync(dataDir, { recursive: true })
}

module.exports = writeData