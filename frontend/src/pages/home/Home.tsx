import React, { Fragment, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { initialLoad, update } from '../../redux/modules/currentData';

import Header from '../../components/header/Header';
import Filter from '../../components/filter/Filter';
import Stats from '../../components/stats/Stats';
import Repos from '../../components/displayRepos/DisplayRepos';
import './Home.less';
import { RootState } from '../../redux/create';

const clsGrid = (n: number) => {
    return classnames(`mdc-layout-grid__cell`, `mdc-layout-grid__cell--span-${n}`);
};

const Home = () => {
    const dispatch = useDispatch();

    const firstPack = useRef(true);
    const firstName = useRef(true);
    const packFilter = useSelector((state: RootState) => state.dataReducer.packFilter);
    const nameFilter = useSelector((state: RootState) => state.dataReducer.namesFilter);
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
