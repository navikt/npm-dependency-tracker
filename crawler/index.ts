require('dotenv').config();
const config = require('./config.js');
import * as util from './util';
import Repo from './data/repo.js';
import Package from './data/package';
import * as connector from './connection/fetch';
import * as clone from './connection/clone';
import { report } from 'process';
import * as parser from './parser';

console.time(util.finished);

if (!config.token) {
    console.log(util.tokenError);
    process.exit(0);
}

const execute = async () => {
    let errors = 0;
    let packages: string[] = [];
    let promises: any[] = [];

    // Fetches every repo on Org and inserts them into an array of class Repo
    const repos = await parser.generateRepos();
    repos.forEach(async (repo, i) => {
        if (i < 100) {
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
                            repo.setFilteredDependencies();

                            // Deletes downloaded repo after parsing is complete
                            clone.delRepo(repo.fullName);
                            resolve();
                        }
                    });
                }).catch(() => null)
            );
        }
    });

    await util.trackProgress(promises, (p: number) => {
        console.log(util.repoProgress(p.toFixed(2)));
    }).then(() => {
        let allDep = {};
        let totalSize = 0;
        let totalDep = 0;
        repos.forEach((repo) => {
            if (Object.keys(repo.filteredDep).length > 0) {
                console.log(repo.filteredDep);
                allDep = { ...allDep, ...repo.filteredDep };
                totalDep += Object.keys(repo.filteredDep).length;
            }
            
            totalSize += +repo.size;
        });
        console.table([{Total_repos: repos.length, Total_size_MB: totalSize/(1000), N_dependencies: totalDep, Errors: errors}]);
    });

};

execute().then(() => console.timeEnd(util.finished));
