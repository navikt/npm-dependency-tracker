// Github access token https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token
export const token = process.env['TOKEN'];
export const org = process.env['ORG'];
export const userAgent = process.env['AGENT'];

export const gitApi = 'https://api.github.com/';
export const batchSize = 25;
export const outputFile = 'output.json';

// What file we want to look for dependecies in (ONLY SUPPORTS .JSON FOR NOW)
export const depFiles = ['package.json'];
// Packages we want data on
export const depPackages = [
    'nav-frontend-chevron',
    'nav-frontend-ekspanderbartpanel',
    'nav-frontend-skjema',
    'nav-frontend-knapper',
    'nav-frontend-alertstriper',
    'nav-frontend-js-utils',
    'nav-frontend-core',
    'nav-frontend-etiketter',
    'nav-frontend-hjelpetekst',
    'nav-frontend-ikonknapper',
    'nav-frontend-ikoner-assets',
    'nav-frontend-lenker',
    'nav-frontend-lenkepanel',
    'nav-frontend-lermerpanel',
    'nav-frontend-lukknapp',
    'nav-frontend-modal',
    'nav-frontend-panel',
    'nav-frontend-popover',
    'nav-frontend-snakkeboble',
    'nav-frontend-spinner',
    'nav-frontend-stegindikator',
    'nav-frontend-tabell-style',
    'nav-frontend-tabs',
    'nav-frontend-tekstomrade',
    'nav-frontend-toggle',
    'nav-frontend-typografi',
    'nav-frontend-veileder',
    'nav-frontend-veilederpanel',
    
    'nav-frontend-chevron-style',
    'nav-frontend-ekspanderbartpanel-style',
    'nav-frontend-skjema-style',
    'nav-frontend-knapper-style',
    'nav-frontend-alertstriper-style',
    'nav-frontend-js-utils',
    'nav-frontend-core',
    'nav-frontend-etiketter-style',
    'nav-frontend-hjelpetekst-style',
    'nav-frontend-ikonknapper-style',
    'nav-frontend-ikoner-assets',
    'nav-frontend-lenker-style',
    'nav-frontend-lenkepanel-style',
    'nav-frontend-lermerpanel-style',
    'nav-frontend-lukknapp-style',
    'nav-frontend-modal-style',
    'nav-frontend-panel-style',
    'nav-frontend-popover-style',
    'nav-frontend-snakkeboble-style',
    'nav-frontend-spinner-style',
    'nav-frontend-stegindikator-style',
    'nav-frontend-tabell-style-style',
    'nav-frontend-tabs-style',
    'nav-frontend-tekstomrade-style',
    'nav-frontend-toggle-style',
    'nav-frontend-typografi-style',
    'nav-frontend-veileder-style',
    'nav-frontend-veilederpanel-style'
];
// Repos we want to ignore
export const blacklistRepo = ['nav-frontend-moduler', 'Designsystemet', 'nav-frontend-core'];
// Directories we want to ignore looking into
export const blacklistDir = ['node_modules'];

export const tmpDirName = 'tmp_repos';
