// Github access token https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token
export const token = process.env['TOKEN'];
export const org = process.env['ORG'];
export const userAgent = process.env['AGENT'];

export const gitApi = 'https://api.github.com/';

// What file we want to look for dependecies in
export const depFiles = ['package.json'];
// How deep into a repos directory we want to look for depFiles in
export const depth = 3;
// Packages we want data on
export const depPackages = ['nav-frontend-knapper', 'nav-frontend-alertstriper'];
// Repos we want to ignore
export const blacklistRepo = ['nav-frontend-moduler', 'Designsystemet', 'nav-frontend-core'];
// Directories we want to ignore looking into
export const blacklistDir = ['node_modules'];

