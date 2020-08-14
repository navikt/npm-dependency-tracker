import { RepoData } from 'crawler/src/dataHandling/repo';
import {
    FilterData,
    Stats,
    SelectedData,
    DepNameData,
    ActivityRange,
    FilterType,
    VersionScope
} from '../components/types';
const semver = require('semver');
const data = require('crawler/output.json');

class DataFilter {
    readonly rawData: RepoData[];
    filteredData: RepoData[];
    error: string;
    stats: Stats[];
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
    }

    __filterActivity = (activity: SelectedData) => {
        if (activity.type !== FilterType.ACTIVITY) return;
        let date: Date;
        let newData = this.rawData;

        switch (activity.value) {
            case ActivityRange.ONE:
                date = new Date();
                date.setMonth(date.getMonth() - 1);
                this.filteredData = newData.filter((repo) => {
                    return new Date(repo.activity).getTime() > date.getTime();
                });
                break;
            case ActivityRange.THREE:
                date = new Date();
                date.setMonth(date.getMonth() - 3);
                this.filteredData = newData.filter((repo) => {
                    return new Date(repo.activity).getTime() > date.getTime();
                });
                break;
            case ActivityRange.SIX:
                date = new Date();
                date.setMonth(date.getMonth() - 6);
                this.filteredData = newData.filter((repo) => {
                    return new Date(repo.activity).getTime() > date.getTime();
                });
                break;
            case ActivityRange.YEAR:
                date = new Date();
                date.setFullYear(date.getFullYear() - 1);
                this.filteredData = newData.filter((repo) => {
                    return new Date(repo.activity).getTime() > date.getTime();
                });
                break;
            default:
                this.filteredData = this.rawData;
                return;
        }
    };

    __checkVersion = (packV: string, depV: string, scope: VersionScope) => {

        if(packV === 'latest' && scope === VersionScope.UP)return true;
        else if(packV === 'latest' && scope !== VersionScope.UP) return false;

        packV = semver.minVersion(packV).raw;
        depV = semver.minVersion(depV).raw;

        switch (scope) {
            case VersionScope.DOWN:
                if (semver.lt(packV, depV)) return true;
                else return false;
            case VersionScope.UP:
                if (semver.gt(packV, depV)) return true;
                else return false;
            case VersionScope.SPESIFIC:
                if (semver.eq(packV, depV)) return true;
                else return false;
            default:
                return false;
        }
    };

    __findDep = (pack: { [key: string]: string }, dep: DepNameData[]) => {
        for (let i = 0; i < dep.length; i++) {
            if (pack.hasOwnProperty(dep[i].name)) {
                if (dep[i].version !== '') {
                    if(this.__checkVersion(pack[dep[i].name], dep[i].version, dep[i].scope)){
                        return true
                    }
                    else return false;
                }
                return true;
            }
        }
        return false;
    };

    __filterDep = (dep: DepNameData[]) => {
        if (dep.length === 0) return;
        this.filteredData = this.filteredData.filter((repo) => {
            const end = repo.packages.length;
            for (let i = 0; i < end; i++) {
                if (
                    this.__findDep(repo.packages[i].dependencies, dep) ||
                    this.__findDep(repo.packages[i].devDependencies, dep) ||
                    this.__findDep(repo.packages[i].peerDependencies, dep)
                ) {
                    return true;
                }
            }
            return false;
        });
    };

    __filterPreset = (preset: SelectedData[]) => {};
    runFilter = (data: FilterData) => {
        this.__filterActivity(data.activity);
        this.__filterDep(data.depFilters);
        this.__filterPreset(data.preset);
        this.generateStats();
    };

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
        return this.stats;
    };
}

export default DataFilter;
