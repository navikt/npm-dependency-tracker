import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import NavFrontendSpinner from 'nav-frontend-spinner';
import InfiniteScroll from 'react-infinite-scroller';

import { Input, Select, Checkbox } from 'nav-frontend-skjema';
import { NameFilter, RepoResult } from '@nav-frontend/shared-types';
import RepoPanel from '../repoPanel/RepoPanel';
import { RootState } from '../../redux/creator';
import { nameFilterSlice } from '../../redux/appState';

import './DisplayRepos.less';

const clsGrid = (n: number) => {
    return classnames(`mdc-layout-grid__cell`, `mdc-layout-grid__cell--span-${n}`);
};

export const DisplayRepos = () => {
    const dispatch = useDispatch();

    const [nameFilter, setNameFilter] = useState<NameFilter>({
        name: '',
        sortby: '',
        withWebsite: false,
        isPrivate: false,
        isArchived: false
    });
    const [loadCount, setLoadCount] = useState<number>(1);
    const [reverse, setReverse] = useState<boolean>(false);
    const [displayData, setdisplayData] = useState<RepoResult[]>([]);

    let data = useSelector((state: RootState) => state.AppReducer.server.repos);
    let filter = useSelector((state: RootState) => state.AppReducer.namefilter);

    useEffect(() => {
        if (JSON.stringify(filter) !== JSON.stringify(nameFilter)) {
            setNameFilter(filter);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch(nameFilterSlice.actions.CHANGE_NAMEFILTER(nameFilter));
    }, [dispatch, nameFilter]);

    useEffect(() => {
        let d = [...data];
        if (reverse) d.reverse();
        const newData = d.filter((x, y) => {
            if (y <= loadCount * 30) return true;
            return false;
        });

        setdisplayData(newData);
    }, [data, loadCount, reverse]);
    return (
        <Fragment>
            <div className={classnames('repos__filters', clsGrid(7))}>
                <span className={'repos__input'}>
                    <Input
                        onChange={(e) => setNameFilter({ ...nameFilter, name: e.target.value })}
                        placeholder="Søk på filtrerte repo-navn"
                        className="repos__sokInput"
                        value={nameFilter.name}
                    />
                    <Select
                        bredde="s"
                        className=""
                        onChange={(e) => setNameFilter({ ...nameFilter, sortby: e.target.value })}
                        value={nameFilter.sortby}
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
                        checked={nameFilter.withWebsite}
                        className="repos--rightMargin"
                        onChange={(e) =>
                            setNameFilter({ ...nameFilter, withWebsite: !nameFilter.withWebsite })
                        }
                        label="Nettside"
                    />
                    <Checkbox
                        checked={nameFilter.isPrivate}
                        className="repos--rightMargin"
                        onChange={(e) =>
                            setNameFilter({ ...nameFilter, isPrivate: !nameFilter.isPrivate })
                        }
                        label="Privat"
                    />
                    <Checkbox
                        checked={nameFilter.isArchived}
                        className="repos--rightMargin"
                        onChange={(e) =>
                            setNameFilter({ ...nameFilter, isArchived: !nameFilter.isArchived })
                        }
                        label="Ikke Arkivert"
                    />
                    <Checkbox
                        className="repos--rightMargin"
                        onChange={(e) => setReverse(!reverse)}
                        label="Flip list"
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
