const config = require('../config.js');
const download = require('download-git-repo');

const cb = (err) => {
    if(err){
        // TODO: handle error better
        console.log(err);
    }
}

const dlRepo = (url, callback) =>
    download(
        'github:' + url,
        './repo',
        {
            headers: {
                Authorization: `token ${config.token}`,
                'User-Agent': config.userAgent
            }
        },
        cb
    );

export default dlRepo;
