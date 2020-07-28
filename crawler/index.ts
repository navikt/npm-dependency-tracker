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
    const repos = await parser.generateRepos();
    repos.forEach(async(repo, i) => {
        // Download repo
        // Find package.jsons in repo
        // Read dependencies from repo
            if(i < 1 && i >= 0) {
                await clone.dlRepo(repo.fullName, (error?:Error) => {
                    if(error){
                        console.log(error.message)
                    }
                    else {
                        console.log(msg.repoProgress(i+1, repos.length));
                        console.log(parser.findPackages(config.tmpDirName + '/' + repo.fullName));
                        //clone.delRepo(repo.fullName);
                        
                    }
                });
            }
            else {

            }
        });
}

execute().then(() => console.timeEnd(msg.finished));


