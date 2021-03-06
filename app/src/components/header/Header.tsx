import React, { Fragment } from 'react';
import { Systemtittel } from 'nav-frontend-typografi';

import './Header.less';
import logo from '../../assets/logo.svg';

export const Header = <HeaderProps, HeaderState>(props: HeaderProps, state: HeaderState) => {
    return (
        <Fragment>
            <header className="header">
                <div className="header__content">
                    <img className="header__logo" src={logo} alt="NAV logo" />
                    <Systemtittel className="header__text">Pakkebruk i NAV</Systemtittel>
                </div>
            </header>
        </Fragment>
    );
};

export default Header;
