import chalk from 'chalk';
import Repo from './types/repo';
const config = require('./config.js');
const cliProgress = require('cli-progress');
const branchName = require('current-git-branch');

export const finished = chalk.cyan('\nFinished OK');
export const tokenError = chalk.redBright(
    'ERROR: Please add a github access-token with the command `export TOKEN=YOUR_TOKEN` or add a .env file with TOKEN=YOUR_TOKEN before running.\n'
);
export const agentError = chalk.redBright(
    'ERROR: Please add a user-agent with the command `export AGENT=AGENT_NAME` or add a .env file with AGENT=AGENT_NAME before running.\n'
);
export const orgError = chalk.redBright(
    'ERROR: Please add a github org with the command `export ORG=ORG_NAME` or add a .env file with ORG=ORG_NAME before running.\n'
);

export const xrateError = (wait: string) => {
    return chalk.redBright(
        'Overstepped Github x-rate, resets at: ' +
            wait +
            '\nProgram can not be executed until then, so time for a coffee!'
    );
};

export const repoProgress = (index: string, batch: number, length: number) => {
    return chalk.whiteBright(
        'Processed ' + index + '% in batch ' + batch + ' of ' + Math.ceil(length / config.batchSize)
    );
};

export const repoProgressComplete = (index: string, length: number) => {
    return chalk.whiteBright('Progress ' + index + '%');
};

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

export const checkEnv = () => {
    if (!config.token) {
        console.log(tokenError);
        process.exit(0);
    }
    if (!config.userAgent) {
        console.log(agentError);
        process.exit(0);
    }
    if (!config.org) {
        console.log(orgError);
        process.exit(0);
    }
};

// Url with auth in format: https://<UserName>:<AuthToken>@github.com/<reponame>
export const generateCloneUrl = (cloneUrl: string) => {
    return `https://${config.userName}:${config.token}@${cloneUrl.replace('https://', '')}`;
};

export const generateOutputDir = (name: string) => {
    return `${config.repoDirName}/${name}`;
};

export const stringsInText = (strings: string[], text: string, spesific?: boolean) => {
    for (let x = 0; x < strings.length; x++) {
        if (spesific) {
            if (text === strings[x]) return true;
        } else {
            if (text.indexOf(strings[x]) !== -1) return true;
        }
    }
    return false;
};

export const progressBar = (text: string) => {
    return new cliProgress.Bar(
        {
            format: `${text} |{bar}| {percentage}% | {duration}s`,
            etaBuffer: 1000,
            stopOnComplete: true
        },
        cliProgress.Presets.rect
    );
};

export const multiProgressBar = (format?: string) => {
    const f = format ? format : '{bar} {percentage}% | {duration}s | {dir}';
    return new cliProgress.MultiBar(
        {
            format: f,
            clearOnComplete: true,
            hideCursor: true,
            forceRedraw: true,
            stream: process.stdout,
            barsize: 65,
            position: 'center'
        },
        cliProgress.Presets.shades_grey
    );
};

export const filterBlacklisted = (repos: Repo[]) => {
    return repos.filter((repo) => {
        if (stringsInText(config.blacklistRepos, repo.name, true)) {
            return false;
        } else return true;
    });
};

export const getBranchName = (dir: string) => {
    return branchName({ altPath: dir });
};
