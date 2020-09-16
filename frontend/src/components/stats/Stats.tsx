import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import Panel from 'nav-frontend-paneler';
import './Stats.less';
import { Undertittel, Systemtittel } from 'nav-frontend-typografi';

import { Data } from '@nav-frontend/icons';
import { RootState } from '../../redux/creator';
import { guid } from 'nav-frontend-js-utils';
import { Stat } from '@nav-frontend/shared-types';
const clsGrid = (n: number) => {
    return classnames(`mdc-layout-grid__cell`, `mdc-layout-grid__cell--span-${n}`);
};
const clsCell = () => {
    return `mdc-layout-grid__cell`;
};

export const Stats = () => {
    const stats = useSelector((state: RootState) => state.AppReducer.server.statistics);
    return (
        <Fragment>
            <span className={classnames('stats__headline', clsGrid(12))}>
                <Data className="stats__logo" alt-text="stats-logo" />
                <Undertittel>Statistikk</Undertittel>
            </span>
            {stats.map((stat: Stat) => {
                return (
                    <Panel key={guid()} border className={classnames(clsCell(), 'stats__panel')}>
                        <Systemtittel>{stat.name}</Systemtittel>
                        {stat.length ? <Undertittel>{stat.length}</Undertittel> : null}
                        {Object.keys(stat).map((key, index) => {
                            if (!['name', 'length'].includes(key)) {
                                return <Undertittel>{`${stat[key]}`}</Undertittel>;
                            }
                            return null;
                        })}
                    </Panel>
                );
            })}
        </Fragment>
    );
};

export default Stats;
