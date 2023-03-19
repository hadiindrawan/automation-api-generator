import fs from "fs"
import isFileExisted from "../utils/check_dir.js"
import basePath from "../utils/base_path.js"

// Json schema file generator
async function writeJsonSchema(element, jsonSchemaPath) {
    let name = (element.name).toLowerCase().replace(/\s/g, '');
    name = name.replace(/\//g, '');
    let method = element.request.method
    
    // check if file exists
    await isFileExisted('tests', method + '_' +name + '.json', function(data) {
        if (!data[0] && data[1] == jsonSchemaPath) {
            // create file test
            fs.writeFile(jsonSchemaPath + '/' + method + '_' +name + '.json',
                fs.readFileSync(basePath() + 'lib/template/json_responses.dot', 'utf8'), function (err) { if (err) throw err; });
        }
    })
}

export default writeJsonSchema