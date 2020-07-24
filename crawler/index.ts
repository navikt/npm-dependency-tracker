const config = require('../config.js');
const msg = require('./msg.js');
const Repo = require('./data/repo.js');
const Package = require('./data/package');

console.time(msg.finished);

if (!config.token) {
    console.log(msg.tokenError);
    process.exit(0);
}


const repo = new Repo("DS_REPO", "https://api.github.com/xyz");
repo.logInfo();


console.timeEnd(msg.finished);
console.log('\n');
