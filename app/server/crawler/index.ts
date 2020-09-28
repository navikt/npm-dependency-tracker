/* eslint-disable import/first */
require('dotenv').config();
// const log = require('why-is-node-running'); // should be your first require
import { Repo } from '@nav-frontend/shared-types';
import * as util from './util';

import Clone from './github/commands';
import Parse from './fileHandler/parser';
import { loadRepos, pLimiter } from './repoHandler';
import { writeData } from './fileHandler/file';
import * as config from './config';

/**
 * Todo: Better error handling when promise fails.
 * ? Add repo to reject and run them after?
 * ? Add reponame to reject and rum them again?
 * ? Only when X repos fail?
 */
export const execute = async () => {
    util.checkEnv();
    try {
        let repos: Repo[] = await loadRepos();

        // Dev mode, doesnt need to work on 2k repos
        if (process.argv.includes('--dev')) {
            if (repos.length > 13) repos = repos.splice(10, 3);
        }

        await pLimiter(repos, Clone);
        await pLimiter(repos, Parse);

        writeData(repos, config.outputDir, config.outputReposName);
    } catch (error) {
        console.log(error.message);
        process.exit(0);
    }
};

if (process.argv.includes('--noserver')) execute();
