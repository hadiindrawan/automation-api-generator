import fs from "fs"
import waitFor from "../utils/wait.js"
import isFileExisted from "../utils/check_dir.js"
import basePath from "../utils/base_path.js"

// Json schema file generator
async function writeSchema(element, path, moduleType) {
    // template dir name
    const templateDir = moduleType == "Javascript modules (import/export)" ? "lib/template/jsimport/schema.dot" : "lib/template/commonjs/schema.dot"
    // The following code creates a variable called 'name' and assigns it the value obtained from the 'name' property of the 'element' object, which is then converted to lowercase and all spaces in it are removed.
    let name = (element.name).toLowerCase().replace(/\s/g, '');
    name = name.replace(/\//g, '');
    // A variable called 'method' is created and assigned the value obtained from the 'method' property of the 'element.request' object.
    let method
    if (element.request.hasOwnProperty('method')) {
        method = element.request.method;
    }
    // check if file exists
    if (element.request.hasOwnProperty('url')) {
        try {
            const [fileExists] = await isFileExisted(path, method + '_' + name + '.schema.js');
            if (!fileExists) {
                // create file test
                fs.writeFileSync(path + '/' + method + '_' + name + '.schema.js',
                    fs.readFileSync(basePath() + templateDir, 'utf8'), 
                    function (err) { if (err) throw err; 
                });
                await waitFor(500)
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default writeSchema