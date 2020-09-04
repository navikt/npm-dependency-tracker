import Repo from '../types/repo';
import * as util from '../util';
import { checkOut } from '../github/commands';
import CommitData from '../types/commits';
import Load from './loader';
const { gitToJs } = require('git-parse');

/**
 * Checkout hash each commit then reads each package.json into commit.packages
 */
const fetchCommitPackages = async (repo: Repo, dir: string, bar: any) => {
    return new Promise(async (resolve, reject) => {
        // Reset branch
        await checkOut(dir, repo.branch);

        for (const commit of repo.commits) {
            let pack = [];

            await checkOut(dir, commit.hash);
            const files = await util.getPackagePaths(dir);

            for (const path of files) {
                const pa = Load.fetchPackage(path);
                pack.push(pa);
            }
            commit.packages = commit.packages ? [...commit.packages, ...pack] : pack;
            repo.lastCommit = commit.hash;
            bar.increment();
        }

        // Resets branch
        await checkOut(dir, repo.branch);

        resolve();
    });
};

/**
 * Gets all the commits from a given repo and filters out unwanted commit instances
 */
const commitParsing = async (dir: string, bar: any, multiBar: any, repo: Repo, reject: any) => {
    await gitToJs(dir)
        .then((commits: CommitData.Root[]) => {
            let filtered = util.filterCommits(commits).reverse();
            filtered = util.removeOldCommits(filtered, repo.lastCommit);
            repo.commits = filtered;
        })
        .catch(() => {
            multiBar.remove(bar);
            reject(repo.name);
        });
};

/**
 * Goes trough all commits performed a repo and gets the package.json
 * file for each of them when it was to be made/modified.
 *
 * @param repo A spesific repo[] obj
 * @param multiBar a cli-progress multibar instance
 */
const parse = (repo: Repo, multiBar: any) => {
    const dir = util.generateOutputDir(repo.name);
    let bar = multiBar.create(9999, 0);
    bar.update(0, { dir: repo.name.replace('navikt/', '') });

    return new Promise(async (resolve, reject) => {
        const containsPackage = await util.hasPackages(dir);

        // Filters out each repo that doesn´t currently contain a package.json file
        if (!containsPackage) {
            multiBar.remove(bar);
            resolve();
        } else {
            // Gets a [] of all commits
            await commitParsing(dir, bar, multiBar, repo, reject);

            bar.setTotal(repo.commits.length);
            // Fetches each package.json instance in each commit that it was changed in
            await fetchCommitPackages(repo, dir, bar)
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
