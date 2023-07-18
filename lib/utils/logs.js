export function log(text, color) {
    const colorList = {
        red: `${'\x1b[31m'}${text}${'\x1b[0m'}`,
        green: `${'\x1b[32m'}${text}${'\x1b[0m'}`,
        yellow: `${'\x1b[33m'}${text}${'\x1b[0m'}`,
        blue: `${'\x1b[34m'}${text}${'\x1b[0m'}`,
    }
    return console.log(colorList[color]);
}