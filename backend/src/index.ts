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
    //     if (repo.name === 'navikt/bidrag-dokument-ui') return true;
    //     else return false;
    // });

    const update = await Repo.clone(repos);
    const parsing = await Repo.parse(repos);

    console.log('Cloning/updating errors');
    update.forEach((url: string) => {
        console.log(url);
    });
    console.log('Parser errors');
    parsing.forEach((url: string) => {
        console.log(url);
    });
    //    Repo.save(repos);

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

    // log();
};

util.checkEnv();

execute();
