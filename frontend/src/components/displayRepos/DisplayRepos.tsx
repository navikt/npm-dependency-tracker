import React, { useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import Panel from 'nav-frontend-paneler';
import './DisplayRepos.less';
import { Undertittel } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Søkeknapp } from 'nav-frontend-ikonknapper';

import { RootState } from '../../redux/create';
import filterlogo from '../../assets/filter.svg';

import { Data } from '@nav-frontend/icons';
import { initialLoad, getNames } from '../../redux/modules/currentData';
import { Input } from 'nav-frontend-skjema';
const clsGrid = (n: number) => {
    return classnames(`mdc-layout-grid__cell`, `mdc-layout-grid__cell--span-${n}`);
};

export const DisplayRepos = () => {
    const dispatch = useDispatch();

    const names = useSelector((state: RootState) => state.dataReducer.names);
    return (
        <Fragment>
            <span className={classnames('repos__headline', clsGrid(12))}>
                <Data className="repos__logo" alt-text="Repolist-logo" />
                <Undertittel>Repos</Undertittel>
            </span>
            <span className={classnames('repos__input', clsGrid(7))}>
                <Input placeholder="Søk på filtrerte repo-navn" className="repos__sokInput" />
                <Søkeknapp className="repos__sokButton" />
            </span>
            {names.map((name: string) => {
                return (
                    <Ekspanderbartpanel
                        tittel={name.replace('navikt/', '')}
                        className={classnames(clsGrid(7), 'repos__panel')}
                    >
                        <h1>{name}</h1>
                    </Ekspanderbartpanel>
                );
            })}
        </Fragment>
    );
};

export default DisplayRepos;
