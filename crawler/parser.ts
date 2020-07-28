import * as connector from './connection/fetch';
import Repo from './data/repo.js';

export const generateRepos = async () => {
    let totalSize = 0;
    const parsedRepos: Repo[] = [];

    const rawRepos = await connector.getAllRepos();
    rawRepos.forEach((repo) => {
        parsedRepos.push(new Repo(repo.full_name, repo.html_url, repo.size, repo.updated_at));
        totalSize += +repo.size;
    });
    console.table([{Total_repos: parsedRepos.length, Total_size_MB: totalSize/(1000)}]);

    return parsedRepos;
}