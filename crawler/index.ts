const config = require('./config.js');
import * as msg from './msg';
import Repo from './data/repo.js';
import Package from './data/package';
import * as con from './connection/fetch';

console.time(msg.finished);

if (!config.token) {
    console.log(msg.tokenError);
    process.exit(0);
}


const repo = new Repo("DS_REPO", "https://api.github.com/xyz");
repo.logInfo();


console.timeEnd(msg.finished);
