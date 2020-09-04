import chalk from 'chalk';
import Repo from './types/repo';
import CommitData from './types/commits';
import { filter } from 'underscore';
const config = require('./config.js');
const cliProgress = require('cli-progress');
const glob = require('fast-glob');

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
export const nameError = chalk.redBright(
    'ERROR: Please add a name with the command `export NAME=NAME` or add a .env file with NAME=NAME before running.\n'
);

export const xrateError = (wait: string) => {
    return chalk.redBright(
        'Overstepped Github x-rate, resets at: ' +
            wait +
            '\nProgram can not be executed until then, so time for a coffee!'
    );
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
    if (!config.userName) {
        console.log(nameError);
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

export const getPackagePaths = async (dir: string) => {
    let files = await glob(`${dir}/**/package.json`);
    return files;
};

export const hasPackages = async (dir: string) => {
    let files = await glob(`${dir}/**/package.json`);
    if (files.length === 0) return false;
    else return true;
};

export const filterCommits = (commits: CommitData.Root[]) => {
    return commits.filter((commit) => {
        let fileChanges = [
            ...commit.filesAdded,
            ...commit.filesDeleted,
            ...commit.filesModified,
            ...commit.filesRenamed
        ];
        for (let x = 0; x < fileChanges.length; x++) {
            let path = fileChanges[x].path ? fileChanges[x].path : fileChanges[x].newPath;
            if (!path) return false;
            if (path.indexOf('package.json') !== -1) return true;
        }
        return false;
    });
};

/**
 * Filters out old commits based on the last parsed commit
 * Assumes that commits is sorted from [old -> new]
 */
export const removeOldCommits = (commits: CommitData.Root[], lastCommit: string) => {
    let hashes: string[] = [];
    let filtered = commits;
    commits.forEach((commit) => {
        hashes.push(commit.hash);
    });

    const i = hashes.findIndex((hash) => {
        return hash === lastCommit;
    });

    if (i === -1) return commits;
    else {
        filtered.splice(0, i + 1);
        return filtered;
    }
};
