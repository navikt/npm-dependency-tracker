import Imports from './imports';
import Package from './packages';
import GithubApi from './githubApi';
import Load from '../fileHandler/loader';
import fetchRepos from '../github/fetch';
import Git from '../types/githubApi';
import Clone from '../github/clone';
import Parse from '../fileHandler/parser';

import * as util from '../util';
import * as config from '../config';

const cliProgress = require('cli-progress');
import pLimit from 'p-limit';
import CommitData from './commits';

interface Repo {
    name: string;
    lastCommit: string;
    cloneUrl: string;
    imports: Imports[];
    packages: Package[];
    commits: CommitData.Root[];
    branch: string;
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
        imports: imports,
        packages: packages,
        commits: commits,
        branch: branch
    };
}

namespace Repo {
    export const json = (repo: Partial<Repo>) => {
        return JSON.stringify(repo, null, 4);
    };
    export const contains = (repo: string, repos: Repo[]) => {
        return repos.filter((x: Repo) => x.name === repo).length;
    };
    export const generateNewRepos = (gitRepos: GithubApi.Root[], localRepos: Repo[]) => {
        const newRepos: Repo[] = [];
        gitRepos.forEach((orgRepo) => {
            if (!Repo.contains(orgRepo.full_name, localRepos)) {
                newRepos.push(Repo(orgRepo.full_name, '', orgRepo.clone_url, [], [], []));
            }
        });
        return [...localRepos, ...newRepos];
    };
    export const getAllRepos = async () => {
        const localRepos: Repo[] = await Load.ReposFromFile();
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
        const bar = util.progressBar('Cloner');
        const limiter = pLimit(config.concurrent);

        let promisess: Promise<unknown>[] = repos.map((repo: Repo) => {
            return limiter(() =>
                Clone(
                    util.generateCloneUrl(repo.cloneUrl),
                    util.generateOutputDir(repo.name)
                ).catch((url: string) => console.log(url))
            );
        });

        bar.start(100, 0);
        await util.trackProgress(promisess, (p: number) => {
            bar.update(+p.toFixed(1));
        });
    };

    export const parseCommits = async (repos: Repo[]) => {
        const limiter = pLimit(config.concurrent);
        const multiBar = util.multiProgressBar('{bar} {value}/{total} | {duration}s | {dir}');
        const bar = multiBar.create(repos.length, 0);
        let promisess: Promise<unknown>[] = repos.map((repo: Repo) => {
            return limiter(
                async () => await Parse(repo, multiBar).catch((url: string) => console.log(url))
            );
        });

        bar.update(0, { dir: 'Parser' });
        await util.trackProgress(promisess, (p: number) => {
            bar.increment();
        });
        multiBar.stop();
    };
}

export default Repo;
