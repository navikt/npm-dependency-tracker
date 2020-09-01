require('dotenv').config();
import * as util from './util';
import * as config from './config';
const cliProgress = require('cli-progress');
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
    const repos: Repo[] | undefined = await Repo.getAllRepos();

    if (repos === undefined) return -1;

    // await Repo.clone(repos);
    await Repo.parseCommits(repos);

    //             let command = `cd repoOUT/${name} && git show ${allHashes[0]}`;
    //             child = exec(command, function (
    //                 error: any,
    //                 stdout: any
    //             ) {
    //                 if (!error) {
    //                     const files = parse(stdout);

    //                     files.forEach((file: any) => {
    //                       console.log("Chunk length: " + file.chunks.length);
    //                         // console.log("Chunk[0].changes: " +
    //                         //     file.chunks[0].changes
    //                         //         .length
    //                         // ); // hunk added/deleted/context lines
    //                         // console.log(
    //                         //     file.chunks[0].changes
    //                         // );
    //                     });
    //                     // console.log(files.length);
    //                 }
    //             });
    //     });
};

const execute = async () => {
    const apprunner = await run();
    if (apprunner === -1) {
        console.log('Runner failed!');
    } else {
        console.log('Runner finished!');
    }
};

util.checkEnv();

execute();
