import React from 'react';
import logo from '../../assets/logo.svg';
import './Home.less';

import { Sidetittel } from 'nav-frontend-typografi';

const Home = () => {
    return (
        <div>
            <Sidetittel>Package-crawler</Sidetittel>
            <img src={logo} alt="nav lo go" />
        </div>
    );
};

export default Home;
