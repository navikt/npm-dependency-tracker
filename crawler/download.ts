import * as config from './config';
import git_dl from 'download-git-repo';
import Repo from './data/repo';
import * as parser from './parser';
import * as clone from './connection/clone';
// Downloads the given repo with proper OAuth
const downloadRepo = (repo: Repo, callback: Function = () => null) => {
    if (repo.url === '' || repo.mainBranch === '') return;
    git_dl(
        repo.url + '/archive/' + repo.mainBranch + '.zip',
        config.tmpDirName + '/' + repo.fullName,
        {
            headers: {
                Authorization: `token ${config.token}`,
                'User-Agent': config.userAgent
            }
        },
        callback
    );
};

export const download = (repo: Repo) => {
    return new Promise((resolve, reject) => {
        // Downloads repo from github locally
        let packages;
        downloadRepo(repo, (error?: Error) => {
            if (error) {
                reject(error);
            } else {
                packages = parser.findPackages(config.tmpDirName + '/' + repo.fullName);
                packages.forEach((name) => {
                    repo.addPackage(parser.parseDepFile(parser.readDepFile(name), name));
                });
                // Deletes downloaded repo after parsing is complete
                clone.delRepo(repo.fullName);
                resolve();
            }
        });
    });
};
