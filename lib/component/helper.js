import fs from 'fs'
import { promisify } from 'util';
import isFileExisted from "../utils/check_dir.js";
import basePath from "../utils/base_path.js";
import waitFor from '../utils/wait.js';

const writeFile = promisify(fs.writeFile);
// Asynchronous function to write data into directory
async function writeHelper(moduleType) {
	// template dir name
	const templateDirRequest = moduleType == "Javascript modules (import/export)" ? "lib/template/jsimport/request_helper.dot" : "lib/template/commonjs/request_helper.dot"
	// create helper directory if it doesn't exists
	const helperDir = "tests/helpers";
	fs.mkdirSync(helperDir, { recursive: true }, function (err) {
		if (err) throw err;
	});

	// Check if a file named 'request.helper.js' exists in the tests/helper dir
	// If it does not exist then create a new file based on the template file 'requestHelper.dot'
	try {
		const [fileExists] = await isFileExisted(helperDir, "request.helper.js");
		if (!fileExists) {
			// create file test
			writeFile(
				"tests/helpers/request.helper.js",
				fs.readFileSync(basePath() + templateDirRequest, "utf8"),
				function (err) {
					if (err) throw err;
				}
			)
			await waitFor(500)
		}
	} catch (err) {
		console.log(err);
	}
}

export default writeHelper;
