/* eslint-disable import/first */
require('dotenv').config();
// const log = require('why-is-node-running'); // should be your first require
import { Repo } from '@nav-frontend/shared-types';
import * as util from './util';
const fs = require('fs');

import { loadRepos, clone, parse, save } from './repoHandler';

const run = async () => {
    let repos: Repo[] | undefined = await loadRepos();
    if (repos === undefined) return -1;

    // Dev mode, doesnt need to work on 2k repos
    if (process.argv.includes('--dev')) repos.length = repos.length > 10 ? 10 : repos.length;

    repos = util.filterBlacklisted(repos);

    const update = await clone(repos);
    const parsing = await parse(repos);
    let errors = update.concat(parsing);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    errors.length > 0
        ? fs.writeFileSync('Errors.log', JSON.stringify(errors.map((e) => e.message)), 'utf8')
        : null;

    save(repos);

    return 1;
};

/**
 * Todo: Better error handling when promise fails.
 * ? Add repo to reject and run them after?
 * ? Add reponame to reject and rum them again?
 * ? Only when X repos fail?
 */
export const execute = async () => {
    util.checkEnv();
    const apprunner = await run();
    if (apprunner === -1) {
        console.log('Runner failed!');
    }
};

if (process.argv.includes('--noserver')) execute();
