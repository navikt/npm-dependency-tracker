require('dotenv').config();
import * as util from './util';
import * as config from './config';
const clone = require('git-clone');
const { gitToJs, gitDiff } = require('git-parse');
const fs = require('fs');
const path = require('path');
const process = require('process');

const gitBlame = require('git-blame');
import gitlog, { GitlogOptions } from 'gitlog';
const exec = require('child_process').exec;
const parse = require('parse-diff');

const nodeCmd = require('node-cmd');
const log = require('why-is-node-running'); // should be your first require

import Repo from './types/repo';

const run = async () => {
    let repos: Repo[] | undefined = await Repo.getAllRepos();

    if (repos === undefined) return -1;

    repos = util.filterBlacklisted(repos);
    //    Lets just check the data for one repo for testings sake
    // repos = repos.filter((repo) => {
    //     if (repo.name.indexOf('nav-frontend-icons') !== -1) return true;
    //     else return false;
    // });

    // await Repo.clone(repos);
    await Repo.parseCommits(repos);
    let x = 0;

    repos.forEach((repo) => {
        x += repo.commits.length;
    });
    console.log('Commits: ' + x);
    return 1;
};

const execute = async () => {
    const apprunner = await run();
    if (apprunner === -1) {
        console.log('Runner failed!');
    }
    console.log('Should be completed');
};

util.checkEnv();

execute();
