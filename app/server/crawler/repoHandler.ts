import { GithubApi, Repo } from '@nav-frontend/shared-types';
import fetchRepos from './github/fetch';

import { filereadJson } from './fileHandler/file';

import * as config from './config';

import pLimit from 'p-limit';

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
        localRepos = filereadJson(
            config.outputDir + '/' + config.outputReposName
        ) as Repo[];
    } catch (error) {
        console.log(error.message);
    }
    return fetchRepos()
        .then((repos) =>
            mapApiDataToRepos(repos, [...localRepos.map(({ name }) => name)])
        )
        .then((repos: Repo[]) => [...localRepos, ...repos])
        .then((repos: Repo[]) =>
            repos.filter(
                (repo: Repo) => !config.blacklistRepos.includes(repo.name)
            )
        );
};

export const pLimiter = async (repos: Repo[], func: Function) => {
    const limiter = pLimit(config.concurrent);

    return Promise.all(
        repos.map((repo: Repo) =>
            limiter(() =>
                func(repo).catch((err: Error) => console.error(err.message))
            )
        )
    );
};

export default Repo;
