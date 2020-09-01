import Packagejson, { PackageData } from './package';

export interface RepoData {
        name: string;
        url: string;
        size: number;
        activity: string;
        branch:string;
        language:string;
        processTime:number;
        packages: PackageData[]
}

export default class Repo {
    fullName: string;
    url: string;
    size: number;
    lastActivity: string;
    packages: Packagejson[];
    filteredDep: { [key: string]: any };
    mainBranch: string;
    processed: boolean;
    processTime: number;
    language: string;
    invalid: boolean;

    constructor(
        fullName: string = '',
        url: string = '',
        size: number = 0,
        lastActivity: string = '',
        branch: string = '',
        language: string = ''
    ) {
        this.fullName = fullName;
        this.url = url;
        this.size = size;
        this.lastActivity = lastActivity;
        this.packages = [];
        this.filteredDep = {};
        this.mainBranch = branch;
        this.language = language;
        this.processed = false;
        this.processTime = 0;
        this.invalid = size <= 0 ? true : false;
    }

    addPackage(pack: Packagejson) {
        this.packages.push(pack);
        this.processed = true;
    }

    setProcessTime(time:number) {
        this.processTime = time;
    }

    getData = ():RepoData => {
        return {
            name: this.fullName,
            url: this.url,
            size: this.size,
            activity: this.lastActivity,
            branch: this.mainBranch,
            language: this.language,
            processTime: this.processTime,
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
