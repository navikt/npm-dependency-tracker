const config = require('../config.js');
const download = require('download-git-repo');
const rimraf = require('rimraf');

const cb = (err) => {
    if(err){
        // TODO: handle error better
        console.log(err);
    }
}

// Downloads the given repo with proper OAuth
export const dlRepo = (fullName, callback) =>
    download(
        'github:' + fullName,
        (config.tmpDirName + '/' + fullName),
        {
            headers: {
                Authorization: `token ${config.token}`,
                'User-Agent': config.userAgent
            }
        },
        callback ? callback : cb
    );

export const delRepo = (fullName) => {
    rimraf.sync(config.tmpDirName + '/' + fullName);
}
