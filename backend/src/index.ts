require('dotenv').config();
const log = require('why-is-node-running'); // should be your first require
import * as util from './util';

import Repo from './types/repo';

const run = async () => {
    let repos: Repo[] | undefined = await Repo.loadRepos();

    if (repos === undefined) return -1;

    repos = util.filterBlacklisted(repos);

    const update = await Repo.clone(repos);
    const parsing = await Repo.parse(repos);
    update.concat(parsing);

    update.length > 0 ? console.log('Errors: ' + parsing) : null;

    Repo.save(repos);

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
