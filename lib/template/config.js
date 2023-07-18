export const default_eslint =
`{
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "no-undef": 0,
        "no-prototype-builtins": 0
    }
}`

export const default_mocharc = 
`
const runOptArgument = process.argv.indexOf('--specs')
const runOpt = runOptArgument !== -1 ? process.argv[runOptArgument+1] : 'default'

const runTestsList = {{runner}}

const ignoreTestsList = [
    // write your ignore tests here
]

function run(run_option) {
    if (run_option.includes('/')) {
        return run_option
    }
    return runTestsList[run_option]
}

module.exports = {
    require: ['@babel/register'],
    jobs: 1,
    package: './package.json',
    reporter: 'spec',
    ignore: ignoreTestsList,
    spec: run(runOpt),
    'trace-warnings': true,
    ui: 'bdd',
}
`