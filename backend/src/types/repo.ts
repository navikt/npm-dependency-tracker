import Imports from './imports';
import GithubApi from './githubApi';
import Load from '../fileHandler/loader';
import fetchRepos from '../github/fetch';
import Git from '../types/githubApi';
import Clone from '../github/commands';
import Parse from '../fileHandler/parser';
import { writeData } from '../fileHandler/writer';

import * as util from '../util';
import * as config from '../config';

import pLimit from 'p-limit';
import CommitData from './commits';
import { url } from 'inspector';

interface Repo {
    name: string;
    lastCommit: string;
    cloneUrl: string;
    branch: string;
    imports: Imports[];
    packages: any[];
    commits: CommitData.Root[];
}
function Repo(
    name: string = '',
    lastCommit: string = '',
    cloneUrl: string = '',
    imports: Imports[] = [],
    packages: any[] = [],
    commits: CommitData.Root[] = [],
    branch: string = ''
): Repo {
    return {
        name: name,
        lastCommit: lastCommit,
        cloneUrl: cloneUrl,
        branch: branch,
        imports: imports,
        packages: packages,
        commits: commits
    };
}

namespace Repo {
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
                !Repo.contains(orgRepo.full_name, localRepos) &&
                !config.blacklistRepos.includes(orgRepo.full_name)
            ) {
                newRepos.push(
                    Repo(
                        orgRepo.full_name,
                        '',
                        orgRepo.clone_url,
                        [],
                        [],
                        [],
                        orgRepo.default_branch
                    )
                );
            }
        });
        return [...localRepos, ...newRepos];
    };
    export const loadRepos = async () => {
        const localRepos: Repo[] = await Load.reposFromFile();
        const repos = await fetchRepos()
            .then((repos: Git.Root[]) => {
                return Repo.generateNewRepos(repos, localRepos);
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

        let promisess: Promise<unknown>[] = repos.map((repo: Repo) => {
            return limiter(() =>
                Clone(
                    util.generateCloneUrl(repo.cloneUrl),
                    util.generateOutputDir(repo.name)
                ).catch((url: string) => errors.push(url))
            );
        });

        await util.trackProgress(promisess, (p: number) => {});
        return errors;
    };

    export const parse = async (repos: Repo[]) => {
        let errors: string[] = [];
        const limiter = pLimit(config.concurrent);
        let promisess: Promise<unknown>[] = repos.map((repo: Repo) => {
            return limiter(async () => await Parse(repo).catch((url: string) => errors.push(url)));
        });

        await util.trackProgress(promisess, (p: number) => {});
        return errors;
    };

    const cleanPackages = (repos: Repo[]) => {
        repos.forEach((repo) => {
            repo.commits = [];
        });
    };

    export const save = (repos: Repo[]) => {
        writeData(repos, config.outputRepos);
    };

    export const saveCurrent = (repos: Repo[]) => {
        cleanPackages(repos);
        let tmpRepos: Repo[] = [];
        repos.forEach((repo) => {
            if (repo.packages.length !== 0) tmpRepos.push(repo);
        });
        writeData(tmpRepos, config.outputPackages);
    };
}

export default Repo;
