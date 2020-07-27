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

const fetch = (options: { uri: string; qs?: { page: number } }): Promise<any> => {
    return new Promise((resolve, reject) => {
        reqTemplate.get(options, (err, res, body) => {
            if (err) reject(err);
            let status = res.headers.status ? res.headers.status : '404';
            let statusCode = typeof status === 'string' ? +status.split(' ')[0] : +status[0];

            let resHeader = res.headers['x-ratelimit-remaining'];
            if (resHeader !== undefined && +resHeader === 0) {
                reject(`Github closed access to api. Wait 45 minutes`);
            }
            console.log(res.headers['x-ratelimit-remaining']);
            console.log(res.headers['x-ratelimit-limit']);
            const t = res.headers['x-ratelimit-reset'] ? res.headers['x-ratelimit-reset']: 0;
            const f = new Date(+t * 1000).toLocaleString();
            console.log(f);

            resolve({
                headers: res.headers,
                json: JSON.parse(body),
                statusCode: statusCode
            });
        });
    });
};

const generateUrl = (path: string): string => {
    return config.gitApi + path;
};

const fetchAllRepos = (): Repo[] => {
    let repos: Repo[] = [];
    return repos;
};

const fetchAlldepFiles = () => {};

function jsonifyBase64(bstring: string) {
    let buf = new Buffer(bstring, 'base64');
    return JSON.parse(buf.toString());
}

const fetchJson = () => {
    const url = 'https://api.github.com/repos/navikt/nav-frontend-moduler/contents/package.json';
    return fetch({ uri: url });
};

export const testFetching = () => {
    return fetchJson().then((res) => {
        let p = {};
        if (res.statusCode === 404) {
            console.log(`\tdid not find package.json`);
            return;
        }
        const data = jsonifyBase64(res.json.content);
        console.log('found package.json\n');
        console.log(res.statusCode);
        console.log(res.headers);
        //console.log(data);
    });
};
