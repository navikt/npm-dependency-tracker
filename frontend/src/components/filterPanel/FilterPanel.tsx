import { PackFilter } from '@nav-frontend/shared-types';
import { Knapp } from 'nav-frontend-knapper';
import React from 'react';
import classnames from 'classnames';
import { Input, Select } from 'nav-frontend-skjema';

import './FilterPanel.less';

interface FilterPanelProps {
    filter: PackFilter;
    className: string;
}

const FilterPanel = (props: FilterPanelProps) => {
    const { filter, className } = props;
    return (
        <div className={classnames(className, 'filterPanel')}>
            <Input
                className="filterPanel__inputLarge"
                bredde="XXL"
                placeholder="Pakkenavn"
                value={filter.name}
            />
            <Input bredde="M" placeholder="Versjon" value={filter.version} />
            <Select bredde="s">
                <option value="eksakt">Eksakt</option>
                <option value="nyere">Nyere</option>
                <option value="eldre">Eldre</option>
            </Select>
            <Select bredde="s">
                <option value="AND">AND &&</option>
                <option value="OR">OR ||</option>
                <option value="NOT">NOT X</option>
            </Select>
        </div>
    );
};

export default FilterPanel;
