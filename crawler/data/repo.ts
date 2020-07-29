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
    mainBranch: string;
    processed: boolean;

    constructor(
        fullName: string = '',
        url: string = '',
        size: string = '',
        lastActivity: string = '',
        branch: string = ''
    ) {
        this.fullName = fullName;
        this.url = url;
        this.size = size;
        this.lastActivity = lastActivity;
        this.packages = [];
        this.filteredDep = {};
        this.mainBranch = branch;
        this.processed = false;
    }

    addPackage(pack: Packagejson) {
        this.packages.push(pack);
        this.processed = true;
    }

    getData = () => {
        return {
            name: this.fullName,
            url: this.url,
            size: this.size,
            activity: this.lastActivity,
            branch: this.mainBranch,
            packages: this.packages.map((pack) => {
                return pack.getData();
            })
        };
    };
    /**
     * Filters out the unwanted dependencies based on the config.
     * ? Move out to separate filter class/ file
     */
    /* 
    setFilteredDependencies() {
        
        const depFilter: string[] = config.depPackages;
        let deps: { [key: string]: any } = {};
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
    */
}
