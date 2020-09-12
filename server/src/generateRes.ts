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
            return;
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
            return;
        case 'opprettet':
            data.sort((a, b) => {
                let x = new Date(a.created).getTime();
                let y = new Date(b.created).getTime();
                if (x > y) return -1;
                if (x < y) return 1;
                else return 0;
            });
            return;

        default:
            return;
    }
};

export const filterByNames = (data: Repo[], filter: NameFilter) => {
    let d = getRes(data);
    d = d.filter((repo) => {
        if (repo.name.indexOf(filter.name) !== -1 || filter.name === '') return true;
        return false;
    });

    d = d.filter((repo) => {
        if (filter.withWebsite) {
            if (repo.homepage) return true;
            return false;
        }
        return true;
    });
    d = d.filter((repo) => {
        if (filter.isPrivate) {
            if (repo.private) return true;
            return false;
        }
        return true;
    });
    sortBy(d, filter.sortby);
    return d;
};
