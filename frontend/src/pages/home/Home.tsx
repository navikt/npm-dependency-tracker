import React from 'react';
import './Home.less';


import Header from '../../components/header/Header';
import Filter from '../../components/filter/Filter';
import Results from '../../components/results/Results';
// import { Sidetittel } from 'nav-frontend-typografi';

const Home = () => {
    return (
        <div className="mdc-layout-grid">
            <Header />
            <main>
                <Filter />
                <Results />
            </main>
        </div>
    );
};

export default Home;
