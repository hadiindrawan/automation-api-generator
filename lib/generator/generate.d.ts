interface optionInterface {
    customKey: string[];
    jsonFileQ: string;
}
/**
 * @description main automation generator
 * @param {optionInterface} option included custom key of collection and file (.json)
 * @param {any} moduleType module type selected
 * @returns {Promise<void>}
 */
export declare const generate: (option: optionInterface, moduleType: any) => Promise<void>;
export {};
