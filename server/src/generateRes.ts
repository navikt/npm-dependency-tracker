import { Repo, RepoResult } from '@nav-frontend/shared-types';
import { push } from 'isomorphic-git';

export const getRes = (data: Repo[]): RepoResult[] => {
    let res: RepoResult[] = [];
    data.forEach((repo) => {
        res.push(RepoResult(repo));
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
