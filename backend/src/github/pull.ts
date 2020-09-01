import { resolve } from 'path';

const { exec } = require('child_process');

export const pull = (
    dir: string,
    cb: (value?: unknown) => void,
    reject: (value?: unknown) => void
) => {
    exec(`cd ${dir} && git pull`, (e: Error) => {
        if (e) {
            exec(`cd ${dir} && git rev-list --all -n 1`, (e: Error, data: string, out: string) => {
                if (e) reject(dir);
                if (out.length === 0) {
                    cb();
                } else {
                    reject(dir);
                }
            });
        } else {
            cb();
        }
    });
};
