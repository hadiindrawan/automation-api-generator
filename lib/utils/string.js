/**
 * @description convert string to camelcase
 * @param {string} text some text change to camelcase
 * @returns {string} camelcase text tranformed
 */
export function toCamelCase(text) {
    const words = text.split(' ');
    const firstWord = words[0].toLowerCase();
    const restOfWords = words.slice(1).map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    return firstWord + restOfWords.join('');
}
/**
 * @description convert string to lowercase
 * @param {string} text some text change to lowercase
 * @returns {string} lowercase text tranformed
 */
export function toLowerCase(text) {
    let str = (text).toLowerCase().replace(/\s/g, '');
    str = str.replace(/\//g, '');
    return str;
}
