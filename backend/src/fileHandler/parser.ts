import Repo from '../types/repo';
import Package, { DiffType } from '../types/packages';
import * as util from '../util';
import * as config from '../config';
import CommitData from '../types/commits';
const { gitToJs } = require('git-parse');
const gitDiff = require('parse-diff');
const { exec, execSync } = require('child_process');
const gitDiff2 = require('gitdiff-parser');
const glob = require('fast-glob');

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

const filterDiffs = (diff: any) => {
    return diff.filter((file: any) => {
        const path = file.oldPath + file.newPath;
        if (!path) return false;
        if (util.stringsInText(config.files, path)) {
            return true;
        } else return false;
    });
};

const getDiff = async (hash: string, dir: string) => {
    return new Promise((resolve, reject) => {
        exec(
            `cd ${dir} && git show ${hash}`,
            { maxBuffer: 1024 * 1024 * 100 },
            (err: Error, data: string, out: string) => {
                // console.count('Git show calls ');
                if (err) reject(err);
                resolve(gitDiff2.parse(data));
            }
        );
    });
};

const getAllDiffs = async (commits: CommitData.Root[], dir: string) => {
    for (let x = 0; x < commits.length; x++) {
        let diff = await getDiff(commits[x].hash, dir).catch((e) => console.log(e));
        if (!diff) continue;
        commits[x].diffs = filterDiffs(diff);
    }
    return commits;
};

const hasFile = async (dir: string) => {
    let files = await glob(`${dir}/**/package.json`);
    if (files.length === 0) return false;
    else return true;
};

const parse = (repo: Repo, multiBar: any) => {
    const dir = util.generateOutputDir(repo.name);
    let bar = multiBar.create(10, 0);
    bar.update(1, { dir: repo.name.replace('navikt/', '') });

    return new Promise(async (resolve, reject) => {
        const f = await hasFile(dir);
        if (!f) {
            multiBar.remove(bar);
            resolve();
        }
        bar.update(2);
        await gitToJs(dir)
            .then((commits: CommitData.Root[]) => {
                bar.update(3);
                // want the first commits to be at the start
                repo.commits = commits.reverse();
                return commits;
            })
            .then((commits: CommitData.Root[]) => {
                // Filters out commits that doesn't change a set of files
                const fc = filterCommits(repo.commits);
                repo.commits = fc;
                return fc;
            })
            .then((commits: CommitData.Root[]) => {
                let branch = util.getBranchName(dir);
                if (!branch) {
                    reject('Could not get branch name of: ' + dir);
                }
                repo.branch = branch;
            })
            .then((commits: CommitData.Root[]) => {})
            .then(() => {
                multiBar.remove(bar);
                resolve();
            })
            .catch((e: Error) => {
                reject(repo.name);
            });
    });
};

export default parse;
