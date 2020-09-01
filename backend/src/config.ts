// Github access token https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token
export const token = process.env['TOKEN'];
export const org = process.env['ORG'];
export const userAgent = process.env['AGENT'];
export const userName = process.env['NAME'];

export const gitApi = 'https://api.github.com/';
export const concurrent = 20;
export const outputFile = 'outputData.json';
// Directories we want to ignore looking into
export const blacklistDir = ['node_modules'];
export const blacklistFiles = ['package-lock.json', 'yarn.lock'];

export const repoDirName = 'tmp_repos';
