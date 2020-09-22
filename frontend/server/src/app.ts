import { RepoResultFactory, ServerResults } from '@nav-frontend/shared-types';
import { filterByNames, filterByOptions, filterByPack, getRes, sortBy } from './results';
import {
    depVekst,
    repoHistory,
    reposDeps,
    reposDevDeps,
    reposLang,
    reposN,
    reposNpackages,
    reposPeerDeps,
    repoVekstPerM
} from './stats';
import { execute } from '../crawler/index';

import express = require('express');
var fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const app: express.Application = express();

let localData: any[] = [];
let runningCrawler: boolean = false;

app.use(express.static(path.join(__dirname, '../../..', 'build')));
app.use(express.static('public'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.json());

app.on('start-cronjob', () => {
    console.log(cron.validate('0 0 */6 * * *'));
    const cronJob = cron.schedule('0 0 */6 * * *', function () {
        console.log('Starting Cron job');
        if (runningCrawler) return;
        try {
            runningCrawler = true;
            execute()
                .then(() => {
                    console.log('Updated data with crawler!');
                    app.emit('reload-data', null);
                    runningCrawler = false;
                    console.info('Cron job completed');
                })
                .catch((e: Error) => {
                    runningCrawler = false;
                    console.log('error running crawler');
                });
        } catch (e) {
            runningCrawler = false;
            console.log('error running crawler');
        }
    });
    cronJob.start();
});

app.on('reload-data', () => {
    // TODO: bedre pathing til data
    let dir = (__dirname + '/output/outputRepos.json').replace('build/src', 'crawler');
    try {
        fs.readFile(dir, 'utf-8', (err: Error, data: any) => {
            if (err) {
                console.log('Finner ikke generert data fra crawler');
                return;
            }
            localData = JSON.parse(data);
            localData.sort((a, b) => a.name.localeCompare(b.name));
            console.log('Successfull load/reload of data');
        });
    } catch (error) {
        console.log('Error: fs.readFile in app.ts');
    }
});

app.get('/initial-load', function (req, res) {
    try {
        const result: ServerResults = {
            repos: getRes(localData),
            statistics: [],
            history: []
        };
        res.json(result);
    } catch (e) {
        const result: ServerResults = { repos: [], statistics: [], history: [] };
        res.json(result);
    }
});
app.put('/run-crawler-manually', async function (req, res) {});

app.post('/filter', function (req, res) {
    let result;
    try {
        const { nameFilter, packFilter } = req.body;
        if (!nameFilter || !packFilter) throw new Error('Filters not added to request body');

        result = filterByNames(localData, req.body.nameFilter);
        result = filterByOptions(result, req.body.nameFilter);
        result = filterByPack(result, req.body.packFilter);

        let stats = [
            reposN(result),
            reposLang(result),
            reposDeps(result),
            reposDevDeps(result),
            reposPeerDeps(result),
            reposNpackages(result, localData.length)
        ];

        let history = [depVekst(result, req.body.packFilter)];

        result = result.map((repo) => RepoResultFactory(repo));
        sortBy(result, req.body.nameFilter.sortby);

        history.push(repoHistory(result));
        history.push(repoVekstPerM(result));

        res.json({ repos: result, statistics: stats, history: history });
    } catch (e) {
        res.json({ repos: [], statistics: [], history: [] });
    }
});

module.exports = app;
