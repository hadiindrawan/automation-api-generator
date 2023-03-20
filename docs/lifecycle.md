# Lifecycle of Mocha Framework

After the template file is generated into your local directory, you can follow this lifecycle of Mocha framework:
1. Complete test files to meet your scenario needs --> folder: `/tests/scenario`
2. Configure request in `pages` file (if needed) --> folder: `/tests/pages`
3. Complete JSON-schema file to cover all your defined scenario --> folder: `/tests/schema`
4. Configure runner based on the defined test order --> folder: `runner`
5. Run your test

    You may use this command:
    ```bash
    npm run test
    ```
    Or you can configure new command in `package.json` file