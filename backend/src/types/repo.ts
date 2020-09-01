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
}
function Repo(
    name: string = '',
    lastCommit: string = '',
    cloneUrl: string = '',
    imports: Imports[] = [],
    packages: Package[] = [],
    commits: CommitData.Root[] = []
): Repo {
    return {
        name: name,
        lastCommit: lastCommit,
        cloneUrl: cloneUrl,
        imports: imports,
        packages: packages,
        commits: commits
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
        console.log('Starting cloning/updating process');
        const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        const limiter = pLimit(config.concurrent);

        let promisess: Promise<unknown>[] = repos.map((repo: Repo) => {
            return limiter(() =>
                Clone(
                    util.generateCloneUrl(repo.cloneUrl),
                    util.generateOutputDir(repo.name)
                ).catch((url: string) => console.log(url))
            );
        });

        bar1.start(100, 0);
        await util.trackProgress(promisess, (p: number) => {
            bar1.update(+p.toFixed(1));
        });
        bar1.stop();
        console.log('Finished cloning/updating process');
    };

    export const parseCommits = async (repos: Repo[]) => {
        console.log('Starting commit parsing');
        const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        const limiter = pLimit(config.concurrent);

        let promisess: Promise<unknown>[] = repos.map((repo: Repo) => {
            return limiter(() => Parse(repo).catch((url: string) => console.log(url)));
        });

        bar1.start(100, 0);
        await util.trackProgress(promisess, (p: number) => {
            bar1.update(+p.toFixed(1));
        });
        bar1.stop();

        console.log('Finished commit parsing');
    };
}

export default Repo;
