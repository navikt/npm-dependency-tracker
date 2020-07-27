
import Packagejson, { dependency } from './package';


export default class Repo {
    fullName: string;
    url: string;
    size: string;
    packages: Packagejson[]

    constructor(fullName:string, url:string, size:string) {
        this.fullName = fullName;
        this.url = url;
        this.size = size;
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
        console.table([{name: this.fullName, url: this.url, size: this.size} ])
    }
}
