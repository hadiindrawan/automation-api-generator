import fs from "fs";
import isFileExisted from "../utils/check_dir.js";
import basePath from "../utils/base_path.js";

// Asynchronous function to write data into directory
async function writeHelper(moduleType) {
	// template dir name
	const templateDirRequest = moduleType == "Javascript modules (import/export)" ? "lib/template/jsimport/requestHelper.dot" : "lib/template/commonjs/requestHelper.dot"
	const templateDirGeneral = moduleType == "Javascript modules (import/export)" ? "lib/template/jsimport/generalHelper.dot" : "lib/template/commonjs/generalHelper.dot"
	// create helper directory if it doesn't exists
	const helperDir = "tests/helper";
	fs.mkdirSync(helperDir, { recursive: true });

	// Check if a file named 'request.helper.js' exists in the tests/helper dir
	// If it does not exist then create a new file based on the template file 'requestHelper.dot'
	isFileExisted(helperDir, "request.helper.js")
		.then((data) => {
			if (!data[0]) {
				fs.writeFile(
					"tests/helper/request.helper.js",
					fs.readFileSync(basePath() + templateDirRequest, "utf8"),
					function (err) {
						if (err) throw err;
					}
				)
			}
		})
		.catch((err) => console.log(err));

	// Check if a file named 'general.helper.js' exists in the tests/helper dir
	// If it does not exist then create a new file based on the template file 'generalHelper.dot'
	isFileExisted(helperDir, "general.helper.js")
		.then((data) => {
			if (!data[0]) {
				fs.writeFile(
					"tests/helper/general.helper.js",
					fs.readFileSync(basePath() + templateDirGeneral, "utf8"),
					function (err) {
						if (err) throw err;
					}
				);
			}
		})
		.catch((err) => console.log(err));
}

export default writeHelper;
