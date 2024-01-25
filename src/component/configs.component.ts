import fs from 'fs'
import { asyncForEach } from 'utils/foreach';
import { isFileExisted } from 'utils/modul';
import { basedir } from 'utils/path';
import { waitFor } from 'utils/wait';

// Asynchronous function to write data into directory
export const writeConfigs = async (configList: any[]) => {
    await asyncForEach(configList, async (item: any) => {
        try {
            const [fileExists] = await isFileExisted(basedir(), `${item.filename}`);
            if (!fileExists) {
                // create file test
                fs.writeFileSync(
                    basedir() + `/${item.filename}`, item.template,
                    "utf8"
                )
                await waitFor(500)
            }
        } catch (err) {
            console.log(err);
        }
    })
}
