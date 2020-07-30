import * as util from './util';
import Repo, { RepoData } from './dataHandling/repo.js';
import * as parser from './dataHandling/parser';
import { download } from './api/download';

/**
 * TODO Handle errors better when downloading fails
 * TODO Option to just download updated repos/ Repos not located locally
 */
const execute = async () => {
    let promises: any[] = [];
    let toWrite: RepoData[] = [];
    let batch = 0,
        totalSize = 0,
        totalDep = 0,
        errors = 0;


    const repos = await parser.generateRepos();
    const batchedRepos = parser.batchRepos(repos);



    while (batch < batchedRepos.length) {
        batchedRepos[batch].forEach((repo: Repo) => {
            if (!repo.invalid) {
                promises.push(download(repo).catch((e) => console.log(e)));
            }
        });
        await util.trackProgress(promises, (p: number) => {
            if (p === 100) {
                console.log(util.repoProgressComplete(p.toFixed(2), batch, repos.length));
            }
        });
        batch += 1;
    }

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