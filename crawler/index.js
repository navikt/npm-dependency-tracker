const config = require('../config.js');
const msg = require('./msg.js');

console.time(msg.finished);

if (!config.token) {
    console.log(msg.tokenError);
    process.exit();
}

console.timeEnd(msg.finished);
