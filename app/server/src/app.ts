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

// TODO: la brukeren velge om de vil oppdatere når serveren starter?
app.on('start-cronjob', () => {
    const job = () => {
        if (runningCrawler) {
            console.log('Crawler allready running, skipping cron job');
            return;
        }
        console.log('Starting cron job: ' + new Date().toUTCString());
        try {
            runningCrawler = true;
            execute()
                .then(() => {
                    app.emit('reload-data', null);
                    runningCrawler = false;
                    console.log('Completed cron job: ' + new Date().toUTCString());
                })
                .catch((e: Error) => {
                    runningCrawler = false;
                    console.log('ERROR: cron job failed with error: ' + e.message);
                });
        } catch (e) {
            runningCrawler = false;
            console.log('ERROR: cron job failed with error: ' + e.message);
        }
    };

    // job starts at 06.00
    const cronJob = cron.schedule('0 6 * * *', function () {
        job();
    });
    job();
    cronJob.start();
});

app.on('reload-data', () => {
    let dir = (__dirname + '/output/parsedResult.json').replace('build/src/', '');
    try {
        fs.readFile(dir, 'utf-8', (err: Error, data: any) => {
            if (err) {
                if (runningCrawler)
                    console.log('No parsed data found, crawler is generating it right now');
                else
                    console.log(
                        'No parsed data found(consider restarting since crawler is not running)'
                    );
                return;
            }
            localData = JSON.parse(data);
            localData.sort((a, b) => a.name.localeCompare(b.name));
            console.log('SUCCESS: Read parsed data generated from crawler into memory');
        });
    } catch (e) {
        console.log('ERROR: reload-data failed with error: ' + e.message);
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
