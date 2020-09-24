import chalk from 'chalk';
import { Repo, CommitData } from '@nav-frontend/shared-types';
const config = require('./config.js');
const cliProgress = require('cli-progress');
const glob = require('fast-glob');

// Used if there is made more than 5k calls to the Github API the last hour
export const xrateError = (wait: string) => {
    return chalk.redBright(
        'Overstepped Github x-rate, resets at: ' +
            wait +
            '\nProgram can not be executed until then, so time for a coffee!'
    );
};

export const checkEnv = () => {
    if (!config.token || !config.userName || !config.userAgent || !config.org) {
        console.log(chalk.redBright('ERROR: .env er ikke valid, følg eksempelet i README.\n'));
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

export const filterBlacklisted = (repos: Repo[]) => {
    return repos.filter((repo) => {
        if (stringsInText(config.blacklistRepos, repo.name, true)) {
            return false;
        } else return true;
    });
};

export const getPackagePaths = async (dir: string) => {
    let files: string[] = await glob(`${dir}/**/package.json`);
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
            if (path.indexOf('package.json') !== -1 && path.indexOf('node_modules') === -1)
                return true;
            // fix to allow 'nav-frontend-moduler' past
            else if (
                path.indexOf('package.json') !== -1 &&
                path.indexOf('packages/node_modules') !== -1
            )
                return true;
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

    let filtered: CommitData.Root[] = [];
    commits.forEach((commit) => {
        hashes.push(commit.hash);
    });

    let i = hashes.findIndex((hash) => {
        return hash === lastCommit;
    });

    if (i === -1) return commits;
    else {
        for (i = i + 1; i < commits.length; i++) {
            filtered.push(commits[i]);
        }
        return filtered;
    }
};
