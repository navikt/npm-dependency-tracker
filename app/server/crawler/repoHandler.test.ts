import { blacklistRepos } from './config';
import { mapApiDataToRepos } from './repoHandler';
const raw = (name: string) => ({
    id: 92277707,
    node_id: 'MDEwOlJlcG9zaXRvcnk5MjI3NzcwNw==',
    name: 'nav-frontend-moduler',
    full_name: name,
    private: false,
    owner: {
        login: 'navikt',
        id: 11848947,
        node_id: 'MDEyOk9yZ2FuaXphdGlvbjExODQ4OTQ3',
        avatar_url: 'https://avatars3.githubusercontent.com/u/11848947?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/navikt',
        html_url: 'https://github.com/navikt',
        followers_url: 'https://api.github.com/users/navikt/followers',
        following_url:
            'https://api.github.com/users/navikt/following{/other_user}',
        gists_url: 'https://api.github.com/users/navikt/gists{/gist_id}',
        starred_url:
            'https://api.github.com/users/navikt/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/navikt/subscriptions',
        organizations_url: 'https://api.github.com/users/navikt/orgs',
        repos_url: 'https://api.github.com/users/navikt/repos',
        events_url: 'https://api.github.com/users/navikt/events{/privacy}',
        received_events_url:
            'https://api.github.com/users/navikt/received_events',
        type: 'Organization',
        site_admin: false
    },
    html_url: 'https://github.com/navikt/nav-frontend-moduler',
    description:
        'Monorepo for alle NAVs felleskomponenter/fellesmoduler, + webapp for dokumentasjon',
    fork: false,
    url: 'https://api.github.com/repos/navikt/nav-frontend-moduler',
    forks_url: 'https://api.github.com/repos/navikt/nav-frontend-moduler/forks',
    keys_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/keys{/key_id}',
    collaborators_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/collaborators{/collaborator}',
    teams_url: 'https://api.github.com/repos/navikt/nav-frontend-moduler/teams',
    hooks_url: 'https://api.github.com/repos/navikt/nav-frontend-moduler/hooks',
    issue_events_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/issues/events{/number}',
    events_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/events',
    assignees_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/assignees{/user}',
    branches_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/branches{/branch}',
    tags_url: 'https://api.github.com/repos/navikt/nav-frontend-moduler/tags',
    blobs_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/git/blobs{/sha}',
    git_tags_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/git/tags{/sha}',
    git_refs_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/git/refs{/sha}',
    trees_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/git/trees{/sha}',
    statuses_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/statuses/{sha}',
    languages_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/languages',
    stargazers_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/stargazers',
    contributors_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/contributors',
    subscribers_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/subscribers',
    subscription_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/subscription',
    commits_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/commits{/sha}',
    git_commits_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/git/commits{/sha}',
    comments_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/comments{/number}',
    issue_comment_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/issues/comments{/number}',
    contents_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/contents/{+path}',
    compare_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/compare/{base}...{head}',
    merges_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/merges',
    archive_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/{archive_format}{/ref}',
    downloads_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/downloads',
    issues_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/issues{/number}',
    pulls_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/pulls{/number}',
    milestones_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/milestones{/number}',
    notifications_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/notifications{?since,all,participating}',
    labels_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/labels{/name}',
    releases_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/releases{/id}',
    deployments_url:
        'https://api.github.com/repos/navikt/nav-frontend-moduler/deployments',
    created_at: new Date('2020-12-24'),
    updated_at: new Date('2020-12-24'),
    pushed_at: new Date('2020-12-24'),
    git_url: 'git://github.com/navikt/nav-frontend-moduler.git',
    ssh_url: 'git@github.com:navikt/nav-frontend-moduler.git',
    clone_url: 'cloneUrl',
    svn_url: 'https://github.com/navikt/nav-frontend-moduler',
    homepage: 'https://design.nav.no',
    size: 40675,
    stargazers_count: 53,
    watchers_count: 53,
    language: 'JavaScript',
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: true,
    has_pages: true,
    forks_count: 17,
    mirror_url: null,
    archived: false,
    disabled: false,
    open_issues_count: 26,
    license: {
        key: 'other',
        name: 'Other',
        spdx_id: 'NOASSERTION',
        url: null,
        node_id: 'MDc6TGljZW5zZTA='
    },
    forks: 17,
    open_issues: 26,
    watchers: 53,
    default_branch: 'master',
    temp_clone_token: null,
    organization: {
        login: 'navikt',
        id: 11848947,
        node_id: 'MDEyOk9yZ2FuaXphdGlvbjExODQ4OTQ3',
        avatar_url: 'https://avatars3.githubusercontent.com/u/11848947?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/navikt',
        html_url: 'https://github.com/navikt',
        followers_url: 'https://api.github.com/users/navikt/followers',
        following_url:
            'https://api.github.com/users/navikt/following{/other_user}',
        gists_url: 'https://api.github.com/users/navikt/gists{/gist_id}',
        starred_url:
            'https://api.github.com/users/navikt/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/navikt/subscriptions',
        organizations_url: 'https://api.github.com/users/navikt/orgs',
        repos_url: 'https://api.github.com/users/navikt/repos',
        events_url: 'https://api.github.com/users/navikt/events{/privacy}',
        received_events_url:
            'https://api.github.com/users/navikt/received_events',
        type: 'Organization',
        site_admin: false
    },
    network_count: 17,
    subscribers_count: 116
});

describe('repoHandler.ts', () => {
    describe('mapApiDataToRepos', () => {
        const repos = [raw('repo1'), raw('repo2'), raw('repo3'), raw('repo4')];

        it('Should map GithubApi.Root[] to Repo[]', () => {
            const result = mapApiDataToRepos(repos);
            expect(result.length).toEqual(4);
            ['repo1', 'repo2', 'repo3', 'repo4'].forEach((name) => {
                expect(result).toContainEqual({
                    name,
                    lastCommit: '',
                    cloneUrl: 'cloneUrl',
                    branch: 'master',
                    packages: [],
                    commits: [],
                    rawFetch: raw(name)
                });
            });
        });

        it('Should filter out repos by name', () => {
            const blacklist = ['repo2', 'repo4'];
            const result = mapApiDataToRepos(repos, blacklist);
            expect(result.length).toEqual(2);
            blacklist.forEach((name) => {
                expect(result.map(({ name }) => name)).not.toContain(name);
            });
        });
    });
});
