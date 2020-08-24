import React from 'react';
import {
    useSelector,
    useDispatch
} from 'react-redux';

import './Results.less';

interface ResultsProps {}
interface ResultsState {}

export const Results = <ResultsProps, ResultsState>(
    props: ResultsProps,
    state: ResultsState
) => {
    const dispatch = useDispatch();
    const fill = useSelector((state:ResultsState) => state);

    return <div></div>;
};

export default Results;