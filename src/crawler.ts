import * as util from './util';
import Repo, { RepoData } from './dataHandling/repo.js';
import * as parser from './dataHandling/parser';
import { writeData } from './dataHandling/filehandler';
import { download } from './api/download';
import * as config from './config';
import pLimit from 'p-limit';
const cliProgress = require('cli-progress');

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
/**
 * Donwloads and parses every repo in an org. 
 * Uses pLimit to limit promises running at once to a set number
 */
const execute = async () => {
    let toWrite: RepoData[] = [];
    let totalSize = 0,
        totalDep = 0,
        errors = 0;

    const limiter = pLimit(config.concurrent)

    const repos:Repo[] = await parser.generateRepos();

    let promisess:Promise<unknown>[] = repos.map((repo: Repo) => {
        return limiter(() => download(repo).catch((e) => console.log(e)));
    });

    bar1.start(100, 0);

    await util.trackProgress(promisess, (p: number) => {
        bar1.update(+p.toFixed(1));
    }).then(() => bar1.stop());

    repos.forEach((repo) => {
        totalSize += +repo.size;
        if (repo.processed) {
            totalDep += 1;
            toWrite.push(repo.getData());
        }
    });
    writeData(toWrite);

    console.table([
        { Total_repos: repos.length, Total_size_MB: totalSize / 1000, Repos_w_dep: totalDep, Errors: errors }
    ]);
};


export default execute;