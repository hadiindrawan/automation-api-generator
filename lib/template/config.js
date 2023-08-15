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
const runTestsList = {{runner}}

const ignoreTestsList = {{ignorelist}}

function getSpecsList() {
  const runOptArgument = process.argv.indexOf('--specs')
  const runOpt = runOptArgument !== -1 ? process.argv[runOptArgument+1] : 'Regression'

  if (runOpt.includes("/") || runOpt in runTestsList) {
    return runTestsList[runOpt];
  }
  
  if (runOpt.includes(",")) {
    return runOpt.split(",").flatMap(key => runTestsList[key]);
  }
}

module.exports = {
    require: ['@babel/register'],
    jobs: 1,
    package: './package.json',
    reporter: 'spec',
    ignore: ignoreTestsList,
    spec: getSpecsList(),
    'trace-warnings': true,
    ui: 'bdd',
}
`

export const prettier_ignore = 
`**/.git
**/.svn
**/.hg
**.md
**/node_modules
.babelrc
.eslintrc.json
.prettierignore
package-lock.json
package.json
prettier.config.js
`

export const babel_config = 
`{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": 18
        }
      }
    ]
  ],
  "plugins": [
    [
      "module-resolver",
      {
        "root": ["."],
        "alias": {
          "@root": ".",
          "@tests": "./tests",
          "@scenario": "./tests/scenarios",
          "@page": "./tests/pages",
          "@schema": "./tests/schemas",
          "@helper": "./tests/helpers",
          "@data": "./tests/data",
          "@util": "./tests/utils"
        }
      }
    ]
  ]
}
`