
import { RepoData } from 'crawler/src/dataHandling/repo';
const data = require('crawler/output.json');

class DataFilter {

    rawData: RepoData[];
    filteredData: RepoData[];
    error: string;
    constructor() {
        this.rawData = [];
        this.filteredData = [];
        this.error = '';
    }
    init = () => {
        try {
            this.rawData = data;
            this.filterData();
        } catch (e) {
            console.log(e);
            this.error = 'Kunne ikke laste data fra output.json..';
        }
    }
    filterData = (activity: string = '', version: string = '', dep: string = '') => {
        this.filteredData = this.rawData;
    }

    getFilteredData = () => {
        return this.filteredData;
    }

}

export default DataFilter;