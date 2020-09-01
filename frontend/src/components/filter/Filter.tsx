import React from 'react';
import {
    useSelector,
    useDispatch
} from 'react-redux';

import './Filter.less';

interface FilterProps {}
interface FilterState {}

export const Filter = <FilterProps, FilterState>(
    props: FilterProps,
    state: FilterState
) => {
    const dispatch = useDispatch();
    const fill = useSelector((state:FilterState) => state);

    return <div></div>;
};

export default Filter;
