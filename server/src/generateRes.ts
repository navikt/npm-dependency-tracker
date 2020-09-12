import { NameFilter, Repo, RepoResult } from '@nav-frontend/shared-types';

export const getRes = (data: Repo[]): RepoResult[] => {
    let res: RepoResult[] = [];
    data.forEach((repo) => {
        res.push(RepoResult(repo));
    });
    res.sort((a, b) => a.name.localeCompare(b.name));
    return res;
};

const sortBy = (data: RepoResult[], sort: string) => {
    switch (sort) {
        case 'alfabet':
            data.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'nPackages':
            data.sort((a, b) => {
                if (a.packageN > b.packageN) return -1;
                if (a.packageN < b.packageN) return 1;
                else return 0;
            });
            return;
        case 'nWatchers':
            data.sort((a, b) => {
                if (a.watchers > b.watchers) return -1;
                if (a.watchers < b.watchers) return 1;
                else return 0;
            });
            break;

        default:
            return;
    }
};

export const filterByNames = (data: Repo[], filter: NameFilter) => {
    let d = getRes(data);
    d = d.filter((repo) => {
        if (repo.name.indexOf(filter.name) !== -1 || filter.name === '') {
            return true;
        }
        return false;
    });
    sortBy(d, filter.sortby);
    return d;
};
