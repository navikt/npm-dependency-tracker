import Packagejson from './package';
import { last } from 'underscore';
const config = require('../config.js');

export default class Repo {
    fullName: string;
    url: string;
    size: string;
    lastActivity: string;
    packages: Packagejson[];
    filteredDep: { [key: string]: any };

    constructor(fullName: string = '', url: string = '', size: string = '', lastActivity: string = '') {
        this.fullName = fullName;
        this.url = url;
        this.size = size;
        this.lastActivity = lastActivity;
        this.packages = [];
        this.filteredDep = {};
    }

    addPackage(pack: Packagejson) {
        this.packages.push(pack);
    }

    setFilteredDependencies() {
        const depFilter: string[] = config.depPackages;
        let deps:{ [key: string]: any } = {};
        this.packages.forEach((pack) => {
            deps = { ...deps, ...pack.devDependencies, ...pack.dependencies, ...pack.peerDependencies };
        });

        const filtered = Object.keys(deps)
            .filter((key) => depFilter.includes(key))
            .reduce((obj, key) => {
                return {
                  ...obj,
                  [key]: deps[key]
                };
              }, {});

        this.filteredDep = filtered;
    }

    logInfo(): void {
        console.table([{ name: this.fullName, url: this.url, size: this.size }]);
    }
}
