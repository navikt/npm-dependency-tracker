import React, { Fragment, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { initialLoad, update } from '../../redux/appState';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import Header from '../../components/header/Header';
import Filter from '../../components/filter/Filter';
import Stats from '../../components/stats/Stats';
import Repos from '../../components/displayRepos/DisplayRepos';
import './Home.less';
import { RootState } from '../../redux/creator';

const clsGrid = (n: number) => {
    return classnames(`mdc-layout-grid__cell`, `mdc-layout-grid__cell--span-${n}`);
};

const Home = () => {
    const dispatch = useDispatch();

    const firstPack = useRef(true);
    const firstName = useRef(true);
    const packFilter = useSelector((state: RootState) => state.AppReducer.packfilter);
    const nameFilter = useSelector((state: RootState) => state.AppReducer.namefilter);
    const history = useSelector((state: RootState) => state.AppReducer.server.history);

    useEffect(() => {
        dispatch(initialLoad());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        if (firstName.current) {
            firstName.current = false;
            return;
        }
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

    const renderLineChart = () => (
        <LineChart
            width={1200}
            height={500}
            data={history[0].events}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
            <Line type="monotone" dataKey="antall" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="månede" />
            <YAxis />
            <Tooltip />
        </LineChart>
    );

    console.log(history[0]);
    return (
        <Fragment>
            <Header />
            <div>{history[0] ? renderLineChart() : null}</div>
            <main className={classnames('main', 'mdc-layout-grid')}>
                <Filter />
                <div className={'mdc-layout-grid__inner'}>
                    <div className={clsGrid(8)}>
                        <Repos />
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
