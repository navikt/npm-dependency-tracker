import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import './DisplayRepos.less';
import { Undertittel } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Søkeknapp } from 'nav-frontend-ikonknapper';

import { RootState } from '../../redux/create';

import { Data } from '@nav-frontend/icons';
import { Input } from 'nav-frontend-skjema';
import { RepoResult } from '@nav-frontend/shared-types';
import { filterNames } from '../../redux/modules/currentData';
const clsGrid = (n: number) => {
    return classnames(`mdc-layout-grid__cell`, `mdc-layout-grid__cell--span-${n}`);
};
export const DisplayRepos = () => {
    const dispatch = useDispatch();
    const data = useSelector((state: RootState) => state.dataReducer.data as RepoResult[]);
    return (
        <Fragment>
            <span className={classnames('repos__headline', clsGrid(12))}>
                <Data className="repos__logo" alt-text="Repolist-logo" />
                <Undertittel>Repos</Undertittel>
            </span>
            <span className={classnames('repos__input', clsGrid(7))}>
                <Input
                    onChange={(e) => dispatch(filterNames(e.target.value))}
                    placeholder="Søk på filtrerte repo-navn"
                    className="repos__sokInput"
                />
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
