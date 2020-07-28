require('dotenv').config();
const config = require('./config.js');
import * as msg from './msg';
import Repo from './data/repo.js';
import Package from './data/package';
import * as connector from './connection/fetch';
import * as clone from './connection/clone';
import { report } from 'process';
import * as parser from './parser';

console.time(msg.finished);

if (!config.token) {
    console.log(msg.tokenError);
    process.exit(0);
}

const execute = async () => {
    let errors = 0;
    let packages: string[] = [];
    let promises: any[] = [];
    let dep = {};
    const repos = await parser.generateRepos();
    repos.forEach(async (repo, i) => {
        if (i < 20) {
            promises.push(
                new Promise((resolve, reject) => {
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
                            //clone.delRepo(repo.fullName);
                            console.log(msg.repoProgress(i + 1, repos.length));
                            resolve();
                        }
                    });
                })
            );
        } else {
        }
    });
    await Promise.all(promises).then(()=> {
        repos.forEach(repo => {
            if(Object.keys(repo.filteredDep).length > 0){
            }
        });
    })
};

execute().then(() => console.timeEnd(msg.finished));
