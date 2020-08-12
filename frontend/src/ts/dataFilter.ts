
import { RepoData } from 'crawler/src/dataHandling/repo';
import { FilterData, Stats } from '../components/types';
const data = require('crawler/output.json');

class DataFilter {

    rawData: RepoData[];
    filteredData: RepoData[];
    error: string;
    stats: Stats[];
    constructor() {
        this.rawData = [];
        this.filteredData = [];
        this.error = '';
        this.stats = [];
    }
    init = () => {
        try {
            this.rawData = data;
            this.filteredData = JSON.parse(JSON.stringify(this.rawData));
        } catch (e) {
            console.log(e);
            this.error = 'Kunne ikke laste data fra output.json..';
        }
    }
    runFilter = (data:FilterData) => {
        this.filteredData.shift();
        this.generateStats();
        console.log("ran filtration process!");
    }

    getFilteredData = () => {
        return this.filteredData;
    }

    generateStats = () => {
        let stats:Stats[] = [];
        stats.push({name: 'Repos', data: this.filteredData.length})


        let counts:{[key: string]: number} = {};
        for (var i = 0; i < this.filteredData.length; i++) {
            counts[this.filteredData[i].language] = 1 + (counts[this.filteredData[i].language] || 0);
        }
        const sortedLang:[string, number][] = Object.entries(counts).sort((a, b) => a[1] - b[1]).reverse();
        stats.push({name: 'Språk', data: sortedLang});


        this.stats = stats;

    }
    getStats = () => {
        return this.stats;
    }

}

export default DataFilter;