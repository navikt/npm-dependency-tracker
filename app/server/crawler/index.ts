/* eslint-disable import/first */
require('dotenv').config();
// const log = require('why-is-node-running'); // should be your first require
import { Repo } from '@nav-frontend/shared-types';
import * as util from './util';

import { loadRepos, clone, parse } from './repoHandler';
import { writeData } from './fileHandler/file';
import * as config from './config';

const run = async () => {
    try {
        let repos: Repo[] = await loadRepos();

        // Dev mode, doesnt need to work on 2k repos
        if (process.argv.includes('--dev')) {
            repos = repos.splice(10, 3);
        }

        repos = util.filterBlacklisted(repos);

        await clone(repos);
        await parse(repos);

        writeData(repos, config.outputDir, config.outputReposName);

        return 1;
    } catch (error) {
        console.log(error.message);
        process.exit(0);
    }
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
