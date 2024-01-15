export function toCamelCase(string) {
    const words = string.split(' ');

    const firstWord = words[0].toLowerCase();
    const restOfWords = words.slice(1).map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    return firstWord + restOfWords.join('');
}

export function toLowerCase(string) {
    let str = (string).toLowerCase().replace(/\s/g, '');
    str = str.replace(/\//g, '');
    return str
}