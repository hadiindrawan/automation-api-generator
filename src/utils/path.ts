export default function basePath() {
    const env = 'dev'
    return env == 'dev' ? '../' : './node_modules/@dot.indonesia/po-gen/'
}

export function basedir() {
    return process.cwd()
}