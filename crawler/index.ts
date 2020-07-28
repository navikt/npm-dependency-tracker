require('dotenv').config();
const config = require('./config.js');
import * as msg from './msg';
import Repo from './data/repo.js';
import Package from './data/package';
import * as connector from './connection/fetch';
import dlRepo from './connection/clone';
import { report } from 'process';
import * as parser from './parser';

console.time(msg.finished);

let downloading = false;
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
            if(i < 1) {
                
                dlRepo(repo.fullName).then(x => {
                    console.log("called");
                    console.log(x);
                    if(x === 1) {
                        console.log("Downloaded: " + repo.fullName);
                    }
                });
            }
            else {

            }
        });
}

execute().then(() => console.timeEnd(msg.finished));


