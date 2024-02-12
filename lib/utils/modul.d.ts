/**
 * @description Check the file is existed or not
 * @param {string} path the path for destination
 * @param {string} fileName filename which want to search
 * @returns {Promise<Array[boolean, string | null]>}
 */
export declare function isFileExisted(path: string, fileName: string): Promise<[boolean, string | null]>;
/**
 * @description Check JS module type
 * @returns {Promise<boolean | string>}
 */
export declare const existModuleType: () => Promise<boolean | string>;
/**
 * @description Rebuild script package
 * @returns {Promise<void>}
 */
export declare const rebuildPackagejson: () => Promise<void>;
