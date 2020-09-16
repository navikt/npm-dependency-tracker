import { Repo, Stat } from '@nav-frontend/shared-types';

export const reposN = (repos: Repo[]) => {
    return { name: 'Repos N', length: repos.length.toString() };
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
    return { name: 'Language', ...sortedLang };
};
