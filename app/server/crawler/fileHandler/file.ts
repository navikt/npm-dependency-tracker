import { Repo } from '@nav-frontend/shared-types';
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const config = require('../config');

export const filereadJson = (pathing: string = ''): any[] | {} => {
    if (pathing === '') return [];

    const p = path.resolve(process.cwd(), pathing);
    return JSON.parse(fs.readFileSync(p, 'utf8'));
};

export const writeData = (data: any, dir: string, filename: string) => {
    const dirpath = path.resolve(process.cwd(), dir);
    mkdirp.sync(dirpath);
    fs.writeFileSync(dirpath + '/' + filename, JSON.stringify(data), 'utf8');
    console.log(dirpath + '/' + filename);
    console.log(process.cwd());
};
