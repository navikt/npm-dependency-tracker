import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import './DisplayRepos.less';
import { Undertittel } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
// import { Søkeknapp } from 'nav-frontend-ikonknapper';
import EtikettBase from 'nav-frontend-etiketter';
import NavFrontendSpinner from 'nav-frontend-spinner';
import InfiniteScroll from 'react-infinite-scroller';

import { RootState } from '../../redux/create';

import { Data, Star, FileContent } from '@nav-frontend/icons';
import { Input, Select } from 'nav-frontend-skjema';
import { NameFilter, RepoResult } from '@nav-frontend/shared-types';
import { filterNames } from '../../redux/modules/currentData';
// import Panel from 'nav-frontend-paneler';
const clsGrid = (n: number) => {
    return classnames(`mdc-layout-grid__cell`, `mdc-layout-grid__cell--span-${n}`);
};
export const DisplayRepos = () => {
    const dispatch = useDispatch();

    const [nameFilter, setNameFilter] = useState<NameFilter>({ name: '', sortby: '' });
    const [loadCount, setLoadCount] = useState<number>(2);
    const [displayData, setdisplayData] = useState<RepoResult[]>([]);

    const data = useSelector((state: RootState) => state.dataReducer.data as RepoResult[]);

    useEffect(() => {
        dispatch(filterNames(nameFilter));
    }, [dispatch, nameFilter]);

    useEffect(() => {
        const newData = data.filter((x, y) => {
            if (y <= loadCount * 20) return true;
            return false;
        });
        setdisplayData(newData);
    }, [data, loadCount]);

    const generateTags = (repo: RepoResult) => {
        return (
            <span>
                {repo.size ? (
                    <EtikettBase
                        type="info"
                        mini
                        className={classnames('repos__tags', 'repos__tags--size')}
                    >
                        {repo.size + 'kB'}
                    </EtikettBase>
                ) : null}
                {repo.language ? (
                    <EtikettBase
                        type="info"
                        mini
                        className={classnames('repos__tags', 'repos__tags--lang')}
                    >
                        {repo.language}
                    </EtikettBase>
                ) : null}
                {repo.private ? (
                    <EtikettBase
                        type="info"
                        mini
                        className={classnames('repos__tags', 'repos__tags--private')}
                    >
                        Private
                    </EtikettBase>
                ) : null}
                {repo.subscribers ? (
                    <EtikettBase
                        type="info"
                        mini
                        className={classnames('repos__tags', 'repos__tags--subs')}
                    >
                        {repo.subscribers}
                        <Star className="repos__tags--icon" />
                    </EtikettBase>
                ) : null}
                {repo.packageN ? (
                    <EtikettBase
                        type="info"
                        mini
                        className={classnames('repos__tags', 'repos__tags--pack')}
                    >
                        {repo.packageN}
                        <FileContent className="repos__tags--icon" />
                    </EtikettBase>
                ) : null}
            </span>
        );
    };
    return (
        <Fragment>
            <span className={classnames('repos__headline', clsGrid(12))}>
                <Data className="repos__logo" alt-text="Repolist-logo" />
                <Undertittel>Repos</Undertittel>
            </span>
            <span className={classnames('repos__input', clsGrid(7))}>
                <Input
                    onChange={(e) => setNameFilter({ ...nameFilter, name: e.target.value })}
                    placeholder="Søk på filtrerte repo-navn"
                    className="repos__sokInput"
                />
                <Select
                    bredde="s"
                    className=""
                    onChange={(e) => setNameFilter({ ...nameFilter, sortby: e.target.value })}
                    defaultValue={''}
                >
                    <option value="" disabled>
                        Sorter etter..
                    </option>
                    <option value="alfabet">A-Å</option>
                    <option value="nPackages">antall packages</option>
                    <option value="nWatchers">watchers</option>
                </Select>
                {/* <Søkeknapp
                    className="repos__sokButton"
                    onClick={() => dispatch(filterNames('nav-frontend'))}
                /> */}
            </span>
            <InfiniteScroll
                pageStart={2}
                initialLoad={false}
                loadMore={setLoadCount}
                hasMore={data.length !== 0 && displayData.length !== data.length}
                loader={<NavFrontendSpinner className="repos__spinner" />}
                className="repos__scroller"
            >
                {displayData.map((repo) => {
                    return (
                        <Ekspanderbartpanel
                            tittel={
                                <div>
                                    <Undertittel>{repo.name}</Undertittel>
                                    {generateTags(repo)}
                                </div>
                            }
                            className={classnames(clsGrid(7), 'repos__panel')}
                        >
                            {repo.created}
                        </Ekspanderbartpanel>
                    );
                })}
            </InfiniteScroll>
        </Fragment>
    );
};

export default DisplayRepos;
