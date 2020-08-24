import React, { Fragment } from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import { useSelector, useDispatch } from 'react-redux';

import './Header.less';
import logo from '../../assets/logo.svg';

interface HeaderProps {}
interface HeaderState {}

export const Header = <HeaderProps, HeaderState>(
    props: HeaderProps,
    state: HeaderState
) => {
    const dispatch = useDispatch();
    const fill = useSelector((state: HeaderState) => state);

    return (
        <Fragment>
            <header className="header">
                <div className="header__content">
                    <img
                        className="header__logo"
                        src={logo}
                        alt="NAV logo"
                    />
                    <Systemtittel className="header__text">
                        Brukerdata designsystemet NAV
                    </Systemtittel>
                </div>
            </header>
        </Fragment>
    );
};

export default Header;
