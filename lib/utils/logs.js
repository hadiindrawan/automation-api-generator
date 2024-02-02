/**
 * @description coloring console log
 * @param {string} text - some text to console log
 * @param {any} color - color
 * @returns {void}
 */
export function log(text, color) {
    const colorList = {
        red: `${'\x1b[31m'}${text}${'\x1b[0m'}`,
        green: `${'\x1b[32m'}${text}${'\x1b[0m'}`,
        yellow: `${'\x1b[33m'}${text}${'\x1b[0m'}`,
        blue: `${'\x1b[34m'}${text}${'\x1b[0m'}`,
    };
    const key = color;
    return console.log(colorList[key]);
}
