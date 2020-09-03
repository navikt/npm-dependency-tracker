import * as config from '../config';
const fs = require('fs');

export const writeData = (data: any) => {
    let json: string;
    try {
        json = JSON.stringify(data, null, 4);
        fs.writeFileSync(config.outputFile, json, 'utf8');
    } catch {
        console.log('Could not write repos to disk');
    }
};
