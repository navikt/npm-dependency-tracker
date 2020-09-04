require('dotenv').config();
const log = require('why-is-node-running'); // should be your first require
import * as util from './util';

import Repo from './types/repo';

/**
 * Todo: read repos from outputRepos if avaliable
 * Todo: Only check commits for new commits
 * Todo: make sure branch is more accurate/stable
 * Todo: Refactor code placement/structure
 */
const run = async () => {
    let repos: Repo[] | undefined = await Repo.loadRepos();

    if (repos === undefined) return -1;

    repos = util.filterBlacklisted(repos);
    //    Lets just check the data for one repo for testings sake
    // repos = repos.filter((repo) => {
    //     if (repo.name.indexOf('nav-frontend-icons') !== -1) return true;
    //     else return false;
    // });

    await Repo.clone(repos);
    await Repo.parse(repos);
    Repo.save(repos);

    return 1;
};

const execute = async () => {
    const apprunner = await run();
    if (apprunner === -1) {
        console.log('Runner failed!');
    }

    // log();
};

util.checkEnv();

execute();
