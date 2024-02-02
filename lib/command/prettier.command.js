var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { exec } from 'child_process';
/**
 * @description prettier plugin execution
 * @param {boolean | string[] | string} prettierExist prettier exist condition
 * @returns {Promise<void>}
 */
export const runPrettier = (prettierExist) => __awaiter(void 0, void 0, void 0, function* () {
    const command = 'npx prettier . --write --trailing-comma none';
    if (!prettierExist) {
        const installProcess = exec('npm install --save-dev --save-exact prettier', (err, stdout) => {
            if (err)
                console.log(err);
        });
        //This code is registering a listener to the exit event of installProcess
        installProcess.on('exit', (code) => __awaiter(void 0, void 0, void 0, function* () {
            exec(command, (err, stdout) => {
                if (err)
                    console.log(err);
            });
        }));
    }
    else {
        exec(command, (err, stdout) => {
            if (err)
                console.log(err);
        });
    }
});
