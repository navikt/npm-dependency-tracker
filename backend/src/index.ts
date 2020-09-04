require('dotenv').config();
const log = require('why-is-node-running'); // should be your first require
import * as util from './util';

import Repo from './types/repo';

/**
 * Todo: Make sure commits is in correct order before filtering out by last commit old->new
 * Todo: Makre sure old packages is saved to when only parsing new commits, currently only writes the new, deleting the old
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
