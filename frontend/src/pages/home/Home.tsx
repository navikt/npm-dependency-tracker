import React, { Fragment } from 'react'
import classnames from 'classnames';
import './Home.less';


import Header from '../../components/header/Header';
import Filter from '../../components/filter/Filter';
import Results from '../../components/results/Results';
// import { Sidetittel } from 'nav-frontend-typografi';

const Home = () => {
    return (
        <Fragment>
            <Header />
            <main className={classnames("main", "mdc-layout-grid")}>
                <div className="mdc-layout-grid__inner">
                    <Filter className={classnames("mdc-layout-grid__cell", "mdc-layout-grid__cell--span-4")}/>
                    <Results className={classnames("mdc-layout-grid__cell", "mdc-layout-grid__cell--span-8")}/>
                </div>
            </main>
        </Fragment>
    );
};

export default Home;
