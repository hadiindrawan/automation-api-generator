import { exec } from 'child_process';

export const runPrettier = async (prettierExist: boolean) => {
    const command = 'npx prettier . --write --trailing-comma none';
    if (!prettierExist) {
        const installProcess = exec('npm install --save-dev --save-exact prettier', (err, stdout) => {
            if (err) console.log(err);
        });
        //This code is registering a listener to the exit event of installProcess
        installProcess.on('exit', async (code) => {
            exec(command, (err, stdout) => {
                if (err) console.log(err);
            });
        })
    } else {
        exec(command, (err, stdout) => {
            if (err) console.log(err);
        })
    }
}