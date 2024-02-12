import fs from 'fs'
import { asyncForEach } from 'utils/foreach';
import { isFileExisted } from 'utils/modul';
import { basedir } from 'utils/path';
import { waitFor } from 'utils/wait';

/**
 * @description asynchronous function to write config into directory
 * @param {any[]} configList config list will be write
 * @returns {Promise<void>}
 */
export const writeConfigs = async (configList: any[]): Promise<void> => {
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
