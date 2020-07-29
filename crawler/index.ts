require('dotenv').config();
const config = require('./config.js');
import * as util from './util';
import Repo from './data/repo.js';
import Package from './data/package';
import * as connector from './connection/fetch';
import * as clone from './connection/clone';
import { report } from 'process';
import * as parser from './parser';
import { fileURLToPath } from 'url';

// TODO: Handle erros better, try to rerun them at the end?
console.time(util.finished);

if (!config.token) {
    console.log(util.tokenError);
    process.exit(0);
}

/**
 * TODO execute downloading in batches of X repos
 * TODO Handle errors better when downloading fails
 * TODO Write repo data to a .json file
 * TODO Option to just download updated repos/ Repos not located locally
 */
const execute = async () => {
    let errors = 0;
    let packages: string[] = [];
    let promises: any[] = [];
    let entry = 0,
        tail = 0,
        batch = 0;
    // Fetches every repo on Org and inserts them into an array of class Repo
    const repos = await parser.generateRepos();
    const batchedRepos = parser.batchRepos(repos);
    tail = util.nextBatch(tail, repos.length);

    if (entry < 24) {
        batchedRepos[batch].forEach((repos: Repo) => {
            promises.push(
                new Promise((resolve, reject) => {
                    // Downloads repo from github locally

                    clone.dlRepo(repos.fullName, (error?: Error) => {
                        if (error) {
                            errors += 1;
                            reject(error);
                        } else {
                            packages = parser.findPackages(config.tmpDirName + '/' + repos.fullName);
                            packages.forEach((name) => {
                                repos.addPackage(parser.parseDepFile(parser.readDepFile(name), name));
                            });
                            // Deletes downloaded repo after parsing is complete
                            clone.delRepo(repos.fullName);
                            resolve();
                        }
                    });
                }).catch(() => console.log('Rejected promise!'))
            );
            entry += 1;
        });
        await util.trackProgress(promises, (p: number) => {
            if (p === 100) {
                console.log(util.repoProgressComplete(p.toFixed(2), batch, repos.length));
            }
        });
        batch += 1;
        tail = util.nextBatch(tail, repos.length);
    }

    console.log('Completed batch run');

    let totalSize = 0;
    let totalDep = 0;
    let toWrite: {
        name: string;
        url: string;
        size: string;
        activity: string;
        packages: {
            name: string;
            dependencies: {};
            devDependencies: {};
            peerDependencies: {};
        }[];
    }[] = [];
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
    clone.delRepo(config.tmpDirName);
    

    /* 
    repos.forEach((repo, i) => {
        promises.push(
            new Promise((resolve, reject) => {
                // Downloads repo from github locally
                clone.dlRepo(repo.fullName, (error?: Error) => {
                    if (error) {
                        errors += 1;
                        reject(error);
                    } else {
                        packages = parser.findPackages(config.tmpDirName + '/' + repo.fullName);
                        packages.forEach((name) => {
                            repo.addPackage(parser.parseDepFile(parser.readDepFile(name), name));
                        });

                        // Deletes downloaded repo after parsing is complete
                        clone.delRepo(repo.fullName);
                        resolve();
                    }
                });
            }).catch(() => null)
        );
    }); 

    await util.trackProgress(promises, (p: number) => {
            console.log(util.repoProgress(p.toFixed(2)));
        })
    
        .then(() => {
            let allDep = {};
            let totalSize = 0;
            let totalDep = 0;
            repos.forEach((repo) => {
                if (Object.keys(repo.filteredDep).length > 0) {
                    allDep = { ...allDep, ...repo.filteredDep };
                    totalDep += Object.keys(repo.filteredDep).length;
                }

                totalSize += +repo.size;
            });
            console.table([
                { Total_repos: repos.length, Total_size_MB: totalSize / 1000, N_dependencies: totalDep, Errors: errors }
            ]);
        });
    */
};

execute().then(() => console.timeEnd(util.finished));
