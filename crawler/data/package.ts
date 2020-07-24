const union = require('underscore');

export default class Packagejson {
    name: string;
    url: string;
    dependencies: [];
    devDependencies: [];
    peerDependencies: [];

    constructor(name: string, url: string, dep: [], devDep: [], peerDep: []) {
        this.name = name;
        this.url = url;
        this.dependencies = dep;
        this.devDependencies = devDep;
        this.peerDependencies = peerDep;
    }

    getDepUnion(): [] {
        return undefined;
    }
}
