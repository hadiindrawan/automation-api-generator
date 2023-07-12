import fs from 'fs'
import path from 'path'
import asyncForEach from './utils/foreach.js'
import writeTest from './component/tests.js'
import writePages from './component/pages_refactor.js'
import writeData from './component/data.js'
import writeHelper from './component/helper.js'
import writeSchema from './component/schema.js'
import writeUtils from './component/utils.js';

// main generator
async function generate(file, moduleType) {
    fs.readFile(file, async (err, data) => {
        if (err) throw err;
        let items = JSON.parse(data).item;

        // write helper dir
        await writeHelper(moduleType)
        // write utils dir
        await writeUtils(moduleType)

        // write .example.env file
        fs.writeFile('.example.env','MAIN=your_api_url', function (err) { if (err) throw err ; });
        const testPath = 'tests/scenarios';
        const testPathAlias = '@scenario';
        const pagesPath = 'tests/pages';
        const pagesPathAlias = '@page';
        const schemaPath = 'tests/schemas';
        const schemaPathAlias = '@schema';
        const dataPath = 'tests/data';
        const dataPathAlias = '@data';

        await loopWrite(items, testPath, testPathAlias, pagesPath, pagesPathAlias, schemaPath, schemaPathAlias, dataPath, dataPathAlias, moduleType)
    })
}

async function loopWrite(items, testPath, testPathAlias, pagesPath, pagesPathAlias, schemaPath, schemaPathAlias, dataPath, dataPathAlias, moduleType) {
    // console.log(items);
    await asyncForEach(items, async (element) => {
        // write test dir
        const currentTestPath = path.join(testPath, element.name || '')
        const currentTestPathAlias = path.join(testPathAlias, element.name || '')
        fs.mkdirSync(testPath, { recursive: true })
        // write pages dir
        const currentPagesPath = path.join(pagesPath, element.name || '')
        const currentPagesPathAlias = path.join(pagesPathAlias, element.name || '')
        fs.mkdirSync(pagesPath, { recursive: true })
        // write schema dir
        const currentSchemaPath = path.join(schemaPath, element.name || '')
        const currentSchemaPathAlis = path.join(schemaPathAlias, element.name || '')
        fs.mkdirSync(schemaPath, { recursive: true })
        // write data dir
        const currentDataPath = path.join(dataPath, element.name || '')
        const currentDataPathAlis = path.join(dataPathAlias, element.name || '')
        fs.mkdirSync(dataPath, { recursive: true })

        if (element.hasOwnProperty('item')) {
            await loopWrite(element.item, currentTestPath, currentTestPathAlias, currentPagesPath, currentPagesPathAlias, currentSchemaPath, currentSchemaPathAlis, currentDataPath, currentDataPathAlis, moduleType)
        } else {
            // config path
            const configPathAlias = '@util/config.js';
            // helper path
            const helperPathAlias = '@helper/request.helper.js';

            await writeTest(element, testPath, pagesPathAlias, moduleType, configPathAlias)
            await writePages(element, pagesPath, schemaPathAlias, dataPathAlias, helperPathAlias, moduleType, configPathAlias)
            await writeSchema(element, schemaPath, moduleType)
            await writeData(element, dataPath, moduleType)
        }
    })
}

export default generate