import * as util from './util';
import Repo, { RepoData } from './dataHandling/repo.js';
import * as parser from './dataHandling/parser';
import { download } from './api/download';
import * as config from './config';
import pLimit from 'p-limit';

/**
 * TODO Handle errors better when downloading fails
 * TODO Option to just download updated repos/ Repos not located locally
 */
const execute = async () => {
    let toWrite: RepoData[] = [];
    let totalSize = 0,
        totalDep = 0,
        errors = 0;

    const limiter = pLimit(config.concurrent)

    const repos = await parser.generateRepos();

    let promisess = repos.map((repo: Repo) => {
        return limiter(() => download(repo).catch((e) => console.log(e)));
    });

    await util.trackProgress(promisess, (p: number) => {
        if (p % 5 === 0) {
            console.log(util.repoProgressComplete(p.toFixed(1), repos.length));
        }
    });

    repos.forEach((repo) => {
        totalSize += +repo.size;
        if (repo.processed) {
            totalDep += 1;
            toWrite.push(repo.getData());
        }
    });
    parser.writeData(toWrite);

    console.table([
        { Total_repos: repos.length, Total_size_MB: totalSize / 1000, Repos_w_dep: totalDep, Errors: errors }
    ]);
};


export default execute;