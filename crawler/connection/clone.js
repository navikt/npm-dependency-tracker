const config = require('../config.js');
const download = require('download-git-repo');

const cb = (success, error, err) => {
    if(err){
        // TODO: handle error better
        console.log(err);
        error(0);
    }
    else{
        success(1);
    }
}

// Downloads the given repo with proper OAuth
const dlRep = (fullName, cbSuccess, cbError) =>
    download(
        'github:' + fullName,
        './repo',
        {
            headers: {
                Authorization: `token ${config.token}`,
                'User-Agent': config.userAgent
            }
        },
        (err, cbSuccess, cbError) => cb
    );

const dlRepo = (name) => {
    return new Promise((resolve, reject) => {
        dlRep(name, (s) => resolve(s), (e) => reject(e))
    })
}
export default dlRepo;
