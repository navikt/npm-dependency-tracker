import React from 'react';
import { Systemtittel } from 'nav-frontend-typografi';

import logo from '../../assets/logo.svg';

import './Header.less';

const Header = () => {
    return (
        <header className="header">
            <div className="header__content">
                <img className="header__logo" src={logo} alt="NAV logo" />
                <Systemtittel className="header__text">Brukerdata designsystemet NAV</Systemtittel>
            </div>
        </header>
    );
};

export default Header;
