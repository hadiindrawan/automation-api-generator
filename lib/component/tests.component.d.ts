interface testComponentInterface {
    element: any;
    path: string;
    pagesPath: string;
    dataPath: string;
    moduleType: string;
    configPath: string;
}
/**
 * @description asynchronous function to write tests into directory
 * @param {testComponentInterface} writeTestParams included element json and all needed path
 * @returns {Promise<void>}
 */
export declare const writeTest: (writeTestParams: testComponentInterface) => Promise<void>;
export {};
