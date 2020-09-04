import * as config from '../config';
import { Console } from 'console';
const fs = require('fs');

export const writeData = (data: any) => {
    console.log('Writing repos to disk');
    let json: string;
    try {
        json = JSON.stringify(data, null, 4);
        fs.writeFileSync(config.outputRepos, json, 'utf8');
    } catch {
        console.log('Could not write repos to disk');
    }
};
