import Repo from '../types/repo';
import Package, { DiffType } from '../types/packages';
import * as util from '../util';
import CommitData from '../types/commits';
const { gitToJs, gitDiff } = require('git-parse');

const parse = (repo: Repo) => {
    const commitsPromise = gitToJs(util.generateOutputDir(repo.name));
    return new Promise((resolve, reject) => {
        try {
            commitsPromise.then((commits: CommitData.Root[]) => {
                repo.commits = commits;
                const validCommits = commits.filter((commit) => {
                    let fileChanges = [
                        ...commit.filesAdded,
                        ...commit.filesDeleted,
                        ...commit.filesModified,
                        ...commit.filesRenamed
                    ];
                    for (let x = 0; x < fileChanges.length; x++) {
                        let path = fileChanges[x].path
                            ? fileChanges[x].path
                            : fileChanges[x].newPath;
                        if (!path) return false;
                        if (path.indexOf('package.json') !== -1) return true;
                    }
                    return false;
                });

                // TODO: Run git diff on validcommits
                resolve();
            });
        } catch (e) {
            reject();
        }
    });
};

export default parse;
