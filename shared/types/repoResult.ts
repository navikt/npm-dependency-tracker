import Repo from './repo';

type RepoResult = {
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
};

const RepoResult = (repo: Repo) => {
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
        subscribers: repo.rawFetch.subscribers_count
    };
};
export default RepoResult;
