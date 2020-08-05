import React, { FC } from "react";
import classnames from 'classnames';
import { Undertittel } from 'nav-frontend-typografi';

import filterlogo from '../../assets/filter.svg';
import './Filter.less';

interface FilterProps {
    className?: string;
}


const Filter: FC<FilterProps> = (props:FilterProps) => {
    const { className = '' } = props;
    return (
        <div className={classnames(className, "filter")}> 
            <img className="filter__logo" src={filterlogo} alt="filter-logo" />
            <Undertittel>Filter</Undertittel> 
        </div>
    );
}

export default Filter;