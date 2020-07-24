const union = require('underscore');

export interface dependency {
    name: string;
    version: string;
}

export default class Packagejson {
    name: string;
    url: string;
    dependencies: dependency[];
    devDependencies: dependency[];
    peerDependencies: dependency[];

    constructor(name: string, url: string, dep: dependency[], devDep: dependency[], peerDep: dependency[]) {
        this.name = name;
        this.url = url;
        this.dependencies = dep;
        this.devDependencies = devDep;
        this.peerDependencies = peerDep;
    }

    getDepUnion(): dependency[] {
        return [];
    }
}
