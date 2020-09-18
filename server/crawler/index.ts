require('dotenv').config();
const log = require('why-is-node-running'); // should be your first require
import { Repo } from '@nav-frontend/shared-types';
import * as util from './util';

import { loadRepos, clone, parse, cleanCommits, save, saveCurrent } from './repoHandler';

const run = async () => {
    let repos: Repo[] | undefined = await loadRepos();

    if (repos === undefined) return -1;

    repos = util.filterBlacklisted(repos);

    // repos = repos.filter((repo) => {
    //     if (repo.name === 'navikt/nav-frontend-icons') return true;
    //     return false;
    // });
    const update = await clone(repos);
    const parsing = await parse(repos);
    let errors = update.concat(parsing);

    errors.length > 0 ? console.log('Errors: ' + errors) : null;

    save(repos);

    return 1;
};

/**
 * Todo: Better error handling when promise fails.
 * ? Add repo to reject and run them after?
 * ? Add reponame to reject and rum them again?
 * ? Only when X repos fail?
 */
const execute = async () => {
    const apprunner = await run();
    if (apprunner === -1) {
        console.log('Runner failed!');
    }
};

util.checkEnv();

execute();
