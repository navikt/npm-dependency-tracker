const fs = require('fs');
const config = require('../config');
import Repo from '../types/repo';

const util = require('util');
const fsPromises = fs.promises;
namespace Load {
    const fetchJson = () => {
        try {
            const data = fs.readFileSync(`../../${config.outputFile}`, 'utf8');
            return JSON.parse(data);
        } catch(e) {
            return [];
        }
    }

    export const ReposFromFile = () => {
        return fetchJson() as Repo[];
    };
}

export default Load;
