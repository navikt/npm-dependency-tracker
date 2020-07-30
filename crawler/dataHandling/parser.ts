const fs = require('fs');
const glob = require('glob');
const config = require('./config.js');
import * as connector from '../api/fetch';
import Repo from '../dataHandling/repo.js';
import Package from '../dataHandling/package';

/**
 * 
 * @param jsonObj Json object likely read from package.json file types
 * @param location Relative path to the file for that dependency file(for filtering out blaclisted dir)
 */
export const parseDepFile = (jsonObj: any, location:string) => {
    return new Package(jsonObj!.name, location, jsonObj!.dependencies, jsonObj!.devDependencies, jsonObj!.peerDependencies);
}

/**
 * Takes a relative path and tries to read the .json content 
 * @param filename Relative path to .json file
 */
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

/**
 * Generates an array with the relative paths to dependency files.
 * @param dirName root directory to look into for dependency files
 */
export const findPackages = (dirName:string) => {

    // Filters out looking for dependiencies in blacklisted dirnames
    let whitelisted = true;
    config.blacklistDir.forEach((dir:string) => {
        if(dirName.indexOf(dir) !== -1) whitelisted = false;
    });

    let results:string[] = [];
    let files:string[];
    if(whitelisted) {
        config.depFiles.forEach((dep: string) => {
            files = glob.sync(generateGlob(dep, dirName), {});
            results = results.concat(files);
        });
    }
   
    return results;
}
/**
 * Fetches all org repos from github and inserts them into the Repo class
 */
export const generateRepos = async () => {
    const parsedRepos: Repo[] = [];

    const rawRepos = await connector.getAllRepos();
    rawRepos.forEach((repo) => {
        // Filters out the blacklisted repos
        if(config.blacklistRepo.includes(repo.name)) return;
        if([repo.full_name, repo.html_url, repo.size, repo.updated_at, repo.default_branch].includes(undefined)) return;
        
        parsedRepos.push(new Repo(repo.full_name, repo.html_url, repo.size, repo.updated_at, repo.default_branch));
    });

    return parsedRepos;
}

export const batchRepos = (repos:Repo[]):Repo[][] => {
    
    let n;
    let [...arr]  = repos;
    let res = [];
    while (arr.length) {
        n = arr.length < config.batchSize ? arr.length : config.batchSize;
        res.push(arr.splice(0, n));
    }
    return res;
      
}

export const writeData = (data:{}) => {
    let json:string;
    try {
        json = JSON.stringify(data);
        fs.writeFileSync(config.outputFile, json, 'utf8');
    }
    catch {
        console.log("Could not write data for repo")
    }
}