import React, { Fragment, useEffect } from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { initialLoad } from '../../redux/modules/currentData';
import { RootState } from '../../redux/create';

import './MainPage.less';

const MainPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initialLoad());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);
    const data = useSelector((state: RootState) => state.dataReducer.data);
    return (
        <Fragment>
            <main className={classnames('main', 'mdc-layout-grid')}>
                <div className="mdc-layout-grid__inner">
                    {data.length <= 0 ? <p>LOADING</p> : JSON.stringify(data, null, 4)}
                </div>
            </main>
        </Fragment>
    );
};

export default MainPage;
