import chalk from 'chalk';
const config = require('./config.js');

export const finished = chalk.cyan('\nFinished OK');
export const tokenError = chalk.redBright(
    'ERROR: Please add a github access-token with the command `export token=YOUR_TOKEN` before running.\n'
);

export const xrateError = (wait:string) => {
    return chalk.redBright('Overstepped Github x-rate, resets at: ' + wait + '\nProgram can not be executed until then, so time for a coffee!');
}

export const repoProgress = (index:string, batch:number, length:number) => {
    return chalk.whiteBright('Processed ' + index + '% in batch ' + batch + ' of ' + Math.ceil(length/config.batchSize));
}

export const repoProgressComplete = (index:string, batch:number, length:number) => {
    return chalk.whiteBright('Completed batch ' + (+batch + 1) + ' of ' + Math.ceil(length/config.batchSize));
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

export const nextBatch = (n:number, end:number) => {
    return n + config.batchSize > end ? config.batchSize : n + config.batchSize;
}