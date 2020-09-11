import { Repo, CommitData } from '@nav-frontend/shared-types';
import * as util from '../util';
import { checkOut } from '../github/commands';
import { fetchPackage } from './file';
const { gitToJs } = require('git-parse');

/**
 * Checkout hash each commit then reads each package.json into commit.packages
 */
const fetchCommitPackages = async (repo: Repo, dir: string) => {
    return new Promise(async (resolve, reject) => {
        // Reset branch
        await checkOut(dir, repo.branch).catch(() => reject(repo.name));

        const newCommits = util.removeOldCommits(repo.commits, repo.lastCommit);
        for (const commit of newCommits) {
            let pack = [];

            await checkOut(dir, commit.hash).catch(() => reject(repo.name));
            const files = await util.getPackagePaths(dir);
            for (const path of files) {
                if (path.indexOf('node_modules') !== -1) {
                    if (repo.name !== 'navikt/nav-frontend-moduler') continue;
                }
                const pa = fetchPackage(path);
                pack.push(pa);
            }
            commit.packages = pack;
            repo.lastCommit = commit.hash;
        }

        // Resets branch
        await checkOut(dir, repo.branch).catch(() => reject(repo.name));

        resolve();
    });
};

/**
 * Gets all the commits from a given repo and filters out unwanted commit instances
 */
const commitParsing = async (dir: string, repo: Repo, reject: any) => {
    await gitToJs(dir, { sinceCommit: repo.lastCommit ? repo.lastCommit : undefined })
        .then((commits: CommitData.Root[]) => {
            let filtered = util.filterCommits(commits).reverse();

            filtered = util.removeOldCommits(filtered, repo.lastCommit);
            repo.commits = repo.commits ? [...repo.commits, ...filtered] : filtered;
        })
        .catch(() => {
            reject(repo.name);
        });
};

/**
 * Goes trough all commits performed a repo and gets the package.json
 * file for each of them when it was to be made/modified.
 *
 * @param repo A spesific repo[] obj
 */
const parse = (repo: Repo) => {
    const dir = util.generateOutputDir(repo.name);

    return new Promise(async (resolve, reject) => {
        const containsPackage = await util.hasPackages(dir);

        // Filters out each repo that doesn´t currently contain a package.json file
        if (!containsPackage) {
            resolve();
        } else {
            // Gets a [] of all commits
            await commitParsing(dir, repo, reject);

            // Fetches each package.json instance in each commit that it was changed in
            await fetchCommitPackages(repo, dir)
                .then(async () => {
                    const files = await util.getPackagePaths(dir);
                    let pack = [];
                    for (const path of files) {
                        const pa = fetchPackage(path);
                        pack.push(pa);
                    }
                    repo.packages = pack;
                    resolve();
                })
                .catch((e: any) => {
                    reject(repo.name);
                });
        }
    });
};

export default parse;
