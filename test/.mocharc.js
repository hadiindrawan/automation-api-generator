const runTestsList = {
  Auth: [
    "tests/scenarios/Auth/POST_login.spec.js",
    "tests/scenarios/Auth/POST_logout.spec.js"
  ],
  User: [
    "tests/scenarios/User/GET_getuserprofile.spec.js",
    "tests/scenarios/User/POST_adduser.spec.js",
    "tests/scenarios/User/PATCH_updateuser.spec.js",
    "tests/scenarios/User/DELETE_deleteuser.spec.js"
  ],
  Contact: [
    "tests/scenarios/Contact/POST_addcontact.spec.js",
    "tests/scenarios/Contact/GET_getcontactlist.spec.js",
    "tests/scenarios/Contact/GET_getcontact.spec.js",
    "tests/scenarios/Contact/PUT_updatecontact.spec.js",
    "tests/scenarios/Contact/DELETE_deletecontact.spec.js"
  ],
  Regression: "tests/scenarios/**/*.spec.js"
};

const ignoreTestsList = [
  // write your ignore tests here
];

function getSpecsList() {
  const runOptArgument = process.argv.indexOf("--specs");
  const runOpt =
    runOptArgument !== -1 ? process.argv[runOptArgument + 1] : "Regression";

  if (runOpt.includes("/") || runOpt in runTestsList) {
    return runTestsList[runOpt];
  }

  if (runOpt.includes(",")) {
    return runOpt.split(",").flatMap((key) => runTestsList[key]);
  }
}

module.exports = {
  require: ["@babel/register"],
  jobs: 1,
  package: "./package.json",
  reporter: "spec",
  ignore: ignoreTestsList,
  spec: getSpecsList(),
  "trace-warnings": true,
  ui: "bdd"
};
