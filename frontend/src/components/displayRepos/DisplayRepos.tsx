import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import './DisplayRepos.less';
import { Undertittel } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Søkeknapp } from 'nav-frontend-ikonknapper';

import { RootState } from '../../redux/create';

import { Data } from '@nav-frontend/icons';
import { Input, Select } from 'nav-frontend-skjema';
import { RepoResult } from '@nav-frontend/shared-types';
import { filterNames } from '../../redux/modules/currentData';
const clsGrid = (n: number) => {
    return classnames(`mdc-layout-grid__cell`, `mdc-layout-grid__cell--span-${n}`);
};
export const DisplayRepos = () => {
    const dispatch = useDispatch();
    const data = useSelector((state: RootState) => state.dataReducer.data as RepoResult[]);

    const [nameFilter, setNameFilter] = useState({ name: '', sortby: '' });

    return (
        <Fragment>
            <span className={classnames('repos__headline', clsGrid(12))}>
                <Data className="repos__logo" alt-text="Repolist-logo" />
                <Undertittel>Repos</Undertittel>
            </span>
            <span className={classnames('repos__input', clsGrid(7))}>
                <Input
                    onChange={(e) => setNameFilter((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Søk på filtrerte repo-navn"
                    className="repos__sokInput"
                />
                <Select bredde="s" className="">
                    <option value="" disabled selected>
                        Sorter etter..
                    </option>
                    <option value="abc">alfabet</option>
                    <option value="bcd">antall packages</option>
                    <option value="cdf">watchers</option>
                </Select>
                {/* <Søkeknapp
                    className="repos__sokButton"
                    onClick={() => dispatch(filterNames('nav-frontend'))}
                /> */}
            </span>
            {data.map((repo: RepoResult) => {
                return (
                    <Ekspanderbartpanel
                        tittel={repo.name}
                        className={classnames(clsGrid(7), 'repos__panel')}
                    ></Ekspanderbartpanel>
                );
            })}
        </Fragment>
    );
};

export default DisplayRepos;
