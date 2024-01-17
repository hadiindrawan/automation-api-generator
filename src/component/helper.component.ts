import fs from 'fs'
import { promisify } from 'util';
import { isFileExisted } from 'utils/modul';
import basePath from 'utils/path';
import { waitFor } from 'utils/wait';

const writeFile = promisify(fs.writeFile);
// Asynchronous function to write data into directory
export const writeHelper = async (moduleType: string) => {
	// template dir name
	const templateDirRequest = moduleType == "Javascript modules (import/export)" ? "lib/template/jsimport/request_helper.dot" : "lib/template/commonjs/request_helper.dot"
	// create helper directory if it doesn't exists
	const helperDir = "tests/helpers";
	try {
		fs.mkdirSync(helperDir, { recursive: true });
	} catch (err) {
		console.log(err)
	}
	// Check if a file named 'request.helper.js' exists in the tests/helper dir
	// If it does not exist then create a new file based on the template file 'requestHelper.dot'
	try {
		const [fileExists] = await isFileExisted(helperDir, "request.helper.js");
		if (!fileExists) {
			// create file test
			writeFile(
				"tests/helpers/request.helper.js",
				fs.readFileSync(basePath() + templateDirRequest, "utf8")
			)
			await waitFor(500)
		}
	} catch (err) {
		console.log(err);
	}
}
