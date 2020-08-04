import React from 'react';

import { Sidetittel, Normaltekst } from 'nav-frontend-typografi';
import AlertStripe from 'nav-frontend-alertstriper';
import Panel from 'nav-frontend-paneler';
import Lenke from 'nav-frontend-lenker';

import './App.less';
import logo from './assets/logo.svg';

const App = () => (
    <main className="container">
        <img src={logo} alt="Nav logo" />
        <Sidetittel>Frontend for package-crawler    </Sidetittel>
    </main>
);

export default App;
