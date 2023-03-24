import fs from "fs";
import isFileExisted from "../utils/check_dir.js";
import basePath from "../utils/base_path.js";

// Asynchronous function to write data into directory
async function writeUtils() {
    // create helper directory if it doesn't exists
    const utilsDir = "tests/utils";
    fs.mkdirSync(utilsDir, { recursive: true });

    // Check if a file named 'request.helper.js' exists in the tests/helper dir
    // If it does not exist then create a new file based on the template file 'requestHelper.dot'
    isFileExisted(utilsDir, "config.js")
        .then((data) => {
            if (!data[0]) {
                fs.writeFile(
                    "tests/utils/config.js",
                    fs.readFileSync(basePath() + "lib/template/config.dot", "utf8"),
                    function (err) {
                        if (err) throw err;
                    }
                )
            }
        })
        .catch((err) => console.log(err));
}

export default writeUtils;
