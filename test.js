async function processItem(item, basePath) {
    const helperPath = '../../helper/request.helper';
    const mainpagesPath = './main.pages'

    if (item.hasOwnProperty('item')) {
        const testPath = 'tests/scenarios/' + item.name
        const testRelativePath = '../tests/scenarios/' + item.name
        const pagesPath = 'tests/pages/' + item.name
        const pagesPathRelativePath = '../../pages/' + item.name
        const jsonSchemaPath = 'tests/schema/' + item.name
        const jsonSchemaRelativePath = '../../schema/' + item.name
        let runPath = item.hasOwnProperty('item') ? 'runner/' + item.name : 'runner'

        fs.mkdirSync(testPath, { recursive: true })
        fs.mkdirSync(pagesPath, { recursive: true })
        fs.mkdirSync(jsonSchemaPath, { recursive: true })
        fs.mkdirSync(runPath, { recursive: true })
        writeRunner(item, testRelativePath, runPath)

        asyncForEach(item.item, async (data) => {
            if (data.hasOwnProperty('item')) {
                for (const innerItem of data.item) {
                    console.log(innerItem);
                    await processItem(innerItem, 'tests/' + innerItem.name);
                }
            } else {
                writeTest(data, testPath, pagesPathRelativePath)
                writePages(data, pagesPath, jsonSchemaRelativePath, helperPath, mainpagesPath)
                writeJsonSchema(data, jsonSchemaPath)
                await waitFor(10)
            }
        })
    } else {
        const testPath = 'tests/scenarios/'
        const testRelativePath = '../tests/scenarios'
        const pagesPath = 'tests/pages'
        const pagesPathRelativePath = '../pages'
        const jsonSchemaPath = 'tests/schema'
        const jsonSchemaRelativePath = '../schema'
        const runPath = 'runner'

        fs.mkdirSync(testPath, { recursive: true })
        fs.mkdirSync(pagesPath, { recursive: true })
        fs.mkdirSync(jsonSchemaPath, { recursive: true })
        fs.mkdirSync(runPath, { recursive: true })

        writeRunner(item, testRelativePath, runPath)
        writeTest(item, testPath, pagesPathRelativePath)
        writePages(item, pagesPath, jsonSchemaRelativePath, helperPath, mainpagesPath)
        writeJsonSchema(item, jsonSchemaPath)
        await waitFor(10)
    }
}

asyncForEach(items, async (element) => {
    // Recursively process inner items
    const basePath = 'tests';
    await processItem(element, basePath);
    // }
})