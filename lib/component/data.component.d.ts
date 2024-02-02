interface dataComponentInterface {
    element: any;
    path: string;
    moduleType?: string;
}
/**
 * @description asynchronous function to write data into directory
 * @param {dataComponentInterface} writeDataParams included element json, path and module type
 * @returns {Promise<void>}
 */
export declare const writeData: (writeDataParams: dataComponentInterface) => Promise<void>;
export {};
