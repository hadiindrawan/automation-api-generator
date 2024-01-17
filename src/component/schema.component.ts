import fs from "fs"
import { isFileExisted } from "utils/modul.js";
import basePath from "utils/path";
import { waitFor } from "utils/wait";

interface schemaComponentInterface {
    element:any,
    path: string,
    moduleType: string
}

// Json schema file generator
export const writeSchema = async (params: schemaComponentInterface) => {
    const {
        element, path, moduleType
    } = params;
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
                    'utf8'
                );
                await waitFor(500)
            }
        } catch (err) {
            console.log(err);
        }
    }
}