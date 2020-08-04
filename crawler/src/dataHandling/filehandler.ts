const fs = require('fs');
const fg = require('fast-glob');
import rimraf from 'rimraf';
import * as config from '../config';

export const deleteRepoDir = (fullName: string) => {
    rimraf.sync(config.tmpDirName + '/' + fullName);
}

export const deleteTmpDir = () => {
    rimraf.sync(config.tmpDirName);
}

export const writeData = (data: {}) => {
    let json: string;
    try {
        json = JSON.stringify(data, null, 4);
        fs.writeFileSync(config.outputFile, json, 'utf8');
    } catch {
        console.log('Could not write data for repo');
    }
};

/**
 * Takes a relative path and tries to read the .json content
 * @param filename Relative path to .json file
 */
export const readDepFile = (filename: string): object => {
    let jsonData = {};
    const contents = fs.readFileSync(filename, 'utf8');
    try {
        jsonData = JSON.parse(contents);
    } catch (error) {
        console.log('Invalid JSON in: ' + filename);
    }
    return jsonData;
};

const generateGlob = (dep: string, dir: string) => {
    return dir + '/**/' + dep;
};

/**
 * Generates an array with the relative paths to dependency files.
 * @param dirName root directory to look into for dependency files
 */
export const findPackages = (dirName: string) => {
    // Filters out looking for dependiencies in blacklisted dirnames
    let whitelisted = true;
    config.blacklistDir.forEach((dir: string) => {
        if (dirName.indexOf(dir) !== -1) whitelisted = false;
    });

    let results: string[] = [];
    let files: string[];
    if (whitelisted) {
        config.depFiles.forEach((dep: string) => {
            //files = fg.sync(generateGlob(dep, dirName), {deep: 4});
            files = fg.sync(generateGlob(dep, dirName), {deep: 4});
            results = results.concat(files);
        });
    }

    return results;
};