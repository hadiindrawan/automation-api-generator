function basePath() {
    const env = 'dev'
    return env == 'dev' ? '../' : './node_modules/dot-generator-mocha/'
}

export default basePath