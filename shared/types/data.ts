import RepoResult from './repoResult';

export type History = {
    // TODO Change from any to Event type
    name: string;
    events: any[];
};

export type ServerResults = {
    repos: RepoResult[];
    statistics: any[];
    history: History[];
};
