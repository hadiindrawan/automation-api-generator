/**
 * @description base path in debug or production
 * @returns {string}
 */
export default function basePath() {
    const env = 'debug';
    return env == 'debug' ? '../' : './node_modules/@dot.indonesia/po-gen/';
}
/**
 * @description base dir
 * @returns {string}
 */
export function basedir() {
    return process.cwd();
}
