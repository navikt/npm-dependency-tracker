import React, { Fragment, useState, useMemo, useEffect } from 'react';
import classnames from 'classnames';

import './Home.less';

import Header from '../../components/header/Header';
import Filter from '../../components/filter/Filter';
import Results from '../../components/results/Results';
import DataFilter from '../../ts/DataFilter';
import { RepoData } from 'crawler/src/dataHandling/repo';
import { FilterData, Stats } from '../../components/types';

// import { Sidetittel } from 'nav-frontend-typografi';

const Home = () => {

    const filtration = useMemo(() => new DataFilter(), []);    
    const [result, setResult] = useState<RepoData[]>([]);
    const [stats, setStats] = useState<Stats[]>([]);

    useEffect(() => {
        filtration.generateStats();
        setStats(filtration.getStats());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result]);

    useEffect( () => {
        setResult([...filtration.getFilteredData()]);
    }, [filtration]);

    const handleFilter = (data:FilterData):void => {
        filtration.runFilter(data);
        setResult([...filtration.getFilteredData()]);
    }

    return (
        <Fragment>
            <Header />
            <main className={classnames('main', 'mdc-layout-grid')}>
                <div className="mdc-layout-grid__inner">
                    <Filter onFilterChange={handleFilter} className={classnames('mdc-layout-grid__cell', 'mdc-layout-grid__cell--span-4')} />
                    <Results error={filtration.error} repos={result} stats={stats} className={classnames('mdc-layout-grid__cell', 'mdc-layout-grid__cell--span-8')} />
                </div>
            </main>
        </Fragment>
    );
};

export default Home;
