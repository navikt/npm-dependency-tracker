import { RepoData } from 'crawler/src/dataHandling/repo';
import { FilterData, Stats, SelectedData, DepNameData, ActivityRange, FilterType } from '../components/types';
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
    __filterPreset = (preset: SelectedData[]) => {};
    __filterDep = (preset: DepNameData[]) => {};
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
