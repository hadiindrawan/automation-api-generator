function basePath() {
    const env = 'prod'
    if(env == 'dev') {
        return ''
    } else {
        return './node_modules/dot-generator-testing/'
    }
}

export default basePath