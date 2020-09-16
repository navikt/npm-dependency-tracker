import CommitData from './commits';
import GithubApi from './githubApi';
declare type Repo = {
    name: string;
    lastCommit: string;
    cloneUrl: string;
    branch: string;
    packages: any[];
    commits: CommitData.Root[];
    rawFetch: GithubApi.Root;
};
export default Repo;