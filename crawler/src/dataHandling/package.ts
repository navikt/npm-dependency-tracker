
export interface PackageData {
    name: string;
    dependencies: {[key: string]: string};
    devDependencies: {[key: string]: string};
    peerDependencies: {[key: string]: string};
}


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

    getData = () => {
        return {
            name: this.name,
            dependencies: this.dependencies,
            devDependencies: this.devDependencies,
            peerDependencies: this.peerDependencies
        } as PackageData;
    } 
}
