import React, { Fragment, useState, useMemo, useEffect } from 'react';
import classnames from 'classnames';

import './Home.less';

import Header from '../../components/header/Header';
import Filter, { FilterData } from '../../components/filter/Filter';
import Results from '../../components/results/Results';
import DataFilter from '../../ts/dataFilter';
import { RepoData } from 'crawler/src/dataHandling/repo';

// import { Sidetittel } from 'nav-frontend-typografi';

const Home = () => {

    const filter = useMemo(() => new DataFilter(), []);

    const [activeFilter, setActiveFilter] = useState('all');
    const [versionFilter, setVersionFilter] = useState('spesific');
    const [depFilter, setDepFilter] = useState('');
    const [changeTracker, setChangeTracker] = useState('allspesific');
    
    const [result, setResult] = useState<RepoData[]>([]);


    useEffect( () => {
        filter.init();
        filter.filterData();
        setResult(filter.getFilteredData());
    }, [filter])

    const filterResults = () => {
        filter.filterData(activeFilter, versionFilter, depFilter);
    }

    const handleClick = (info:FilterData):void => {
        console.log(info);
        if(info.type === 'activity') {
            setActiveFilter(info.value);
        }
        else if(info.type === 'version') {
            setVersionFilter(info.value);
        }
        else if(info.type === 'dep') {
            setDepFilter(info.value);
        }
        else return;

        if(changeTracker !== (activeFilter + versionFilter + depFilter)) {
            setChangeTracker(activeFilter + versionFilter + depFilter);
            filterResults();
        }


    }

    return (
        <Fragment>
            <Header />
            <main className={classnames('main', 'mdc-layout-grid')}>
                <div className="mdc-layout-grid__inner">
                    <Filter onClick={handleClick} className={classnames('mdc-layout-grid__cell', 'mdc-layout-grid__cell--span-4')} />
                    <Results error={filter.error} data={result} className={classnames('mdc-layout-grid__cell', 'mdc-layout-grid__cell--span-8')} />
                </div>
            </main>
        </Fragment>
    );
};

export default Home;
