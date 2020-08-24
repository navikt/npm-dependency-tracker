import React, { Fragment} from 'react';
import classnames from 'classnames';

import './MainPage.less';

const MainPage = () => {

    return (
        <Fragment>
            <main className={classnames('main', 'mdc-layout-grid')}>
                <div className="mdc-layout-grid__inner">
                </div>
            </main>
        </Fragment>
    );
};

export default MainPage;
