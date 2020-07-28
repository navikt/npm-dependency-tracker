import Request from 'request';

import * as util from '../util';
import * as config from '../config';
import * as underscore from 'underscore';

const reqTemplate = Request.defaults({
    headers: {
        Authorization: `token ${config.token}`,
        'User-Agent': config.userAgent
    },
    qs: {
        per_page: 100
    }
});

const optionsTemplate = (page) => {
    return {
        uri: generateUrl(['orgs', config.org, 'repos'].join('/')),
        qs: {
            page: page
        }
    };
};

const fetch = (options) => {
    return new Promise((resolve, reject) => {
        reqTemplate.get(options, (err, res, body) => {
            if (err) reject(err);
            let statusCode = +res.headers.status.split(' ')[0];

            // Github got a limit of 5000 calls/hr, so if overstepped we get locked out
            let resHeader = res.headers['x-ratelimit-remaining'];
            if (resHeader !== undefined && +resHeader === 0) {
                const wait = new Date(+res.headers['x-ratelimit-reset'] * 1000).toLocaleString();
                reject(new Error(util.xrateError(wait)));
            }

            resolve({
                headers: res.headers,
                json: JSON.parse(body),
                statusCode: statusCode
            });
        });
    });
};

function getPaginateHeaderData(headerStr) {
    const nextRegExp = /repos\?per_page=100\&page=(\d+)\>\; rel=\"next\"/;
    const lastRegExp = /repos\?per_page=100\&page=(\d+)\>\; rel=\"last\"/;

    const nextMatch = headerStr.match(nextRegExp);
    const lastMatch = headerStr.match(lastRegExp);

    return {
        next: +nextMatch[1] || undefined,
        last: +lastMatch[1] || undefined
    };
}

const generateUrl = (path) => {
    return config.gitApi + path;
};

function fetchOrgReposByPage(page) {
    return fetch(optionsTemplate(page));
}


// Fetches all the repos avaliable in the organization without parsing the data.
const fetchAllRepos = () => {
    return fetchOrgReposByPage(1)
        .then((val) => {
            let repos = [].concat(val.json);
            let pagination = getPaginateHeaderData(val.headers.link);

            let promises = underscore.range(2, pagination.last + 1).map((p) => {
                return fetchOrgReposByPage(p);
            });

            return Promise.all(promises).then((values) => {
                let rs = underscore.flatten(values.map((v) => v.json));
                return repos.concat(rs);
            });
        })
        .catch((err) => {
            console.log(err.message);
            process.exit(0);
        });
};

export const getAllRepos = () => {
    return fetchAllRepos();
};
