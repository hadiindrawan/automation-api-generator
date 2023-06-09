import fs from 'fs'

async function isFileExisted(path, fileName) {
    const data = fs.readdirSync(path);
    for (let file of data) {
        const curPath = path + '/' + file;
        if (fs.statSync(curPath).isDirectory()) {
            const res = await isFileExisted(curPath, fileName);
            if (res[0]) return [true, res[1]];
        } else if (file === fileName) {
            return [true, curPath];
        }
    }
    return [false, null];
}

export default isFileExisted