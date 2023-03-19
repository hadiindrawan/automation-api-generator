import fs from 'fs'
import asyncForEach from './utils/foreach.js'
import waitFor from './utils/wait.js'
import writeTest from './component/tests.js'
import writePages from './component/pages.js'
import writeData from './component/data.js'
import writeRunner from './component/runner.js'
import writeHelper from './component/helper.js'
import writeJsonSchema from './component/json_schema.js'

// main generator
async function generate(file) {
    fs.readFile(file, (err, data) => {
        if (err) throw err;
        let items = JSON.parse(data).item;

        // write data dir
        writeData()
        // write helper dir
        writeHelper()

        // write .example.env file
        fs.writeFile('.example.env','DEV_MAIN=your_api_url', function (err) { if (err) throw err ; });
        
        asyncForEach(items, async (element) => {
            // console.log(element);
            if (element.hasOwnProperty('item')) {
                // helper path
                const helperPath = '../../helper/request.helper';
                // write test dir
                const testPath = 'tests/scenarios/' + element.name;
                const testRelativePath = '../tests/scenarios/' + element.name;
                fs.mkdirSync(testPath, { recursive: true })
                // main pages path
                const mainpagesPath = '../main.pages';
                // write pages dir
                const pagesPath = 'tests/pages/' + element.name;
                const pagesPathRelativePath = '../../pages/' + element.name;
                fs.mkdirSync(pagesPath, { recursive: true })
                // write json_schema dir
                const jsonSchemaPath = 'tests/schema/' + element.name;
                const jsonSchemaRelativePath = '../../schema/' + element.name;
                fs.mkdirSync(jsonSchemaPath, { recursive: true })
                // write runner dir
                const runPath = 'runner'
                fs.mkdirSync(runPath, { recursive: true })
                writeRunner(element, testRelativePath, runPath)

                asyncForEach(element.item, async (second) => {
                    if (second.hasOwnProperty('item') == false) {
                        writeTest(second, testPath, pagesPathRelativePath)
                        writePages(second, pagesPath, jsonSchemaRelativePath, helperPath, mainpagesPath)
                        writeJsonSchema(second, jsonSchemaPath)
                        await waitFor(10)
                    } else {
                        asyncForEach(second.item, async (third) => {
                            const third_test = testPath + '/' + second.name;
                            const third_testRe = '../' + testRelativePath + '/' + second.name;
                            const third_page = pagesPath + '/' + second.name;
                            const third_pageRe = '../' + pagesPathRelativePath + '/' + second.name;
                            const third_sch = jsonSchemaPath + '/' + second.name;
                            const third_schRe = '../' + jsonSchemaRelativePath + '/' + second.name;
                            const third_helpRe = '../' + helperPath;
                            const third_mainRe = '../' + mainpagesPath;
                            const third_runPath = runPath + '/' + element.name;

                            fs.mkdirSync(third_test + '/', { recursive: true })
                            fs.mkdirSync(third_page + '/', { recursive: true })
                            fs.mkdirSync(third_sch + '/', { recursive: true })
                            fs.mkdirSync(third_runPath, { recursive: true })
                            writeRunner(second, third_testRe, third_runPath)
                            if (third.hasOwnProperty('item') == false) {
                                writeTest(third, third_test, third_pageRe)
                                writePages(third, third_page, third_schRe, third_helpRe, third_mainRe)
                                writeJsonSchema(third, third_sch)
                                await waitFor(10)
                            } else {
                                asyncForEach(third.item, async (fourth) => {
                                    const fourth_test = third_test + '/' + third.name;
                                    const fourth_testRe = '../' + third_testRe + '/' + third.name;
                                    const fourth_page = third_page + '/' + third.name;
                                    const fourth_pageRe = '../' + third_pageRe + '/' + third.name;
                                    const fourth_sch = third_sch + '/' + third.name;
                                    const fourth_schRe = '../' + third_schRe + '/' + third.name;
                                    const fourth_helpRe = '../' + third_helpRe;
                                    const fourth_mainRe = '../' + third_mainRe;
                                    const fourth_runPath = third_runPath + '/' + second.name;

                                    fs.mkdirSync(fourth_test + '/', { recursive: true })
                                    fs.mkdirSync(fourth_page + '/', { recursive: true })
                                    fs.mkdirSync(fourth_sch + '/', { recursive: true })
                                    fs.mkdirSync(fourth_runPath, { recursive: true })
                                    writeRunner(third, fourth_testRe, fourth_runPath)
                                    if (fourth.hasOwnProperty('item') == false) {
                                        writeTest(fourth, fourth_test, fourth_pageRe)
                                        writePages(fourth, fourth_page, fourth_schRe, fourth_helpRe, fourth_mainRe)
                                        writeJsonSchema(fourth, fourth_sch)
                                        await waitFor(10)
                                    } else {
                                        asyncForEach(fourth.item, async (fifth) => {
                                            const fifth_test = fourth_test + '/' + fourth.name;
                                            const fifth_testRe = '../' + fourth_testRe + '/' + fourth.name;
                                            const fifth_page = fourth_page + '/' + fourth.name;
                                            const fifth_pageRe = '../' + fourth_pageRe + '/' + fourth.name;
                                            const fifth_sch = fourth_sch + '/' + fourth.name;
                                            const fifth_schRe = '../' + fourth_schRe + '/' + fourth.name;
                                            const fifth_helpRe = '../' + fourth_helpRe;
                                            const fifth_mainRe = '../' + fourth_mainRe;
                                            const fifth_runPath = fourth_runPath + '/' + third.name;

                                            fs.mkdirSync(fifth_test + '/', { recursive: true })
                                            fs.mkdirSync(fifth_page + '/', { recursive: true })
                                            fs.mkdirSync(fifth_sch + '/', { recursive: true })
                                            fs.mkdirSync(fifth_runPath, { recursive: true })
                                            writeRunner(fourth, fifth_testRe, fifth_runPath)
                                            await waitFor(50)
                                            if (fifth.hasOwnProperty('item') == false) {
                                                writeTest(fifth, fifth_test, fifth_pageRe)
                                                writePages(fifth, fifth_page, fifth_schRe, fifth_helpRe, fifth_mainRe)
                                                writeJsonSchema(fifth, fifth_sch)
                                                await waitFor(10)
                                            } else {
                                                asyncForEach(fifth.item, async (sixth) => {
                                                    const sixth_test = fifth_test + '/' + fifth.name;
                                                    const sixth_testRe = '../' + fifth_testRe + '/' + fifth.name;
                                                    const sixth_page = fifth_page + '/' + fifth.name;
                                                    const sixth_pageRe = '../' + fifth_pageRe + '/' + fifth.name;
                                                    const sixth_sch = fifth_sch + '/' + fifth.name;
                                                    const sixth_schRe = '../' + fifth_schRe + '/' + fifth.name;
                                                    const sixth_helpRe = '../' + fifth_helpRe;
                                                    const sixth_mainRe = '../' + fifth_mainRe;
                                                    const sixth_runPath = fifth_runPath + '/' + third.name;

                                                    fs.mkdirSync(sixth_test + '/', { recursive: true })
                                                    fs.mkdirSync(sixth_page + '/', { recursive: true })
                                                    fs.mkdirSync(sixth_sch + '/', { recursive: true })
                                                    fs.mkdirSync(sixth_runPath, { recursive: true })
                                                    writeRunner(fifth, sixth_testRe, sixth_runPath)
                                                    await waitFor(50)
                                                    if (sixth.hasOwnProperty('item') == false) {
                                                        writeTest(sixth, sixth_test, sixth_pageRe)
                                                        writePages(sixth, sixth_page, sixth_schRe, sixth_helpRe, sixth_mainRe)
                                                        writeJsonSchema(sixth, sixth_sch)
                                                        await waitFor(10)
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            } else {
                // helper path
                const helperPath = '../helper/request.helper';
                // write test dir
                const testPath = 'tests/scenarios';
                const testRelativePath = '../tests/scenarios';
                fs.mkdirSync(testPath, { recursive: true })
                // main pages path
                const mainpagesPath = './main.pages';
                // write pages dir
                const pagesPath = 'tests/pages';
                const pagesPathRelativePath = '../pages';
                fs.mkdirSync(pagesPath, { recursive: true })
                // write json_schema dir
                const jsonSchemaPath = 'tests/schema';
                const jsonSchemaRelativePath = '../schema';
                fs.mkdirSync(jsonSchemaPath, { recursive: true })
                // write runner dir
                const runPath = 'runner'
                fs.mkdirSync(runPath, { recursive: true })

                writeRunner(element, testRelativePath, runPath)
                writeTest(element, testPath, pagesPathRelativePath)
                writePages(element, pagesPath, jsonSchemaRelativePath, helperPath, mainpagesPath)
                writeJsonSchema(element, jsonSchemaPath)
                await waitFor(10)
            }
        });
    })
}

export default generate