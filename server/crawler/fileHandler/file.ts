const fs = require('fs');
const mkdirp = require('mkdirp');
const config = require('../config');

import { Repo } from '@nav-frontend/shared-types';

const fetchJson = () => {
    try {
        const data = fs.readFileSync(`${config.outputRepos}`, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

export const reposFromFile = async () => {
    return (await fetchJson()) as Repo[];
};

export const fetchPackage = (filename: string): object => {
    let jsonData = {};
    const contents = fs.readFileSync(filename, 'utf8');
    try {
        jsonData = JSON.parse(contents);
    } catch (error) {}
    return jsonData;
};

export const writeData = (data: any, dir: string, fileName: string) => {
    let json: string;
    try {
        json = JSON.stringify(data, null, 4);
        mkdirp.sync(dir);
        fs.writeFileSync(dir + '/' + fileName, json, 'utf8');
    } catch (e) {
        console.log(e);
        console.log('Could not write repos to disk');
    }
};
