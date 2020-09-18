import { NameFilter, PackFilter, Repo, RepoResult, VersionLimit } from '@nav-frontend/shared-types';
const semver = require('semver');
import semverRegex from 'semver-regex';

export const getRes = (data: Repo[]): RepoResult[] => {
    let res: RepoResult[] = [];
    data.forEach((repo) => {
        res.push(RepoResult(repo));
    });
    data.sort((a, b) => a.name.localeCompare(b.name));
    return res;
};

export const sortBy = (data: RepoResult[], sort: string) => {
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
    let newData = data.filter((repo) => {
        if (repo.name.indexOf(filter.name) !== -1 || filter.name === '') return true;
        return false;
    });

    return newData;
};
export const filterByOptions = (data: Repo[], filter: NameFilter) => {
    let newData = data.filter((repo) => {
        if (filter.withWebsite) {
            if (repo.rawFetch.homepage) return true;
            return false;
        }
        return true;
    });
    newData = newData.filter((repo) => {
        if (filter.isPrivate) {
            if (repo.rawFetch.private) return true;
            return false;
        }
        return true;
    });
    newData = newData.filter((repo) => {
        if (filter.isArchived) {
            if (repo.rawFetch.archived) return false;
            return true;
        }
        return true;
    });
    return newData;
};

const checkVersion = (packV: string, depV: string, scope: string) => {
    if (!semverRegex().test(packV)) return false;

    if (packV === 'latest' && scope === VersionLimit.UP) return true;
    else if (packV === 'latest' && scope !== VersionLimit.UP) return false;

    packV = semver.minVersion(packV).raw;
    depV = semver.minVersion(depV).raw;

    switch (scope) {
        case VersionLimit.DOWN:
            if (semver.lt(packV, depV)) return true;
            else return false;
        case VersionLimit.EXACT:
            if (semver.gt(packV, depV)) return true;
            else return false;
        case VersionLimit.EXACT:
            if (semver.eq(packV, depV)) return true;
            else return false;
        default:
            return false;
    }
};

export const inDep = (pack: { [key: string]: string }, filter: PackFilter) => {
    if (pack.hasOwnProperty(filter.name)) {
        if (filter.version !== '') {
            if (checkVersion(pack[filter.name], filter.version, filter.timeline)) return true;
        } else return true;
    }
    return false;
};

const validPackage = (pack: any, filter: PackFilter[]) => {
    let peerDep = pack.peerDependencies;
    let devDep = pack.devDependencies;
    let dep = pack.dependencies;

    for (const query of filter) {
        let valid = false;
        if (peerDep) {
            valid = inDep(peerDep, query) ? true : valid;
        }
        if (devDep) {
            valid = inDep(devDep, query) ? true : valid;
        }
        if (dep) {
            valid = inDep(dep, query) ? true : valid;
        }
        if (!valid) return false;
    }
    return true;
};
export const filterByPack = (data: Repo[], filter: PackFilter[]) => {
    if (filter.length === 0) return data;
    const newData = data.filter((repo) => {
        for (const pack of repo.packages) {
            if (validPackage(pack, filter)) {
                return true;
            }
        }
        return false;
    });
    return newData;
};
