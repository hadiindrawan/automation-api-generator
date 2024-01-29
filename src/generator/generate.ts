import fs from 'fs'
import { promisify } from 'util';
import path from 'path'
import { waitFor } from 'utils/wait';
import { toLowerCase } from 'utils/string';
import { log } from 'utils/logs';
import { writeHelper } from 'component/helper.component';
import { writeUtils } from 'component/utils.component';
import { writeRunner } from 'component/runner.component';
import { writeConfigs } from 'component/configs.component';
import { asyncForEach } from 'utils/foreach';
import { JSConfig, babelConfig, prettierIgnoreConfig } from 'template/config';
import { writePages } from 'component/pages.component';
import { writeSchema } from 'component/schema.component';
import { writeData } from 'component/data.component';
import { writeTest } from 'component/tests.component';


const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

interface optionInterface {
    customKey: string[],
    jsonFileQ: string
}

interface writeParamsInterface {
    items: any,
    testPath: string,
    testPathAlias: string,
    pagesPath: string,
    pagesPathAlias: string,
    schemaPath: string,
    schemaPathAlias: string,
    dataPath: string,
    dataPathAlias: string,
    moduleType: string,
    testsListCallback: any
}

// main generator
export const generate = async (option: optionInterface, moduleType: any): Promise<void> => {
    try {
        const optionKeys: string[] = option.customKey.map(key => key.split('-')[0].trimEnd())
        
        const data: string = await readFile(option.jsonFileQ.includes('"') ? option.jsonFileQ.replace(/"/g, '') : option.jsonFileQ, 'utf8');
        const { item: items } = JSON.parse(data);

        const matchedKeys = items.filter((element: any) => {
            return optionKeys.includes(element.name);
        });

        // write helper dir
        await writeHelper(moduleType);
        // write utils dir
        await writeUtils(moduleType);

        // write .example.env file
        const envFilename = '.example.env.dev';
        const envFileContent = 'MAIN=your_api_url';
        await writeFile(envFilename, envFileContent);

        const testPath = 'tests/scenarios';
        const testPathAlias = '@scenario';
        const pagesPath = 'tests/pages';
        const pagesPathAlias = '@page';
        const schemaPath = 'tests/schemas';
        const schemaPathAlias = '@schema';
        const dataPath = 'tests/data';
        const dataPathAlias = '@data';
        const testslist: string[]  = []

        function testsListCallback(test: string) {
            testslist.push(test)
        }

        await loopWrite({
            items: matchedKeys,
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
        })
        await waitFor(500)
        
        await writeRunner(testslist)

        const configList = [
            { filename: '.babelrc', template: babelConfig },
            { filename: '.prettierignore', template: prettierIgnoreConfig },
            { filename: 'jsconfig.json', template: JSConfig },
        ];
        await writeConfigs(configList);
        
        setTimeout(() => {
            log("~ All test cases have generated ~", "blue")
        }, 3000);
    } catch (err) {
        console.error(err);
    }
}

async function loopWrite(params: writeParamsInterface) {
    const {
        items, testPath, testPathAlias, pagesPath, pagesPathAlias, schemaPath, schemaPathAlias, dataPath, dataPathAlias, moduleType, testsListCallback
    } = params;

    await asyncForEach(items, async (element: any) => {
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
        const suiteDataPath = dataPath.replace(/\\/g, "/").split('/').slice(0, 3).join('/')

        if (element.hasOwnProperty('item')) {
            await loopWrite({
                items: element.item,
                testPath: currentTestPath,
                testPathAlias: currentTestPathAlias,
                pagesPath: currentPagesPath,
                pagesPathAlias: currentPagesPathAlias,
                schemaPath: currentSchemaPath,
                schemaPathAlias: currentSchemaPathAlis,
                dataPath: currentDataPath,
                dataPathAlias: currentDataPathAlis,
                moduleType,
                testsListCallback
            })
        } else {
            const configPathAlias = '@util/config.js';
            const loggerPathAlias = '@util/logger.js';
            const helperPathAlias = '@helper/request.helper.js';

            testsListCallback(testPath.replace(/\\/g, "/") + '/' + element.request.method + '_' + toLowerCase(element.name) + '.spec.js')

            await Promise.all([
                writePages({
                    element: element,
                    path: pagesPath,
                    schemaPath: schemaPathAlias,
                    dataPath: dataPathAlias,
                    helperPath: helperPathAlias,
                    moduleType,
                    configPath: configPathAlias,
                    loggerPath: loggerPathAlias,
                }),
                writeSchema({
                    element: element,
                    path: schemaPath,
                    moduleType,
                }),
                writeData({
                    element: element,
                    path: suiteDataPath,
                    moduleType,
                }),
                writeTest({
                    element: element,
                    path: testPath,
                    pagesPath: pagesPathAlias,
                    dataPath: dataPathAlias,
                    moduleType,
                    configPath: configPathAlias,
                })
            ])
        }
    })
}