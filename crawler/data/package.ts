const union = require('underscore');

export default class Packagejson {
    name: string;
    location: string;
    dependencies: {};
    devDependencies: {};
    peerDependencies: {};

    constructor(name: string = '', location: string = '', dep: {} = {}, devDep: {} = {}, peerDep: {} = {}) {
        this.name = name;
        this.location = location;
        this.dependencies = dep;
        this.devDependencies = devDep;
        this.peerDependencies = peerDep;
    }
}
