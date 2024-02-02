var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import { waitFor } from '../utils/wait.js';
import { toLowerCase } from '../utils/string.js';
import { log } from '../utils/logs.js';
import { writeHelper } from '../component/helper.component.js';
import { writeUtils } from '../component/utils.component.js';
import { writeRunner } from '../component/runner.component.js';
import { writeConfigs } from '../component/configs.component.js';
import { asyncForEach } from '../utils/foreach.js';
import { JSConfig, babelConfig, prettierIgnoreConfig } from '../template/config.js';
import { writePages } from '../component/pages.component.js';
import { writeSchema } from '../component/schema.component.js';
import { writeData } from '../component/data.component.js';
import { writeTest } from '../component/tests.component.js';
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
/**
 * @description main automation generator
 * @param {optionInterface} option included custom key of collection and file (.json)
 * @param {any} moduleType module type selected
 * @returns {Promise<void>}
 */
export const generate = (option, moduleType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const optionKeys = option.customKey.map(key => key.split('-')[0].trimEnd());
        const data = yield readFile(option.jsonFileQ.includes('"') ? option.jsonFileQ.replace(/"/g, '') : option.jsonFileQ, 'utf8');
        const { item: items } = JSON.parse(data);
        const matchedKeys = items.filter((element) => {
            return optionKeys.includes(element.name);
        });
        // write helper dir
        yield writeHelper(moduleType);
        // write utils dir
        yield writeUtils(moduleType);
        // write .example.env file
        const envFilename = '.example.env.dev';
        const envFileContent = 'MAIN=your_api_url';
        yield writeFile(envFilename, envFileContent);
        const testPath = 'tests/scenarios';
        const testPathAlias = '@scenario';
        const pagesPath = 'tests/pages';
        const pagesPathAlias = '@page';
        const schemaPath = 'tests/schemas';
        const schemaPathAlias = '@schema';
        const dataPath = 'tests/data';
        const dataPathAlias = '@data';
        const testslist = [];
        function testsListCallback(test) {
            testslist.push(test);
        }
        yield loopWrite({
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
        });
        yield waitFor(500);
        yield writeRunner(testslist);
        const configList = [
            { filename: '.babelrc', template: babelConfig },
            { filename: '.prettierignore', template: prettierIgnoreConfig },
            { filename: 'jsconfig.json', template: JSConfig },
        ];
        yield writeConfigs(configList);
        setTimeout(() => {
            log("~ All test cases have generated ~", "blue");
        }, 3000);
    }
    catch (err) {
        console.error(err);
    }
});
/**
 * @description mapping json collection
 * @param {writeParamsInterface} writeFileParams included item and all base path
 * @returns {Promise<void>}
 */
function loopWrite(writeFileParams) {
    return __awaiter(this, void 0, void 0, function* () {
        const { items, testPath, testPathAlias, pagesPath, pagesPathAlias, schemaPath, schemaPathAlias, dataPath, dataPathAlias, moduleType, testsListCallback } = writeFileParams;
        yield asyncForEach(items, (element) => __awaiter(this, void 0, void 0, function* () {
            // write test dir
            const currentTestPath = path.join(testPath, element.name || '');
            const currentTestPathAlias = path.join(testPathAlias, element.name || '');
            fs.mkdirSync(testPath, { recursive: true });
            // write pages dir
            const currentPagesPath = path.join(pagesPath, element.name || '');
            const currentPagesPathAlias = path.join(pagesPathAlias, element.name || '');
            fs.mkdirSync(pagesPath, { recursive: true });
            // write schema dir
            const currentSchemaPath = path.join(schemaPath, element.name || '');
            const currentSchemaPathAlis = path.join(schemaPathAlias, element.name || '');
            fs.mkdirSync(schemaPath, { recursive: true });
            // write data dir
            const currentDataPath = path.join(dataPath, element.name || '');
            const currentDataPathAlis = path.join(dataPathAlias, element.name || '');
            const suiteDataPath = dataPath.replace(/\\/g, "/").split('/').slice(0, 3).join('/');
            if (element.hasOwnProperty('item')) {
                yield loopWrite({
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
                });
            }
            else {
                const configPathAlias = '@util/config.js';
                const loggerPathAlias = '@util/logger.js';
                const helperPathAlias = '@helper/request.helper.js';
                testsListCallback(testPath.replace(/\\/g, "/") + '/' + element.request.method + '_' + toLowerCase(element.name) + '.spec.js');
                yield Promise.all([
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
                ]);
            }
        }));
    });
}
