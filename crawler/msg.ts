import chalk from 'chalk';

export const finished = chalk.cyan('\nFinished OK');
export const tokenError = chalk.redBright(
    'ERROR: Please add a github access-token with the command `export token=YOUR_TOKEN` before running.\n'
);
export const runtime = '';
