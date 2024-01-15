import fs from 'fs'

async function isFileExisted(path, fileName) {
    const data = fs.readdirSync(path, function (err) { if (err) throw err; });
    for (let file of data) {
        const curPath = path + '/' + file;
        if (file === 'node_modules') {
            continue;
        } else
        if (fs.statSync(curPath, function (err) { if (err) throw err; }).isDirectory()) {
            const res = await isFileExisted(curPath, fileName);
            if (res[0]) return [true, res[1]];
        } else if (file === fileName) {
            return [true, curPath];
        }
    }
    return [false, null];
}

export default isFileExisted