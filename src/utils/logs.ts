/**
 * @param {string} text - some text to console log
 * @param {any} color - color 
 */
export function log(text: string, color: any) {
    const colorList = {
        red: `${'\x1b[31m'}${text}${'\x1b[0m'}`,
        green: `${'\x1b[32m'}${text}${'\x1b[0m'}`,
        yellow: `${'\x1b[33m'}${text}${'\x1b[0m'}`,
        blue: `${'\x1b[34m'}${text}${'\x1b[0m'}`,
    };
    const key: keyof typeof colorList = color;

    return console.log(colorList[key]);
}