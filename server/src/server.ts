import express = require('express');
const app: express.Application = express();
const packages = require('../output/outputPackages.json');
const raw = require('../output/outputRepos.json');
const PORT = 3001;

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.listen(PORT, function () {
    console.log('Server is listening on port ' + PORT);
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.get('/get-current-packages', function (req, res) {
    res.json(packages);
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
