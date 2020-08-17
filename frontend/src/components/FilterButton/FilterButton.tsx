import React, { useEffect } from 'react';
import { Knapp } from 'nav-frontend-knapper';

import './FilterButton.less';
import { DepNameData, VersionScope, BoolOperators } from '../types';
import { CloseIcon, UpIcon, DownIcon, SpesificIcon } from '../../assets/icons';

interface FilterButtonProps {
    /**
     * Data to generate buttons from
     */
    data: DepNameData[];
    /**
     * handler for when dep button is removed
     */
    onClick: (data: DepNameData[]) => void;
}

const FilterButton = (props: FilterButtonProps) => {
    const { data, onClick } = props;

    const handleClick = (i: number) => {
        let tmpData = data;
        tmpData.splice(i, 1);
        onClick(tmpData);
    };

    const getIcon = (s: VersionScope) => {
        switch (s) {
            case VersionScope.SPESIFIC:
                return <SpesificIcon />;
            case VersionScope.UP:
                return <UpIcon />;
            case VersionScope.DOWN:
                return <DownIcon />;
            default:
                return null;
        }
    };

    useEffect(() => {
        const elem = document.getElementById('hidden_scroll');
        elem?.scrollIntoView(false);
    }, [data]);

    const operator = (op: BoolOperators | undefined) => {
        if (op === undefined) return '';
        if (op === BoolOperators.AND) return '&&';
        else if (op === BoolOperators.OR) return '||';
        else return '!';
    };
    const buttons = data.map((dep, i) => {
        return (
            <li className="filterButton__li" key={i}>
                <Knapp className="filterButton" onClick={() => handleClick(i)} kompakt mini>
                    <div className="filterButton__scope">{getIcon(dep.scope)}</div>
                    {dep.scope || dep.scope === VersionScope.UP ? dep.version : null}
                    {' ' + operator(dep.operator) + ' '}
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
