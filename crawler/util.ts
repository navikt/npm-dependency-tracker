import chalk from 'chalk';

export const finished = chalk.cyan('\nFinished OK');
export const tokenError = chalk.redBright(
    'ERROR: Please add a github access-token with the command `export token=YOUR_TOKEN` before running.\n'
);

export const xrateError = (wait:string) => {
    return chalk.redBright('Overstepped Github x-rate, resets at: ' + wait + '\nProgram can not be executed until then, so time for a coffee!');
}
export const runtime = '';

export const repoProgress = (index:string) => {
    return chalk.whiteBright('Processed ' + index + '%');
}

export const trackProgress = (proms: Promise<any>[], progress_cb: Function) => {
    let d = 0;
    progress_cb(0);
    for (const p of proms) {
        p.then(() => {
            d++;
            progress_cb((d * 100) / proms.length);
        });
    }
    return Promise.all(proms);
};