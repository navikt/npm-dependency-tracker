import { Repo } from './github';

export type RepoResult = {
    name: string;
    url: string;
    language: string;
    packageN: number;
    private: boolean;
    created: Date;
    pushed: Date;
    homepage: string;
    size: number;
    stars: number;
    watchers: number;
    forks: number;
    subscribers: number;
    issues: number;
};

export function RepoResultFactory(repo: Repo): RepoResult {
    return {
        name: repo.name.replace('navikt/', ''),
        url: repo.rawFetch.html_url,
        language: repo.rawFetch.language,
        packageN: repo.packages.length,
        private: repo.rawFetch.private,
        created: repo.rawFetch.created_at,
        pushed: repo.rawFetch.pushed_at,
        homepage: repo.rawFetch.homepage,
        size: repo.rawFetch.size,
        stars: repo.rawFetch.stargazers_count,
        watchers: repo.rawFetch.watchers_count,
        forks: repo.rawFetch.forks_count,
        subscribers: repo.rawFetch.stargazers_count,
        issues: repo.rawFetch.open_issues_count
    };
}

export type Stat = {
    name: string;
    [key: string]: string;
};

export type History = {
    name: string;
    xAxis: string;
    lines: string[];
    events: any[];
};

export type ServerResults = {
    repos: RepoResult[];
    statistics: any[];
    history: History[];
};
