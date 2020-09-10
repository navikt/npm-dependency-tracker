type Repo = {
    name: string;
    lastCommit: string;
    cloneUrl: string;
    branch: string;
    packages: any[];
    commits: any[];
};

export default Repo;