import fs from "fs"
import isFileExisted from "../utils/check_dir.js"
import basePath from "../utils/base_path.js"

// Json schema file generator
async function writeJsonSchema(element, jsonSchemaPath) {
    // The following code creates a variable called 'name' and assigns it the value obtained from the 'name' property of the 'element' object, which is then converted to lowercase and all spaces in it are removed.
    let name = (element.name).toLowerCase().replace(/\s/g, '');
    name = name.replace(/\//g, '');
    // A variable called 'method' is created and assigned the value obtained from the 'method' property of the 'element.request' object.
    let method = element.request.method;
    // check if file exists
    isFileExisted(jsonSchemaPath, method + '_' + name + '.schema.js')
        .then((data) => {
            if (!data[0]) {
                // create file test
                fs.writeFile(jsonSchemaPath + '/' + method + '_' +name + '.schema.js',
                    fs.readFileSync(basePath() + 'lib/template/json_responses.dot', 'utf8'), function (err) { if (err) throw err; });
            }
        })
        .catch((err) => console.log(err));
}

export default writeJsonSchema