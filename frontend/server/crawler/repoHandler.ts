import { GithubApi, CommitData, Repo } from '@nav-frontend/shared-types';
import fetchRepos from './github/fetch';
import Clone from './github/commands';
import Parse from './fileHandler/parser';
import { writeData, reposFromFile } from './fileHandler/file';

import * as util from './util';
import * as config from './config';

import pLimit from 'p-limit';

const newRepo = (
    name: string = '',
    lastCommit: string = '',
    cloneUrl: string = '',
    packages: any[] = [],
    commits: CommitData.Root[] = [],
    branch: string = '',
    rawFetch: GithubApi.Root
): Repo => {
    return {
        name: name,
        lastCommit: lastCommit,
        cloneUrl: cloneUrl,
        branch: branch,
        packages: packages,
        commits: commits,
        rawFetch: rawFetch
    };
};

export const contains = (repo: string, repos: Repo[]) => {
    return repos.filter((x: Repo) => x.name === repo).length;
};

export const cleanCommits = (repos: Repo[]) => {
    repos.forEach((repo) => {
        repo.commits.forEach((commit) => {
            commit.filesAdded = [];
            commit.filesDeleted = [];
            commit.filesRenamed = [];
            commit.filesModified = [];
        });
    });
};

export const generateNewRepos = (gitRepos: GithubApi.Root[], localRepos: Repo[]) => {
    const newRepos: Repo[] = [];
    gitRepos.forEach((orgRepo) => {
        if (
            !contains(orgRepo.full_name, localRepos) &&
            !config.blacklistRepos.includes(orgRepo.full_name)
        ) {
            newRepos.push(
                newRepo(
                    orgRepo.full_name,
                    '',
                    orgRepo.clone_url,
                    [],
                    [],
                    orgRepo.default_branch,
                    orgRepo
                )
            );
        }
    });
    return [...localRepos, ...newRepos];
};
export const loadRepos = async () => {
    const localRepos: Repo[] = await reposFromFile();
    const repos = await fetchRepos()
        .then((repos: GithubApi.Root[]) => {
            return generateNewRepos(repos, localRepos);
        })
        .catch((err) => {
            console.log(err);
            return undefined;
        });
    return repos;
};

export const clone = async (repos: Repo[]) => {
    let errors: string[] = [];
    const limiter = pLimit(config.concurrent);

    let promises: Promise<unknown>[] = repos.map((repo: Repo) => {
        return limiter(() =>
            Clone(
                util.generateCloneUrl(repo.cloneUrl),
                util.generateOutputDir(repo.name)
            ).catch((url: string) => errors.push(url))
        );
    });

    await Promise.all(promises);
    return errors;
};

export const parse = async (repos: Repo[]) => {
    let errors: string[] = [];
    const limiter = pLimit(config.concurrent);
    let promises: Promise<unknown>[] = repos.map((repo: Repo) => {
        return limiter(async () => await Parse(repo).catch((url: string) => errors.push(url)));
    });

    await Promise.all(promises);
    return errors;
};

const cleanPackages = (repos: Repo[]) => {
    repos.forEach((repo) => {
        repo.commits = [];
    });
};

export const save = (repos: Repo[]) => {
    writeData(repos, config.outputDir, config.outputReposName);
};

export const saveCurrent = (repos: Repo[]) => {
    cleanPackages(repos);
    let tmpRepos: Repo[] = [];
    repos.forEach((repo) => {
        if (repo.packages.length !== 0) tmpRepos.push(repo);
    });
    writeData(tmpRepos, config.outputDir, config.outputPackagesName);
};

export default Repo;
