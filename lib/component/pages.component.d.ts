interface pagesComponentInterface {
    element: any;
    path: string;
    schemaPath: string;
    dataPath: string;
    helperPath: string;
    moduleType: string;
    configPath: string;
    loggerPath: string;
}
/**
 * @description asynchronous function to write pages into directory
 * @param {pagesComponentInterface} writePagesParams included element json and all needed path
 * @returns {Promise<void>}
 */
export declare const writePages: (writePagesParams: pagesComponentInterface) => Promise<void>;
export {};
