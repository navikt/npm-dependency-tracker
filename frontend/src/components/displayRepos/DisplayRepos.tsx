import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import './DisplayRepos.less';
import { Undertittel } from 'nav-frontend-typografi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import InfiniteScroll from 'react-infinite-scroller';

import { RootState } from '../../redux/create';

import { Data } from '@nav-frontend/icons';
import { Input, Select, Checkbox } from 'nav-frontend-skjema';
import { NameFilter, RepoResult } from '@nav-frontend/shared-types';
import { filterNames } from '../../redux/modules/currentData';
import RepoPanel from '../repoPanel/RepoPanel';

const clsGrid = (n: number) => {
    return classnames(`mdc-layout-grid__cell`, `mdc-layout-grid__cell--span-${n}`);
};

export const DisplayRepos = () => {
    const dispatch = useDispatch();

    const [nameFilter, setNameFilter] = useState<NameFilter>({
        name: '',
        sortby: '',
        withWebsite: false,
        isPrivate: false
    });
    const [loadCount, setLoadCount] = useState<number>(1);
    const [displayData, setdisplayData] = useState<RepoResult[]>([]);

    const data = useSelector((state: RootState) => state.dataReducer.data as RepoResult[]);

    useEffect(() => {
        dispatch(filterNames(nameFilter));
    }, [dispatch, nameFilter]);

    useEffect(() => {
        const newData = data.filter((x, y) => {
            if (y <= loadCount * 30) return true;
            return false;
        });
        setdisplayData(newData);
    }, [data, loadCount]);
    return (
        <Fragment>
            <span className={classnames('repos__headline', clsGrid(12))}>
                <Data className="repos__logo" alt-text="Repolist-logo" />
                <Undertittel>Repos</Undertittel>
            </span>
            <div className={classnames('repos__filters', clsGrid(7))}>
                <span className={'repos__input'}>
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
                        <option value="opprettet">Dato opprettet</option>
                        <option value="nPackages">Package.json</option>
                        <option value="nWatchers">Watchers</option>
                    </Select>
                </span>
                <span className="repos__checkboxes">
                    <Checkbox
                        className="repos--rightMargin"
                        onClick={(e) =>
                            setNameFilter({ ...nameFilter, withWebsite: !nameFilter.withWebsite })
                        }
                        label="Nettside"
                    />
                    <Checkbox
                        className="repos--rightMargin"
                        onClick={(e) =>
                            setNameFilter({ ...nameFilter, isPrivate: !nameFilter.isPrivate })
                        }
                        label="Privat"
                    />
                </span>
            </div>
            <InfiniteScroll
                pageStart={1}
                initialLoad={false}
                loadMore={setLoadCount}
                hasMore={data.length !== 0 && displayData.length !== data.length}
                loader={<NavFrontendSpinner key="-1" className="repos__spinner" />}
                className="repos__scroller"
            >
                {displayData.map((repo) => {
                    return <RepoPanel key={repo.name} className={clsGrid(7)} repo={repo} />;
                })}
            </InfiniteScroll>
        </Fragment>
    );
};

export default DisplayRepos;
