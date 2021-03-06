import { Repo } from '@nav-frontend/shared-types';

import * as util from '../util';
const { exec } = require('child_process');
const fs = require('fs');

export const pull = (
    dir: string,
    cb: (value?: unknown) => void,
    reject: (value?: unknown) => void
) => {
    exec(`cd ${dir} && git pull`, (e: Error) => {
        if (e) {
            exec(
                `cd ${dir} && git rev-list --all -n 1`,
                (e: Error, data: string, out: string) => {
                    if (e) reject(e);
                    if (out.length === 0) {
                        cb();
                    } else {
                        reject(new Error('Error commands.ts l16'));
                    }
                }
            );
        } else {
            cb();
        }
    });
};

const clone = (repo: Repo) => {
    const url = util.generateCloneUrl(repo.cloneUrl);
    const dir = util.generateOutputDir(repo.name);
    return new Promise((resolve, reject) => {
        fs.access(dir, (err: Error) => {
            if (err) {
                exec(`git clone ${url} ${dir}`, (e: Error) => {
                    if (e) reject(e);
                    resolve();
                });
            } else {
                pull(dir, resolve, reject);
            }
        });
    });
};

export const checkOut = (dir: string, hash: string) => {
    return new Promise((resolve, reject) => {
        exec(`cd ${dir} && git checkout ${hash} --force`, (err: Error) => {
            if (err) reject(err);
            resolve();
        });
    });
};

export default clone;
