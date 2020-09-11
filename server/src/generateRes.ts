import { Repo, RepoResult } from '@nav-frontend/shared-types';
import { push } from 'isomorphic-git';

const makeRepoResult = (
    name: string,
    url: string,
    language: string,
    packageN: number,
    priv: boolean,
    created: Date,
    pushed: Date,
    homepage: string,
    size: number,
    stars: number,
    watchers: number,
    forks: number,
    subscribers: number
) => {
    return {
        name: name,
        url: url,
        language: language,
        packageN: packageN,
        private: priv,
        created: created,
        pushed: pushed,
        homepage: homepage,
        size: size,
        stars: stars,
        watchers: watchers,
        forks: forks,
        subscribers: subscribers
    };
};
export const getRes = (data: Repo[]): RepoResult[] => {
    let res: RepoResult[] = [];
    data.forEach((repo) => {
        res.push(
            makeRepoResult(
                repo.name.replace('navikt/', ''),
                repo.rawFetch.html_url,
                repo.rawFetch.language,
                repo.packages.length,
                repo.rawFetch.private,
                repo.rawFetch.created_at,
                repo.rawFetch.pushed_at,
                repo.rawFetch.homepage,
                repo.rawFetch.size,
                repo.rawFetch.stargazers_count,
                repo.rawFetch.watchers_count,
                repo.rawFetch.forks_count,
                repo.rawFetch.subscribers_count
            )
        );
    });
    res.sort((a, b) => a.name.localeCompare(b.name));
    return res;
};

export const getFilteredNameRes = (data: Repo[], str: string) => {
    let d = getRes(data);
    d = d.filter((repo) => {
        if (repo.name.indexOf(str) !== -1) {
            return true;
        }
        return false;
    });
    return d;
};
