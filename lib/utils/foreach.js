var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @description looping any array
 * @param {Array} array array to be loop
 * @param {Promise} callback ooping item
 * @returns {Promise<void>}
 */
export function asyncForEach(array, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const item of array) {
            yield callback(item, array.indexOf(item), array);
        }
    });
}
