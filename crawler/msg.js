const chalk = require('chalk');

module.exports = {
    finished: chalk.cyan('\nFinished OK in'),
    tokenError: chalk.redBright(
        'ERROR: Please add a github token with the command `export token=YOUR_TOKEN` before running.\n'
    )
};