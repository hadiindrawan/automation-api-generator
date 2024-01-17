import { exec } from 'child_process';
import { runPrettier } from './prettier.command';
import { rebuildPackagejson } from 'utils/modul';
import { devPackageInstallInterface, packageInstallInterface } from 'interface/package.interface';
import { generate } from 'generator/generate';

export const installPackage = async (packageInterface: packageInstallInterface) => {
	const {
		stringPackage,
		stringDevPackage,
		jsonfile,
		moduleType,
		prettierExist,
	} = packageInterface;

	const installProcess = exec('npm install ' + stringPackage, (err, stdout) => {
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

		if (stringDevPackage != '') {
			await installDevPackge({
				stringDevPackage,
				jsonfile,
				moduleType,
				prettierExist
			})
		} else {
			//If the program reaches here, it means the install process was successful. Print a success message.
			console.log(`${'\x1b[32m'}Installation completed successfully!${'\x1b[0m'}`)

			//Print message indicating automation test generation has started..
			console.log(`${'\x1b[34m'}Generating automation test..${'\x1b[0m'}`)

			//Call the generate function to generate automation tests.
			await generate(jsonfile, moduleType)

			await runPrettier(prettierExist)
			// write test script for run the regression test 
			await rebuildPackagejson()
		}
	})
}

export const installDevPackge = async (devPackageInterface: devPackageInstallInterface) => {
	const {
		stringDevPackage,
		jsonfile,
		moduleType,
		prettierExist,
	} = devPackageInterface;

	const installOption = exec('npm install' + stringDevPackage + ' --save-dev', (err, stdout) => {
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
		await generate(jsonfile, moduleType)

		await runPrettier(prettierExist)
		// write test script for run the regression test 
		await rebuildPackagejson()
	})
}