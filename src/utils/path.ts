/**
 * @description base path in debug or production
 * @returns {string}
 */
export default function basePath(): string {
    const isProd = true
    return isProd ? './node_modules/@dot.indonesia/po-gen/' : '../'
}
/**
 * @description base dir
 * @returns {string}
 */
export function basedir(): string {
    return process.cwd()
}