import { RepoResultFactory, ServerResults, Repo } from '@nav-frontend/shared-types';
import express = require('express');
import { exit } from 'process';
const app: express.Application = express();
var fs = require('fs');

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

let localData: any[] = [];

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.json());

app.on('ready', () => {
    console.log('SERVER IS READY');
    let dir = (__dirname + '/output/outputRepos.json').replace('src', 'crawler');
    try {
        fs.readFile(dir, 'utf-8', (err: Error, data: any) => {
            if (err) throw err;
            localData = JSON.parse(data);
            localData.sort((a, b) => a.name.localeCompare(b.name));
        });
    } catch (error) {
        console.log(error);
        exit(1);
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
