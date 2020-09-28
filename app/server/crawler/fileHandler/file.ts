const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

export const filereadJson = (pathing: string = ''): any[] | {} => {
    if (pathing === '') return [];

    const p = path.resolve(process.cwd(), pathing);
    return JSON.parse(fs.readFileSync(p, 'utf8'));
};

export const writeData = (data: any, dir: string, filename: string) => {
    const dirpath = path.resolve(process.cwd(), dir);
    mkdirp.sync(dirpath);
    const json = JSON.stringify(data);
    fs.writeFileSync(dirpath + '/' + filename, json, 'utf8');
    console.log(
        `Wrote ${Math.ceil(Buffer.byteLength(json) / 1024 / 1024)}Mb to output`
    );
};
