interface schemaComponentInterface {
    element: any;
    path: string;
    moduleType: string;
}
/**
 * @description asynchronous function to write schema into directory
 * @param {schemaComponentInterface} writeSchemaParams included element json, path, and module type
 * @returns {Promise<void>}
 */
export declare const writeSchema: (writeSchemaParams: schemaComponentInterface) => Promise<void>;
export {};
