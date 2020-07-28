const fs = require('fs');
const glob = require('glob');

const config = require('./config.js');
import * as connector from './connection/fetch';
import Repo from './data/repo.js';


const generateGlob = (dep:string, dir:string) => {
    return (dir + '/**/' + dep);
}
export const findPackages = (dirName:string) => {

    let results:string[] = [];
    let files:string[];
    config.depFiles.forEach((dep: string) => {
        files = glob.sync(generateGlob(dep, dirName), {});
        results = results.concat(files);
    });
    return results;
}

export const generateRepos = async () => {
    let totalSize = 0;
    const parsedRepos: Repo[] = [];

    const rawRepos = await connector.getAllRepos();
    rawRepos.forEach((repo) => {
        parsedRepos.push(new Repo(repo.full_name, repo.html_url, repo.size, repo.updated_at));
        totalSize += +repo.size;
    });
    console.table([{Total_repos: parsedRepos.length, Total_size_MB: totalSize/(1000)}]);

    return parsedRepos;
}