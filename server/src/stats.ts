import { History, Repo, RepoResult, Stat } from '@nav-frontend/shared-types';
import moment from 'moment';
import { sortBy } from './generateRes';

export const reposN = (repos: Repo[]) => {
    return { name: 'Repos N', 0: ['Antall', repos.length.toString()] };
};

export const reposLang = (repos: Repo[]) => {
    let count: { [key: string]: number } = {};
    for (const repo of repos) {
        if (!repo.rawFetch.language) continue;
        count[repo.rawFetch.language] = 1 + (count[repo.rawFetch.language] || 0);
    }
    const sortedLang: [string, number][] = Object.entries(count)
        .sort((a, b) => a[1] - b[1])
        .reverse();
    return { name: 'Språk', ...sortedLang };
};

export const reposDeps = (repos: Repo[]) => {
    let count: { [key: string]: number } = {};

    for (const repo of repos) {
        for (const pack of repo.packages) {
            if (pack.dependencies) {
                for (const dep in pack.dependencies) {
                    count[dep] = 1 + (count[dep] || 0);
                }
            }
        }
    }
    const sortedDeps: [string, number][] = Object.entries(count)
        .sort((a, b) => a[1] - b[1])
        .reverse();
    return { name: 'dependencies', ...sortedDeps };
};

export const reposDevDeps = (repos: Repo[]) => {
    let count: { [key: string]: number } = {};

    for (const repo of repos) {
        for (const pack of repo.packages) {
            if (pack.devDependencies) {
                for (const dep in pack.devDependencies) {
                    count[dep] = 1 + (count[dep] || 0);
                }
            }
        }
    }
    const sortedDeps: [string, number][] = Object.entries(count)
        .sort((a, b) => a[1] - b[1])
        .reverse();
    return { name: 'devDependencies', ...sortedDeps };
};

export const reposPeerDeps = (repos: Repo[]) => {
    let count: { [key: string]: number } = {};

    for (const repo of repos) {
        for (const pack of repo.packages) {
            if (pack.peerDependencies) {
                for (const dep in pack.peerDependencies) {
                    count[dep] = 1 + (count[dep] || 0);
                }
            }
        }
    }
    const sortedDeps: [string, number][] = Object.entries(count)
        .sort((a, b) => a[1] - b[1])
        .reverse();
    return { name: 'peerDependencies', ...sortedDeps };
};

export const reposNpackages = (repos: Repo[], rawLength: number) => {
    let count: { [key: string]: number } = {};
    for (const repo of repos) {
        if (repo.packages.length === 0) count['Ingen'] = 1 + (count['Ingen'] || 0);
        else if (repo.packages.length === 1) count['En'] = 1 + (count['En'] || 0);
        else if (repo.packages.length === 2) count['To'] = 1 + (count['To'] || 0);
        else if (repo.packages.length === 3) count['Tre'] = 1 + (count['Tre'] || 0);
        else {
            count[`Andre`] = 1 + (count[`Andre`] || 0);
        }
    }
    count['Ingen'] = rawLength - repos.length + (count['Ingen'] || 0);
    const sortedPack: [string, number][] = Object.entries(count)
        .sort((a, b) => a[1] - b[1])
        .reverse();

    return { name: 'Package.json N', ...sortedPack };
};

export const repoHistory = (repos: RepoResult[]) => {
    if (repos.length === 0) return null;
    const newRepos = [...repos];
    sortBy(newRepos, 'opprettet');
    newRepos.reverse();

    let count = 0,
        prev = 0,
        i = 0;
    let day = moment(newRepos[0].created);
    let events: any[] = [];

    const tomorrow = moment().add(1, 'day');
    while (day.isBefore(tomorrow)) {
        for (i; i < newRepos.length; ) {
            if (moment(newRepos[i].created).isSame(day, 'month')) {
                count++;
                i++;
                continue;
            } else {
                break;
            }
        }
        if (count > prev) {
            prev = count;
            events.push({ månede: day.format('MM/YY'), antall: count });
        }
        day.add(1, 'day');
    }
    return { name: 'Repo-vekst', events: events } as History;
};
