import { stderr } from 'process';

const fs = require('fs');
const nodeCmd = require('node-cmd');
const { exec } = require('child_process');

const clone = (url: string, dir: string) => {
    return new Promise((resolve, reject) => {
        fs.access(dir, (err: Error) => {
            if (err) {
                exec(`git clone ${url} ${dir}`, (e: Error) => {
                    if (e) reject(url);
                    resolve();
                });
            } else {
                resolve();
            }
        });
    });
};

export default clone;
