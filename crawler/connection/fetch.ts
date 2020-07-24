import Request from 'request';

import * as msg from '../msg';
import Repo from '../data/repo';
import * as config from '../config';

const reqTemplate = Request.defaults({
    headers: {
        Authorization: `token ${config.token}`,
        'User-Agent': config.userAgent
    },
    qs: {
        per_page: 100
    }
});

const fetch = (url:string): void => {
    console.log('Fetching page from url: ' + url);
};


const generateUrl = ():string => {
    return '';
}

const fetchAllRepos = ():Repo[] => {
    let repos:Repo[] = [];
    return repos;
}

const fetchAlldepFiles = () => {

}

