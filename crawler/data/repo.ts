
import Packagejson, { dependency } from './package';
import { last } from 'underscore';


export default class Repo {
    fullName: string;
    url: string;
    size: string;
    lastActivity: string;
    packages: Packagejson[]

    constructor(fullName:string = '', url:string = '', size:string = '', lastActivity:string = '') {
        this.fullName = fullName;
        this.url = url;
        this.size = size;
        this.lastActivity = lastActivity;
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
        console.table([{name: this.fullName, url: this.url, size: this.size} ]);
    }
}
