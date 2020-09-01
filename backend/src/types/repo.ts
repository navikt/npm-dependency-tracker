import Imports from './imports';
import Package from './packages';
import GithubApi from './githubApi';
import Load from '../fileHandler/loader';
import fetchRepos from '../github/fetch';
import Git from '../types/githubApi';

interface Repo {
    name: string;
    lastCommit: string;
    cloneUrl: string;
    imports: Imports[];
    packages: Package[];
}
function Repo(
    name: string = '',
    lastCommit: string = '',
    cloneUrl: string = '',
    imports: Imports[] = [],
    packages: Package[] = []
): Repo {
    return {
        name: name,
        lastCommit: lastCommit,
        cloneUrl: cloneUrl,
        imports: imports,
        packages: packages
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
                newRepos.push(Repo(orgRepo.full_name, '', orgRepo.clone_url, [], []));
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
}

export default Repo;
