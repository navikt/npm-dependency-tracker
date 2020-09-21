import { History, PackFilter, Repo, RepoResult } from '@nav-frontend/shared-types';
import moment from 'moment';
import { inDep, sortBy } from './generateRes';

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
    count['Totalt'] =
        (count['En'] || 0) + (count['To'] || 0) + (count['Tre'] || 0) + (count['Andre'] || 0);
    count['Ingen'] = rawLength - repos.length + (count['Ingen'] || 0);
    const sortedPack: [string, number][] = Object.entries(count)
        .sort((a, b) => a[1] - b[1])
        .reverse();

    return { name: 'Package.json N', ...sortedPack };
};

export const repoHistory = (repos: RepoResult[]) => {
    if (repos.length === 0)
        return { name: 'Repo-vekst', xAxis: '', lines: [], events: [] } as History;
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
    return { name: 'Repo vekst', xAxis: 'månede', lines: ['antall'], events: events } as History;
};

export const repoVekstPerM = (repos: RepoResult[]) => {
    if (repos.length === 0)
        return { name: 'Repo-per-m', xAxis: '', lines: [], events: [] } as History;
    const newRepos = [...repos];
    sortBy(newRepos, 'opprettet');
    newRepos.reverse();

    let count = 0,
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
        if (count > 0) {
            events.push({ månede: day.format('MM/YY'), antall: count });
            count = 0;
        }
        day.add(1, 'day');
    }
    return {
        name: 'Repo per månede',
        xAxis: 'månede',
        lines: ['antall'],
        events: events
    } as History;
};

const inPackage = (pack: any, filter: PackFilter) => {
    let peerDep = pack.peerDependencies;
    let devDep = pack.devDependencies;
    let dep = pack.dependencies;

    let valid = false;
    if (peerDep) {
        valid = inDep(peerDep, filter) ? true : valid;
    }
    if (devDep) {
        valid = inDep(devDep, filter) ? true : valid;
    }
    if (dep) {
        valid = inDep(dep, filter) ? true : valid;
    }
    return valid;
};

const depsPerRepo = (repo: Repo, filter: PackFilter[]) => {
    if (repo.commits.length === 0)
        return { name: repo.name, xAxis: '', lines: [], events: [] } as History;

    let events: any[] = [];
    let i = 0;

    let counter = new Array(filter.length).fill(0);
    let res = counter.slice();

    const tomorrow = moment().add(1, 'day');
    let day = moment(repo.commits[0].date);
    while (day.isBefore(tomorrow)) {
        for (i; i < repo.commits.length; ) {
            if (moment(repo.commits[i].date).isSame(day, 'month')) {
                for (const pack of repo.commits[i].packages) {
                    filter.forEach((fil, i) => {
                        if (inPackage(pack, fil)) {
                            counter[i] = 1;
                        }
                    });
                }
                res = counter.slice();
                counter = new Array(filter.length).fill(0);
                i++;
                continue;
            } else {
                break;
            }
        }
        // dynamically add elements to obj
        let obj: { [key: string]: string } = { månede: day.format('MM/YY') };
        filter.forEach((fil, i) => {
            obj[fil.name] = res[i];
        });
        events.push(obj);

        day.add(1, 'month');
    }

    return {
        name: repo.name,
        xAxis: 'månede',
        lines: filter.map((fil) => {
            return fil.name;
        }),
        events: events
    } as History;
};

const addObj = (events: any[], obj: { [key: string]: string }) => {
    let found = false;
    let newEvents = events.slice();
    for (const ev of events) {
        if (Object.keys(obj)[0] in ev && ev[Object.keys(obj)[0]] === obj[Object.keys(obj)[0]]) {
            let first = true;
            for (const key in obj) {
                if (first) {
                    first = false;
                    continue;
                }
                ev[key] += obj[key];
            }
            found = true;
            break;
        }
    }
    if (!found) {
        let newObj: { [key: string]: string } = {};
        if (moment(`01/${obj['månede']}`, 'DD-MM-YY').isSame(moment(), 'month')) return newEvents;
        for (const key in obj) {
            newObj[key] = obj[key];
        }
        newEvents.push(newObj);
    }

    return newEvents;
};

export const depVekst = (repos: Repo[], filter: PackFilter[]) => {
    if (repos.length === 0 || filter.length === 0)
        return { name: 'Pakker', xAxis: '', lines: [], events: [] } as History;

    // semver.gt(packV, depV)

    let history: History[] = [];
    repos.forEach((repo) => {
        history.push(depsPerRepo(repo, filter));
    });

    let sumEvents: any[] = [];

    for (const e of history) {
        for (const event of e.events) {
            sumEvents = addObj(sumEvents, event);
        }
    }
    sumEvents.sort((a, b) => {
        const mA = moment(`01/${a['månede']}`, 'DD-MM-YY');
        const mB = moment(`01/${b['månede']}`, 'DD-MM-YY');
        if (mA < mB) return -1;
        if (mA > mB) return 1;
        else return 0;
    });
    return {
        name: 'Pakker',
        xAxis: 'månede',
        lines: filter
            .filter((fil) => {
                if (fil.version === '') return true;
            })
            .map((fil) => {
                return fil.name;
            }),
        events: sumEvents
    } as History;
};
