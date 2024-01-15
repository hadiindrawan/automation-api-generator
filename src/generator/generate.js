import fs from 'fs'
import { promisify } from 'util';
import path from 'path'
import asyncForEach from './utils/foreach.js'
import writeTest from './component/tests.js'
import writePages from './component/pages.js'
import writeData from './component/data.js'
import writeHelper from './component/helper.js'
import writeSchema from './component/schema.js'
import writeUtils from './component/utils.js';
import waitFor from './utils/wait.js';
import writeRunner from './component/runner.js';
import writeConfigs from './component/configs.js';
import { toLowerCase } from './utils/string.js';
import { log } from './utils/logs.js';
import { babel_config, prettier_ignore } from './template/config.js';


const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
// main generator
async function generate(option, moduleType) {
    try {
        const optionKeys = option.customKey.map(key => key.split('-')[0].trimEnd())
        
        const data = await readFile(option.jsonFileQ.includes('"') ? option.jsonFileQ.replace(/"/g, '') : option.jsonFileQ);
        const { item: items } = JSON.parse(data);

        const matchedKeys = items.filter((element) => {
            return optionKeys.includes(element.name);
        });

        // write helper dir
        await writeHelper(moduleType);
        // write utils dir
        await writeUtils(moduleType);

        // write .example.env file
        await writeFile('.example.env.dev', 'MAIN=your_api_url');

        const testPath = 'tests/scenarios';
        const testPathAlias = '@scenario';
        const pagesPath = 'tests/pages';
        const pagesPathAlias = '@page';
        const schemaPath = 'tests/schemas';
        const schemaPathAlias = '@schema';
        const dataPath = 'tests/data';
        const dataPathAlias = '@data';
        let testslist = []

        function testsListCallback(test) {
            testslist.push(test)
        }

        await loopWrite(
            matchedKeys,
            testPath,
            testPathAlias,
            pagesPath,
            pagesPathAlias,
            schemaPath,
            schemaPathAlias,
            dataPath,
            dataPathAlias,
            moduleType, 
            testsListCallback
        )
        await waitFor(500)
        
        await writeRunner(testslist)

        await writeConfigs([{ filename: '.babelrc', template: babel_config }, { filename: '.prettierignore', template: prettier_ignore }])
        
        setTimeout(() => {
            log("~ All test cases have generated ~", "blue")
        }, 3000);
    } catch (err) {
        console.error(err);
    }
}

async function loopWrite(items, testPath, testPathAlias, pagesPath, pagesPathAlias, schemaPath, schemaPathAlias, dataPath, dataPathAlias, moduleType, testsListCallback) {
    await asyncForEach(items, async (element) => {
        // write test dir
        const currentTestPath = path.join(testPath, element.name || '')
        const currentTestPathAlias = path.join(testPathAlias, element.name || '')
        fs.mkdirSync(testPath, { recursive: true }, function (err) { if (err) throw err; })
        // write pages dir
        const currentPagesPath = path.join(pagesPath, element.name || '')
        const currentPagesPathAlias = path.join(pagesPathAlias, element.name || '')
        fs.mkdirSync(pagesPath, { recursive: true }, function (err) { if (err) throw err; })
        // write schema dir
        const currentSchemaPath = path.join(schemaPath, element.name || '')
        const currentSchemaPathAlis = path.join(schemaPathAlias, element.name || '')
        fs.mkdirSync(schemaPath, { recursive: true }, function (err) { if (err) throw err; })
        // write data dir
        const currentDataPath = path.join(dataPath, element.name || '')
        const currentDataPathAlis = path.join(dataPathAlias, element.name || '')
        const suiteDataPath = dataPath.replace(/\\/g, "/").split('/').slice(0, 3).join('/')

        if (element.hasOwnProperty('item')) {
            await loopWrite(element.item, currentTestPath, currentTestPathAlias, currentPagesPath, currentPagesPathAlias, currentSchemaPath, currentSchemaPathAlis, currentDataPath, currentDataPathAlis, moduleType, testsListCallback)
        } else {
            const configPathAlias = '@util/config.js';
            const helperPathAlias = '@helper/request.helper.js';

            testsListCallback(testPath.replace(/\\/g, "/") + '/' + element.request.method + '_' + toLowerCase(element.name) + '.spec.js')

            await Promise.all([
                writePages(element, pagesPath, schemaPathAlias, dataPathAlias, helperPathAlias, moduleType, configPathAlias),
                writeSchema(element, schemaPath, moduleType),
                writeData(element, suiteDataPath, moduleType),
                writeTest(element, testPath, pagesPathAlias, dataPathAlias, moduleType, configPathAlias)
            ])
        }
    })
}

export default generate