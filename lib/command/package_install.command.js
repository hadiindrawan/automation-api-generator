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
import { runPrettier } from './prettier.command.js';
import { rebuildPackagejson } from '../utils/modul.js';
import { generate } from '../generator/generate.js';
/**
 * @description package execution
 * @param {packageInstallInterface} packageInterface included packacge, json file, and module type
 * @returns {Promise<void>}
 */
export const installPackage = (packageInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const { stringPackage, stringDevPackage, jsonfile, moduleType, prettierExist, } = packageInterface;
    const installProcess = exec('npm install ' + stringPackage, (err, stdout) => {
        if (err)
            console.log(err);
    });
    //This code is registering a listener to the exit event of installProcess
    installProcess.on('exit', (code) => __awaiter(void 0, void 0, void 0, function* () {
        //checking if npm install failed or succeeded by checking exit code
        if (code !== 0) {
            //if the exit code is not 0, it means the installation has failed. So, print error message and return.
            console.error(`${'\x1b[31m'}npm install failed with code ${code}${'\x1b[0m'}`);
            return;
        }
        if (stringDevPackage != '') {
            yield installDevPackge({
                stringDevPackage,
                jsonfile,
                moduleType,
                prettierExist
            });
        }
        else {
            //If the program reaches here, it means the install process was successful. Print a success message.
            console.log(`${'\x1b[32m'}Installation completed successfully!${'\x1b[0m'}`);
            //Print message indicating automation test generation has started..
            console.log(`${'\x1b[34m'}Generating automation test..${'\x1b[0m'}`);
            //Call the generate function to generate automation tests.
            yield generate(jsonfile, moduleType);
            yield runPrettier(prettierExist);
            // write test script for run the regression test 
            yield rebuildPackagejson();
        }
    }));
});
/**
 * @description dev package execution
 * @param {devPackageInstallInterface} devPackageInterface included packacge, json file, and module type
 * @returns {Promise<void>}
 */
export const installDevPackge = (devPackageInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const { stringDevPackage, jsonfile, moduleType, prettierExist, } = devPackageInterface;
    const installOption = exec('npm install' + stringDevPackage + ' --save-dev', (err, stdout) => {
        if (err)
            console.log(err);
    });
    installOption.on('exit', (res) => __awaiter(void 0, void 0, void 0, function* () {
        //checking if npm install failed or succeeded by checking exit code
        if (res !== 0) {
            //if the exit code is not 0, it means the installation has failed. So, print error message and return.
            console.error(`${'\x1b[31m'}npm install failed with code ${res}${'\x1b[0m'}`);
            return;
        }
        //If the program reaches here, it means the install process was successful. Print a success message.
        console.log(`${'\x1b[32m'}Installation completed successfully!${'\x1b[0m'}`);
        //Print message indicating automation test generation has started..
        console.log(`${'\x1b[34m'}Generating automation test..${'\x1b[0m'}`);
        //Call the generate function to generate automation tests.
        yield generate(jsonfile, moduleType);
        yield runPrettier(prettierExist);
        // write test script for run the regression test 
        yield rebuildPackagejson();
    }));
});
