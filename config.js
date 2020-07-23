const process = require('process');

module.exports = {
    // Github access token https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token
    token: process.env['token'],
    org: 'navikt',
    // What file we want to look for dependecies in
    depFiles: ['package.json'],
    // How deep into a repos directory we want to look for depFiles in
    depth: 3,
    // Packages we want data on
    depPackages: ['nav-frontend-knapper', 'nav-frontend-alertstriper'],
    // Repos we want to ignore
    blacklistRepo: ['nav-frontend-moduler', 'Designsystemet', 'nav-frontend-core'],
    // Directories we want to ignore looking into
    blacklistDir: ['node_modules']
};
