const config = require('../config.js');
import * as connector from '../api/fetch';
import Repo from '../dataHandling/repo.js';
import Package from '../dataHandling/package';

/**
 *
 * @param jsonObj Json object likely read from package.json file types
 * @param location Relative path to the file for that dependency file(for filtering out blaclisted dir)
 */
export const parseDepFile = (jsonObj: any, location: string) => {
    return new Package(
        jsonObj!.name,
        location,
        jsonObj!.dependencies,
        jsonObj!.devDependencies,
        jsonObj!.peerDependencies
    );
};

/**
 * Fetches all org repos from github and inserts them into the Repo class
 */
export const generateRepos = async () => {
    const rawRepos = await connector.getAllRepos();
    return rawRepos
        .filter((repo) => {
            if (config.blacklistRepo.includes(repo.name)) {
                return false;
            } else if (
                [repo.full_name, repo.html_url, repo.size, repo.updated_at, repo.default_branch, repo.language].includes(undefined)
            ) {
                return false;
            } else if (+repo.size === 0) {
                return false;
            }
            return true;
        })
        .map((repo) => {
            return new Repo(repo.full_name, repo.html_url, repo.size, repo.updated_at, repo.default_branch, repo.language);
        });
};

