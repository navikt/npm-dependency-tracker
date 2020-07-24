
import Packagejson, { dependency } from './package';


export default class Repo {
    name: string;
    url: string;
    packages: Packagejson[]

    constructor(name:string, url:string) {
        this.name = name;
        this.url = url;
        this.packages = [];
    }

    addPackage(pack: Packagejson){
        this.packages.push(pack);
    }

    getDependencies(){
        let dep:dependency[][] = [];
        this.packages.forEach(pack => (dep.push(pack.getDepUnion())));
        return dep;
    }

    logInfo(): void {
        console.table([{name: this.name, url: this.url} ])
    }
}
