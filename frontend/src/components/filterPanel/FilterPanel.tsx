import { PackFilter } from '@nav-frontend/shared-types';
import { Knapp } from 'nav-frontend-knapper';
import React from 'react';

interface FilterPanelProps {
    filter: PackFilter;
}

const FilterPanel = (props: FilterPanelProps) => {
    const { filter } = props;
    return <Knapp type="hoved">{`${filter.name}`} </Knapp>;
};

export default FilterPanel;
