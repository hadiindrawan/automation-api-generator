/**
 * @param {string} text - some text change to camelcase
 * @returns {string} - camelcase text tranformed
 */
export function toCamelCase(text: string): string {
    const words: string[] = text.split(' ');
    const firstWord: string = words[0].toLowerCase();
    const restOfWords: string[] = words.slice(1).map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    return firstWord + restOfWords.join('');
}
/**
 * @param {string} text - some text change to lowercase
 * @returns {string} - lowercase text tranformed
 */
export function toLowerCase(text: string): string {
    let str: string = (text).toLowerCase().replace(/\s/g, '');
    str = str.replace(/\//g, '');
    return str;
}