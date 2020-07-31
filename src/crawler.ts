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
        errors = 0,
        totalTime = 0,
        slowest = {time: 0, name: ''};

    const limiter = pLimit(config.concurrent)

    const repos:Repo[] = await parser.generateRepos();

    let promisess:Promise<unknown>[] = repos.map((repo: Repo) => {
        return limiter(() => download(repo).catch((e: Repo) => console.log(e.fullName + " rejected..")));
    });

    bar1.start(100, 0);

    await util.trackProgress(promisess, (p: number) => {
        bar1.update(+p.toFixed(1));
    });

    bar1.stop()
    repos.forEach((repo) => {
        totalSize += +repo.size;
        if (repo.processed) {
            totalDep += 1;
            toWrite.push(repo.getData()); 
        }
        totalTime += repo.processTime;
        if(repo.processTime > slowest.time){
            slowest.time = repo.processTime;
            slowest.name = repo.fullName;
        }
    });
    writeData(toWrite);

    console.table([
        { Total_repos: repos.length, Total_size_MB: totalSize / 1000, Repos_w_dep: totalDep, Errors: errors }
    ]);
    console.table([
        { Avg_time: ((totalTime/repos.length)/1000).toFixed(1), Longest: {name: slowest.name, time: (slowest.time / 1000).toFixed(1) }}
    ]);
};


export default execute;