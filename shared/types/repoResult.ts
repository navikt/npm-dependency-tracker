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

export default RepoResult;
