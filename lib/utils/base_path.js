export default function basePath() {
    const env = 'dev'
    return env == 'dev' ? '../' : './node_modules/dot-generator-mocha/'
}

export function basedir() {
    return process.cwd()
}