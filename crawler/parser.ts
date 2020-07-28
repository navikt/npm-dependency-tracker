const fs = require('fs');
const glob = require('glob');
const config = require('./config.js');
import * as connector from './connection/fetch';
import Repo from './data/repo.js';
import Package from './data/package';

export const parseDepFile = (jsonObj: any, location:string) => {
    const pack = new Package(jsonObj.name, location, jsonObj.dependencies, jsonObj.devDependencies, jsonObj.peerDependencies);
    return pack;
}

export const readDepFile = (filename:string):object => {
    let jsonData = {};
    const contents = fs.readFileSync(filename, 'utf8');
    try {
        jsonData = JSON.parse(contents);
    }
    catch(error){
        console.log("Invalid JSON in: " + filename);
    }
    return jsonData;
}


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