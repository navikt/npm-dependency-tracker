import React, { Fragment, useEffect } from 'react';
import classnames from 'classnames';
import { useDispatch } from 'react-redux';
import { initialLoad } from '../../redux/modules/currentData';

import Header from '../../components/header/Header';
import Filter from '../../components/filter/Filter';
import Stats from '../../components/stats/Stats';
import Repos from '../../components/displayRepos/DisplayRepos';
import './Home.less';

const clsGrid = (n: number) => {
    return classnames(`mdc-layout-grid__cell`, `mdc-layout-grid__cell--span-${n}`);
};

const Home = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initialLoad());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    return (
        <Fragment>
            <Header />
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
