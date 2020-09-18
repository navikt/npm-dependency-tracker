import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import Panel from 'nav-frontend-paneler';
import './Stats.less';
import { Undertittel, Ingress } from 'nav-frontend-typografi';

import { Data } from '@nav-frontend/icons';
import { RootState } from '../../redux/creator';
import { guid } from 'nav-frontend-js-utils';
import { Stat } from '@nav-frontend/shared-types';
import StatPanel from '../statpanel/StatPanel';

const clsGrid = (n: number) => {
    return classnames(`mdc-layout-grid__cell`, `mdc-layout-grid__cell--span-${n}`);
};
const clsCell = () => {
    return `mdc-layout-grid__cell`;
};

export const Stats = () => {
    const stats = useSelector((state: RootState) => state.AppReducer.server.statistics);

    const genPanel = (stat: Stat) => {
        if (Object.keys(stat).length < 6) {
            return (
                <Panel key={guid()} border className={classnames(clsCell(), 'stats__panel')}>
                    <Undertittel>{stat.name}</Undertittel>
                    {Object.keys(stat).map((key, index) => {
                        if (!['name'].includes(key)) {
                            return (
                                <span key={guid()} className="stats__statData">
                                    <Ingress>{`${stat[key][0]}: `}</Ingress>
                                    <Ingress>{`${stat[key][1]}`}</Ingress>
                                </span>
                            );
                        }
                        return null;
                    })}
                </Panel>
            );
        } else {
            return (
                <StatPanel
                    key={guid()}
                    stat={stat}
                    className={classnames(clsCell(), 'stats__panel')}
                />
            );
        }
    };
    return (
        <Fragment>
            <span className={classnames('stats__headline', clsGrid(12))}>
                <Data className="stats__logo" alt-text="stats-logo" />
                <Undertittel>Statistikk</Undertittel>
            </span>
            {stats.map((stat: Stat) => {
                return genPanel(stat);
            })}
        </Fragment>
    );
};

export default Stats;
