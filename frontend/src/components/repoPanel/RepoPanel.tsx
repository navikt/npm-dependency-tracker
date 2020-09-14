import * as React from 'react';
import { FileContent, Star } from '@nav-frontend/icons';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import EtikettBase from 'nav-frontend-etiketter';
import Lenke from 'nav-frontend-lenker';
import { Ingress, Undertittel } from 'nav-frontend-typografi';
import classnames from 'classnames';
import { RepoResult } from '@nav-frontend/shared-types';

import './RepoPanel.less';

const generateTags = (repo: RepoResult) => {
    return (
        <span>
            {repo.size ? (
                <EtikettBase
                    type="info"
                    mini
                    className={classnames('repoPanel__tags', 'repoPanel__tags--size')}
                >
                    {repo.size + 'kB'}
                </EtikettBase>
            ) : null}
            {repo.language ? (
                <EtikettBase
                    type="info"
                    mini
                    className={classnames('repoPanel__tags', 'repoPanel__tags--lang')}
                >
                    {repo.language}
                </EtikettBase>
            ) : null}
            {repo.subscribers ? (
                <EtikettBase
                    type="info"
                    mini
                    className={classnames('repoPanel__tags', 'repoPanel__tags--subs')}
                >
                    {repo.subscribers}
                    <Star className="repoPanel__tags--icon" />
                </EtikettBase>
            ) : null}
            {repo.packageN ? (
                <EtikettBase
                    type="info"
                    mini
                    className={classnames('repoPanel__tags', 'repoPanel__tags--pack')}
                >
                    {repo.packageN}
                    <FileContent className="repoPanel__tags--icon" />
                </EtikettBase>
            ) : null}
            {repo.private ? (
                <EtikettBase
                    type="info"
                    mini
                    className={classnames('repoPanel__tags', 'repoPanel__tags--private')}
                >
                    Private
                </EtikettBase>
            ) : null}
        </span>
    );
};

interface RepoPanelProps {
    repo: RepoResult;
    className: string;
}

const RepoPanel = (props: RepoPanelProps) => {
    const { repo, className } = props;

    return (
        <Ekspanderbartpanel
            tittel={
                <div>
                    <Undertittel>{repo.name}</Undertittel>
                    {generateTags(repo)}
                </div>
            }
            className={classnames('repoPanel__panel', className)}
        >
            {repo.homepage ? (
                <Ingress>
                    Nettside:{' '}
                    <Lenke href={repo.homepage} target="_blank">
                        {repo.homepage}
                    </Lenke>
                </Ingress>
            ) : null}
            {repo.url ? (
                <Ingress>
                    Github: <Lenke href={repo.url}>{repo.url}</Lenke>
                </Ingress>
            ) : null}
            <Ingress>Opprettet: {new Date(repo.created).toUTCString()}</Ingress>
            <Ingress>Siste push: {new Date(repo.pushed).toUTCString()}</Ingress>
        </Ekspanderbartpanel>
    );
};

export default RepoPanel;
