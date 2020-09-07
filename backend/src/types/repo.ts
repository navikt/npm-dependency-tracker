import Imports from './imports';
import Package from './packages';
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
    packages: Package[];
    commits: CommitData.Root[];
}
function Repo(
    name: string = '',
    lastCommit: string = '',
    cloneUrl: string = '',
    imports: Imports[] = [],
    packages: Package[] = [],
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
        const bar = util.progressBar('Cloner');
        const limiter = pLimit(config.concurrent);

        let promisess: Promise<unknown>[] = repos.map((repo: Repo) => {
            return limiter(() =>
                Clone(
                    util.generateCloneUrl(repo.cloneUrl),
                    util.generateOutputDir(repo.name)
                ).catch((url: string) => errors.push(url))
            );
        });

        bar.start(100, 0);
        await util.trackProgress(promisess, (p: number) => {
            bar.update(+p.toFixed(1));
        });
        return errors;
    };

    export const parse = async (repos: Repo[]) => {
        let errors: string[] = [];
        const limiter = pLimit(config.concurrent);
        const multiBar = util.multiProgressBar('{bar} {value}/{total} | {duration}s | {dir}');
        const bar = multiBar.create(repos.length, 0);
        let promisess: Promise<unknown>[] = repos.map((repo: Repo) => {
            return limiter(
                async () => await Parse(repo, multiBar).catch((url: string) => errors.push(url))
            );
        });

        bar.update(0, { dir: 'Parser' });
        await util.trackProgress(promisess, (p: number) => {
            bar.increment();
        });
        multiBar.stop();
        return errors;
    };

    export const save = (repos: Repo[]) => {
        writeData(repos);
    };
}

export default Repo;
