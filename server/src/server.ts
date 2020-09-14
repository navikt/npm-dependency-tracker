import { NameFilter, RepoResult } from '@nav-frontend/shared-types';
import express = require('express');
const app: express.Application = express();
const packages = require('../crawler/output/outputPackages.json');
const raw = require('../crawler/output/outputRepos.json');
import { filterByNames, filterByOptions, filterByPack, getRes, sortBy } from './generateRes';
const PORT = 3001;

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.json());

app.listen(PORT, function () {
    console.log('Server is listening on port ' + PORT);
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.get('/get-result', function (req, res) {
    res.json(getRes(raw));
});
app.get('/get-repo-names', function (req, res) {
    let names: string[] = [];
    packages.forEach((repo: any) => {
        try {
            names.push(repo.name);
        } catch (e) {}
    });
    res.json(names);
});

app.post('/filter-name', function (req, res) {
    try {
        let filter: NameFilter = req.body.filter;
        res.json(filterByNames(raw, filter));
    } catch {
        res.json([]);
    }
});
app.post('/filter', function (req, res) {
    let result;
    try {
        result = filterByNames(raw, req.body.nameFilter);
        result = filterByOptions(result, req.body.nameFilter);
        result = filterByPack(result, req.body.packFilter);

        result = result.map((repo) => RepoResult(repo));
        sortBy(result, req.body.nameFilter.sortby);
    } catch (e) {
        res.json([]);
    }
    res.json(result);
});
