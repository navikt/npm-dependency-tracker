import { RepoData } from 'crawler/src/dataHandling/repo';
import {
    FilterData,
    Stats,
    InputState,
    VersionScope,
    BoolOperators,
    DepNameData,
    // SelectedData,
    // DepNameData,
    // ActivityRange,
    // FilterType,
    // VersionScope
} from '../components/types';
import * as presets from '../presets';
//const semver = require('semver');
const data = require('crawler/output.json');

class DataFilter {
    readonly rawData: RepoData[];
    filteredData: RepoData[];
    error: string;
    stats: Stats[];
    filterStats: {[key: string]: number };
    constructor() {
        this.rawData = data;
        this.filteredData = [];
        this.error = '';
        try {
            this.rawData = data;
            this.filteredData = this.rawData;
        } catch (e) {
            this.error = 'Kunne ikke laste data fra output.json..';
        }
        this.stats = [];
        this.filterStats = {};
    }

    // __filterActivity = (activity: SelectedData):RepoData[] => {
    //     let date: Date;
    //     let newData = this.rawData;

    //     switch (activity.value) {
    //         case ActivityRange.ONE:
    //             date = new Date();
    //             date.setMonth(date.getMonth() - 1);
    //             return newData.filter((repo) => {
    //                 return new Date(repo.activity).getTime() > date.getTime();
    //             });
    //         case ActivityRange.THREE:
    //             date = new Date();
    //             date.setMonth(date.getMonth() - 3);
    //             return newData.filter((repo) => {
    //                 return new Date(repo.activity).getTime() > date.getTime();
    //             });
    //         case ActivityRange.SIX:
    //             date = new Date();
    //             date.setMonth(date.getMonth() - 6);
    //             return newData.filter((repo) => {
    //                 return new Date(repo.activity).getTime() > date.getTime();
    //             });
    //         case ActivityRange.YEAR:
    //             date = new Date();
    //             date.setFullYear(date.getFullYear() - 1);
    //             return newData.filter((repo) => {
    //                 return new Date(repo.activity).getTime() > date.getTime();
    //             });
    //         default:
    //             return this.rawData;
    //     }
    // };

    // __checkVersion = (packV: string, depV: string, scope: VersionScope) => {

    //     if(packV === 'latest' && scope === VersionScope.UP)return true;
    //     else if(packV === 'latest' && scope !== VersionScope.UP) return false;

    //     packV = semver.minVersion(packV).raw;
    //     depV = semver.minVersion(depV).raw;

    //     switch (scope) {
    //         case VersionScope.DOWN:
    //             if (semver.lt(packV, depV)) return true;
    //             else return false;
    //         case VersionScope.UP:
    //             if (semver.gt(packV, depV)) return true;
    //             else return false;
    //         case VersionScope.SPESIFIC:
    //             if (semver.eq(packV, depV)) return true;
    //             else return false;
    //         default:
    //             return false;
    //     }
    // };

    // __findDep = (pack: { [key: string]: string }, dep: DepNameData[]) => {
    //     let flag = false;
    //     for (let i = 0; i < dep.length; i++) {
    //         if (pack.hasOwnProperty(dep[i].name)) {
    //             if (dep[i].version !== '') {
    //                 if(this.__checkVersion(pack[dep[i].name], dep[i].version, dep[i].scope)){
    //                     this.filterStats[dep[i].name] = 1 + (this.filterStats[dep[i].name] || 0);
    //                     flag = true;
    //                 }
    //             }
    //             this.filterStats[dep[i].name] = 1 + (this.filterStats[dep[i].name] || 0);
    //             flag = true;
    //         }
    //     }
    //     return flag;
    // };

    // // Todo merge all packages {} in repo into one, then union modules
    // __filterDep = (dep: DepNameData[]) => {
    //     if(!dep.length){
    //         return this.rawData;
    //     }
    //     return this.rawData.filter((repo) => {
    //         const end = repo.packages.length;
    //         for (let i = 0; i < end; i++) {
    //             // ? Does JS run all function if you use x() || y() || z() when x is true ?
    //             if (this.__findDep(repo.packages[i].dependencies, dep)) {
    //                 return true;
    //             }
    //             else if(this.__findDep(repo.packages[i].devDependencies, dep)){
    //                 return true;
    //             }
    //             else if(this.__findDep(repo.packages[i].peerDependencies, dep)){
    //                 return true;
    //             }
    //         }
    //         return false;
    //     });
    // };

    // __filterPreset = (preset: SelectedData[]) => {};
    // runFilter = (data: FilterData) => {
    //     this.filterStats = {};
    //     let act = this.__filterActivity(data.activity);
    //     let dep = this.__filterDep(data.depFilters);
    //     this.filteredData = act.filter((repo) => {
    //         for(let i = 0; i < dep.length; i++){
    //             if(dep[i].name === repo.name){
    //                 return true;
    //             }
    //         }
    //         return false;
    //     });
    //     this.__filterPreset(data.preset);
    //     this.generateStats();
    // };
    
    __filterDeps = (data: DepNameData[]) => {

    }


    runFilter = (data: FilterData) => {
        let deps = [...data.depFilters];
        data.preset.forEach((preset) => {
            if((preset.value as string).toLowerCase() === 'react' && preset.state !== InputState.OFF){
                presets.react.forEach((dep) => {
                    if(preset.state === InputState.ADD){
                        deps.push({name: dep, version: '', scope: VersionScope.SPESIFIC, operator: BoolOperators.OR});
                    }
                    else{
                        deps.push({name: dep, version: '', scope: VersionScope.SPESIFIC, operator: BoolOperators.NOT});
                    }
                });
            }
            if((preset.value as string).toLowerCase() === 'ds komponenter' && preset.state !== InputState.OFF){
                presets.dsComp.forEach((dep) => {
                    if(preset.state === InputState.ADD){
                        deps.push({name: dep, version: '', scope: VersionScope.SPESIFIC, operator: BoolOperators.OR});
                    }
                    else{
                        deps.push({name: dep, version: '', scope: VersionScope.SPESIFIC, operator: BoolOperators.NOT});
                    }
                });
            }
            if((preset.value as string).toLowerCase() === 'ds komponenter-styles' && preset.state !== InputState.OFF){
                presets.dsCompStyles.forEach((dep) => {
                    if(preset.state === InputState.ADD){
                        deps.push({name: dep, version: '', scope: VersionScope.SPESIFIC, operator: BoolOperators.OR});
                    }
                    else{
                        deps.push({name: dep, version: '', scope: VersionScope.SPESIFIC, operator: BoolOperators.NOT});
                    }
                });
            }
            if((preset.value as string).toLowerCase() === 'ds-styles men ikke ds-komponent' && preset.state !== InputState.OFF){
                // presets.react.forEach((dep) => {
                //     deps.push({name: dep, version: '', scope: VersionScope.SPESIFIC, operator: BoolOperators.OR});
                // });
            }
        });
        console.log(deps);

    }

    getFilteredData = () => {
        return this.filteredData;
    };

    generateStats = () => {
        let stats: Stats[] = [];
        stats.push({ name: 'Repos', data: this.filteredData.length });

        let counts: { [key: string]: number } = {};
        for (var i = 0; i < this.filteredData.length; i++) {
            counts[this.filteredData[i].language] = 1 + (counts[this.filteredData[i].language] || 0);
        }
        const sortedLang: [string, number][] = Object.entries(counts)
            .sort((a, b) => a[1] - b[1])
            .reverse();
        stats.push({ name: 'Språk', data: sortedLang });

        this.stats = stats;
    };
    getStats = () => {
        return [...this.stats];
    };
}

export default DataFilter;
