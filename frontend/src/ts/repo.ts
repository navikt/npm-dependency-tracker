import CommitData from './commits';

interface Repo {
    name: string;
    lastCommit: string;
    cloneUrl: string;
    branch: string;
    packages: any[];
    commits: CommitData.Root[];
}

export default Repo;
