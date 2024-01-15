import { exec } from 'child_process';
import generate from 'generator/generate';
import { runPrettier } from './prettier.command';
import { rebuildPackagejson } from 'utils/modul';

export const installPackage = async (strPack, npm, jsonfile, moduleQ, prettierExist) => {
    const installProcess = exec('npm install ' + strPack, (err, stdout) => {
        if (err) console.log(err);
    });
    //This code is registering a listener to the exit event of installProcess
    installProcess.on('exit', async (code) => {
        //checking if npm install failed or succeeded by checking exit code
        if (code !== 0) {
            //if the exit code is not 0, it means the installation has failed. So, print error message and return.
            console.error(`${'\x1b[31m'}npm install failed with code ${code}${'\x1b[0m'}`)
            return;
        }

        if (npm != '') {
            await installDevPackge(npm, jsonfile, moduleQ, prettierExist)
        } else {
            //If the program reaches here, it means the install process was successful. Print a success message.
            console.log(`${'\x1b[32m'}Installation completed successfully!${'\x1b[0m'}`)

            //Print message indicating automation test generation has started..
            console.log(`${'\x1b[34m'}Generating automation test..${'\x1b[0m'}`)

            //Call the generate function to generate automation tests.
            await generate(jsonfile, moduleQ)

            await runPrettier(prettierExist)
            // write test script for run the regression test 
            await rebuildPackagejson()
        }
    })
}

export const installDevPackge = async (npm, jsonfile, moduleQ, prettierExist) => {
    const installOption = exec('npm install' + npm + ' --save-dev', (err, stdout) => {
        if (err) console.log(err);
    });
    installOption.on('exit', async (res) => {
        //checking if npm install failed or succeeded by checking exit code
        if (res !== 0) {
            //if the exit code is not 0, it means the installation has failed. So, print error message and return.
            console.error(`${'\x1b[31m'}npm install failed with code ${res}${'\x1b[0m'}`)
            return;
        }

        //If the program reaches here, it means the install process was successful. Print a success message.
        console.log(`${'\x1b[32m'}Installation completed successfully!${'\x1b[0m'}`)

        //Print message indicating automation test generation has started..
        console.log(`${'\x1b[34m'}Generating automation test..${'\x1b[0m'}`)

        //Call the generate function to generate automation tests.
        await generate(jsonfile, moduleQ)

        await runPrettier(prettierExist)
        // write test script for run the regression test 
        await rebuildPackagejson()
    })
}