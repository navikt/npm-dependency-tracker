import * as config from '../config';
const git_dl = require('download-git-repo');
import Repo from '../dataHandling/repo';
import { readDepFile, findPackages } from '../dataHandling/filehandler';
import * as parser from '../dataHandling/parser';

import { deleteRepoDir } from '../dataHandling/filehandler';

// Downloads the given repo with proper OAuth
const downloadRepo = (repo: Repo, callback: Function = () => null) => {
    if (repo.url === '' || repo.mainBranch === '') return;
    git_dl(
        'direct:' + repo.url + '/archive/' + repo.mainBranch + '.zip',
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
        // Sets starttime
        repo.setProcessTime(new Date().getTime());

        // Downloads repo from github locally
        let packages;
        downloadRepo(repo, (error?: Error) => {
            if (error) {
                reject(repo);
            } else {
                packages = findPackages(config.tmpDirName + '/' + repo.fullName);
                packages.forEach((name) => {
                    repo.addPackage(parser.parseDepFile(readDepFile(name), name));
                });
                // Deletes downloaded repo after parsing is complete
                deleteRepoDir(repo.fullName);
                repo.setProcessTime(new Date().getTime() - repo.processTime);
                resolve();
            }
        });
    });
};
