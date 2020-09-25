import { GithubApi, Repo } from '@nav-frontend/shared-types';
import fetchRepos from './github/fetch';
import Clone from './github/commands';
import Parse from './fileHandler/parser';
import { filereadJson } from './fileHandler/file';

import * as util from './util';
import * as config from './config';

import pLimit from 'p-limit';

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

export const mapApiDataToRepos = (
    apiRepos: GithubApi.Root[],
    filter: string[] = []
) =>
    apiRepos
        .map(
            (orgRepo: GithubApi.Root): Repo => ({
                name: orgRepo.full_name || '',
                lastCommit: '',
                cloneUrl: orgRepo.clone_url || '',
                branch: orgRepo.default_branch || '',
                packages: [],
                commits: [],
                rawFetch: orgRepo
            })
        )
        .filter((repo: Repo) => !filter.includes(repo.name));

export const loadRepos = async () => {
    let localRepos: Repo[] = [];
    try {
        localRepos = filereadJson() as Repo[];
    } catch (error) {
        console.log(error.message);
    }

    return fetchRepos()
        .then((repos) =>
            mapApiDataToRepos(repos, [
                ...localRepos.map(({ name }) => name),
                ...config.blacklistRepos
            ])
        )
        .then((repos: Repo[]) => [...localRepos, ...repos]);
};

export const clone = async (repos: Repo[]) => {
    const limiter = pLimit(config.concurrent);

    let promises: Promise<unknown>[] = repos.map((repo: Repo) => {
        return limiter(() =>
            Clone(
                util.generateCloneUrl(repo.cloneUrl),
                util.generateOutputDir(repo.name)
            ).catch((err: Error) => console.error(err.message))
        );
    });

    return Promise.all(promises);
};

export const parse = async (repos: Repo[]) => {
    const limiter = pLimit(config.concurrent);

    return Promise.all(
        repos.map((repo: Repo) =>
            limiter(() =>
                Parse(repo).catch((err: Error) => console.error(err.message))
            )
        )
    );
};

export default Repo;
