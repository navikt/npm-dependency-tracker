import Repo from '../types/repo';
import Package, { DiffType } from '../types/packages';
import * as util from '../util';
import * as config from '../config';
import CommitData from '../types/commits';
import { reject } from 'underscore';
import { Console } from 'console';
import { exit } from 'process';
import { promises } from 'fs';
const { gitToJs } = require('git-parse');
const gitDiff = require('parse-diff');
const { exec, execSync } = require('child_process');
const gitDiff2 = require('gitdiff-parser');
const glob = require('fast-glob');
const fs = require('fs');

const filterCommits = (commits: CommitData.Root[]) => {
    return commits.filter((commit) => {
        let fileChanges = [
            ...commit.filesAdded,
            ...commit.filesDeleted,
            ...commit.filesModified,
            ...commit.filesRenamed
        ];
        for (let x = 0; x < fileChanges.length; x++) {
            let path = fileChanges[x].path ? fileChanges[x].path : fileChanges[x].newPath;
            if (!path) return false;
            if (path.indexOf('package.json') !== -1) return true;
        }
        return false;
    });
};

const hasFile = async (dir: string) => {
    let files = await glob(`${dir}/**/package.json`);
    if (files.length === 0) return false;
    else return true;
};

const getPaths = async (dir: string) => {
    let files = await glob(`${dir}/**/package.json`);
    return files;
};

const checkOut = (dir: string, hash: string) => {
    return new Promise((resolve, reject) => {
        exec(`cd ${dir} && git checkout ${hash} --force`, (err: Error) => {
            if (err) reject(err);
            resolve();
        });
    });
};

/**
 * Takes a relative path and tries to read the .json content
 * @param filename Relative path to .json file
 */
const fetchPackage = (filename: string): object => {
    let jsonData = {};
    const contents = fs.readFileSync(filename, 'utf8');
    try {
        jsonData = JSON.parse(contents);
    } catch (error) {
        console.log('Invalid JSON in: ' + filename);
    }
    return jsonData;
};

const getAllPackages = async (repo: Repo, dir: string, bar: any) => {
    return new Promise(async (resolve, reject) => {
        if (repo.commits.length === 0 || repo.branch === '') {
            reject('ERROR');
        }
        bar.setTotal(repo.commits.length);
        bar.update(0);
        for (const commit of repo.commits) {
            await checkOut(dir, commit.hash).then(() => {});
            // todo get each package.json instance.
            const files = await getPaths(dir);
            let pack = [];
            for (const path of files) {
                const pa = fetchPackage(path);
                pack.push(pa);
            }
            commit.packages = pack;
            bar.increment();
        }

        // Resets branch
        await checkOut(dir, repo.branch);

        resolve();
    });
};

const commitParsing = async (dir: string, bar: any, multiBar: any, repo: Repo, reject: any) =>
    await gitToJs(dir)
        .then((commits: CommitData.Root[]) => {
            bar.update(3);
            // want the first commits to be at the start
            repo.commits = commits.reverse();
            return commits;
        })
        .then((commits: CommitData.Root[]) => {
            bar.update(4);
            // Filters out commits that doesn't change a set of files
            const fc = filterCommits(repo.commits);
            repo.commits = fc;
            return fc;
        })
        .then((commits: CommitData.Root[]) => {
            bar.update(5);
            let branch = util.getBranchName(dir);
            if (!branch) reject('Could not get branch name of: ' + dir);
            repo.branch = branch;
        })
        .catch((e: Error) => {
            multiBar.remove(bar);
            reject(repo.name);
        });

const parse = (repo: Repo, multiBar: any) => {
    const dir = util.generateOutputDir(repo.name);
    let bar = multiBar.create(3, 0);
    bar.update(0, { dir: repo.name.replace('navikt/', '') });

    return new Promise(async (resolve, reject) => {
        const f = await hasFile(dir);
        if (!f) {
            multiBar.remove(bar);
            resolve();
        } else {
            bar.update(1);
            await commitParsing(dir, bar, multiBar, repo, reject);
            bar.update(2);
            await getAllPackages(repo, dir, bar)
                .then(() => {
                    multiBar.remove(bar);
                    resolve();
                })
                .catch((e: any) => {
                    console.log(e);
                    multiBar.remove(bar);
                    reject(repo.name);
                });
        }
    });
};

export default parse;
