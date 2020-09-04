const fs = require('fs');
const config = require('../config');
import Repo from '../types/repo';

namespace LoadRepos {
    const fetchJson = () => {
        try {
            const data = fs.readFileSync(`${config.outputRepos}`, 'utf8');
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    };

    export const reposFromFile = () => {
        return fetchJson() as Repo[];
    };

    export const fetchPackage = (filename: string): object => {
        let jsonData = {};
        const contents = fs.readFileSync(filename, 'utf8');
        try {
            jsonData = JSON.parse(contents);
        } catch (error) {}
        return jsonData;
    };
}

export default LoadRepos;
