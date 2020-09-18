import React, { Fragment, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { initialLoad, update } from '../../redux/appState';

import Tabs from 'nav-frontend-tabs';
import Header from '../../components/header/Header';
import Filter from '../../components/filter/Filter';
import Stats from '../../components/stats/Stats';
import Repos from '../../components/displayRepos/DisplayRepos';

import { Data, Sandglass } from '@nav-frontend/icons';

import './Home.less';
import { RootState } from '../../redux/creator';
import { Undertittel } from 'nav-frontend-typografi';
import Chart from '../../components/chart/Charts';

const clsGrid = (n: number) => {
    return classnames(`mdc-layout-grid__cell`, `mdc-layout-grid__cell--span-${n}`);
};

const Home = () => {
    const dispatch = useDispatch();

    const firstPack = useRef(true);
    const firstName = useRef(true);
    const packFilter = useSelector((state: RootState) => state.AppReducer.packfilter);
    const nameFilter = useSelector((state: RootState) => state.AppReducer.namefilter);

    const [tabs, setTabs] = useState(0);

    useEffect(() => {
        dispatch(initialLoad());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (firstName.current) {
            firstName.current = false;
            return;
        }
        console.count('namefilter');
        dispatch(update());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nameFilter]);
    useEffect(() => {
        if (firstPack.current) {
            firstPack.current = false;
            return;
        }
        dispatch(update());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [packFilter]);

    return (
        <Fragment>
            <Header />
            <main className={classnames('main', 'mdc-layout-grid')}>
                <Filter />
                <div className={classnames('mdc-layout-grid__inner', 'main__content')}>
                    <div className={clsGrid(8)}>
                        <div className="main__tabs">
                            <Tabs
                                onChange={(e, i) => {
                                    setTabs(i);
                                }}
                            >
                                <Tabs.Tab>
                                    <span className="main__tab">
                                        <Data className="main__logo" alt-text="Repo-ikon" />
                                        <Undertittel>Repos</Undertittel>
                                    </span>
                                </Tabs.Tab>
                                <Tabs.Tab aktiv>
                                    <span className="main__tab">
                                        <Sandglass
                                            className="main__logo"
                                            alt-text="Historie-ikon"
                                        />
                                        <Undertittel>Historie</Undertittel>
                                    </span>
                                </Tabs.Tab>
                            </Tabs>
                        </div>
                        {tabs === 0 ? <Repos /> : <Chart />}
                    </div>
                    <aside className={clsGrid(4)}>
                        <Stats />
                    </aside>
                </div>
                {/*

            <Chart  />
        <Footer /> */}
            </main>
        </Fragment>
    );
};

export default Home;
