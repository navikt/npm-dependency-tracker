require('dotenv').config();
import * as util from './util';
import * as config from './config';
const cliProgress = require('cli-progress');
const clone = require('git-clone');
const { gitToJs, gitDiff } = require('git-parse');
const fs = require('fs');
const path = require('path');
const process = require('process');
import pLimit from 'p-limit';

const gitBlame = require('git-blame');
import gitlog, { GitlogOptions } from 'gitlog';
const exec = require('child_process').exec;
const parse = require('parse-diff');

const nodeCmd = require('node-cmd');
const log = require('why-is-node-running'); // should be your first require

import Repo from './types/repo';
import Imports from './types/imports';
import Package from './types/packages';
import Git from './types/githubApi';
import fetchRepos from './github/fetch';
import Load from './fileHandler/loader';
import Clone from './github/clone';

const run = async () => {
    const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

    const repos: Repo[] | undefined = await Repo.getAllRepos();

    if (repos === undefined) {
        return -1;
    }

    const limiter = pLimit(config.concurrent);

    let promisess: Promise<unknown>[] = repos.map((repo: Repo) => {
        return limiter(() =>
            Clone(
                util.generateCloneUrl(repo.cloneUrl),
                util.generateOutputDir(repo.name)
            ).catch((url: string) => console.log(url))
        );
    });

    bar1.start(100, 0);
    await util.trackProgress(promisess, (p: number) => {
        bar1.update(+p.toFixed(1));
    });
    bar1.stop();

    // TODO: Parse commits

    // const commitsPromise = gitToJs(`./repoOUT/${name}`);
    // commitsPromise
    //     .then((commits: any) => {
    //         commits.forEach((commit: any) => {
    //             allHashes.push(commit.hash);
    //             console.log(commit.filesAdded);
    //         });
    //         // console.log(allHashes);
    //     })
    //     .then(() => {
    //         console.log(allHashes);

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

util.checkEnv();

run();
