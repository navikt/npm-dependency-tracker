
import Packagejson from './package';

export default class Repo {
    name: string;
    url: string;
    packages: Packagejson[]

    constructor(name, url) {
        this.name = name;
        this.url = url;
        this.packages = [];
    }

    addPackage(pack: Packagejson){
        this.packages.push(pack);
    }

    getDependencies(){
        let dep = [];
        this.packages.forEach(pack => (dep.push(pack.getDepUnion())));
        return dep;
    }

    logInfo(): void {
        console.table([{name: this.name, url: this.url} ])
    }
}
