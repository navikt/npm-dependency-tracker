import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import Panel from 'nav-frontend-paneler';
import './Stats.less';
import { Undertittel, Systemtittel } from 'nav-frontend-typografi';

import { Data } from '@nav-frontend/icons';
const clsGrid = (n: number) => {
    return classnames(`mdc-layout-grid__cell`, `mdc-layout-grid__cell--span-${n}`);
};
const clsCell = () => {
    return `mdc-layout-grid__cell`;
};

export const Stats = () => {
    return (
        <Fragment>
            <span className={classnames('stats__headline', clsGrid(12))}>
                <Data className="stats__logo" alt-text="stats-logo" />
                <Undertittel>Statistikk</Undertittel>
            </span>
            <Panel border className={classnames(clsCell(), 'stats__panel')}>
                <Systemtittel>Repos</Systemtittel>
            </Panel>
            <Panel border className={classnames(clsCell(), 'stats__panel')}>
                <h1>Stats</h1>
            </Panel>
            <Panel border className={classnames(clsCell(), 'stats__panel')}>
                <h1>Stats</h1>
            </Panel>
        </Fragment>
    );
};

export default Stats;
