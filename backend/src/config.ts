// Github access token https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token
export const token = process.env['TOKEN'];
export const org = process.env['ORG'];
export const userAgent = process.env['AGENT'];
export const userName = process.env['NAME'];

export const gitApi = 'https://api.github.com/';
export const concurrent = 50;
export const outputRepos = 'output/outputRepos.json';
export const outputData = 'output/outputData.json';
// Directories we want to ignore looking into
export const blacklistDir = ['node_modules'];
export const blacklistFiles = ['package-lock.json', 'yarn.lock'];

export const blacklistRepos = [
    'navikt/sosialhjelp-soknad-api',
    'navikt/pesys',
    'navikt/stelvio',
    'navikt/spsak',
    'navikt/modiapersonoversikt-api',
    'navikt/EESSI-RINA-5.6.2-opensource'
];
export const files = ['package.json'];
export const repoDirName = 'tmp_repos';
