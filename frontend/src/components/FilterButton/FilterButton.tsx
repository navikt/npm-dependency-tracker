import React, { useEffect } from 'react';
import { Knapp } from 'nav-frontend-knapper';

import './FilterButton.less';
import { DepFilterData } from '../filter/Filter';
import { CloseIcon, UpIcon, DownIcon, SpesificIcon } from '../../assets/icons';

interface FilterButtonProps {
    /**
     * Data to generate buttons from
     */
    data: DepFilterData[];
    /**
     * handler for when dep button is removed
     */
    onClick: (data: DepFilterData[]) => void;
}

const FilterButton = (props: FilterButtonProps) => {
    const { data, onClick } = props;

    const handleClick = (i: number) => {
        let tmpData = data;
        tmpData.splice(i, 1);
        onClick(tmpData);
    };

    const getIcon = (s: string) => {
        switch (s) {
            case 'spesific':
                return <SpesificIcon />;
            case 'over':
                return <UpIcon />;
            case 'under':
                return <DownIcon />;
            default:
                return null;
        }
    };

    useEffect(() => {
        const elem = document.getElementById('hidden_scroll');
        elem?.scrollIntoView(false);
        console.log('test');
    }, [data]);

    const buttons = data.map((dep, i) => {
        return (
            <li key={i}>
                <Knapp className="filterButton" onClick={() => handleClick(i)} kompakt mini>
                    <div className="filterButton__scope">{getIcon(dep.scope)}</div>
                    {dep.scope ? dep.version + ' | ' : null}
                    {dep.name}
                    <CloseIcon />
                </Knapp>
            </li>
        );
    });
    return (
        <ul className="filterButton__list">
            {buttons} 
            <div id="hidden_scroll" />
        </ul>
    );
};

export default FilterButton;
