require('dotenv').config();
const config = require('./config.js');
import * as msg from './msg';
import Repo from './data/repo.js';
import Package from './data/package';
import * as con from './connection/fetch';
import dlRepo from './connection/clone';

console.time(msg.finished);

if (!config.token) {
    console.log(msg.tokenError);
    process.exit(0);
}

con.getAllRepos();
// dlRepo('navikt/eessi-pensjon-saksbehandling-ui2');
// const repo = new Repo("DS_REPO", "https://api.github.com/xyz");

//con.testFetching();


