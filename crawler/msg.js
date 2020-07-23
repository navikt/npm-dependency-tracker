const chalk = require('chalk');

module.exports = {
    finished: chalk.cyan('\nFinished OK'),
    tokenError: chalk.redBright(
        'ERROR: Please add a github access-token with the command `export token=YOUR_TOKEN` before running.\n'
    ),
    runtime: ''
};