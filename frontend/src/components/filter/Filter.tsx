import React from 'react';
// import { useDispatch } from 'react-redux';
import classnames from 'classnames';
import { Input, Select } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';

import filterlogo from '../../assets/filter.svg';
import './Filter.less';

const clsGrid = (n: number) => {
    return classnames(`mdc-layout-grid__cell`, `mdc-layout-grid__cell--span-${n}`);
};

export const Filter = <FilterProps, FilterState>(props: FilterProps, state: FilterState) => {
    return (
        <div className={classnames('mdc-layout-grid__inner', 'filter')}>
            <div className={classnames('filter__headline', clsGrid(12))}>
                <img className="filter__logo" src={filterlogo} alt="filter-logo" />
                <Undertittel>Filter</Undertittel>
                <Select label="Presets:" bredde="s" className="filter__preset">
                    <option value="ingen">Ingen</option>
                    <option value="abc">abc</option>
                    <option value="bcd">bcd</option>
                    <option value="cdf">cdf</option>
                </Select>
            </div>
            <Input label="Pakkenavn" className={classnames(clsGrid(4), 'filter--width')} />
            <Input label="Versjon" className={classnames(clsGrid(2), 'filter--width')} />
            <div className={classnames(clsGrid(6), 'filter__options')}>
                <Select className="filter--width" bredde="s">
                    <option value="eksakt">Eksakt</option>
                    <option value="nyere">Nyere</option>
                    <option value="eldre">Eldre</option>
                </Select>
                <Select className="filter--width" bredde="s">
                    <option value="AND">AND &&</option>
                    <option value="OR">OR ||</option>
                    <option value="NOT">NOT X</option>
                </Select>
            </div>
            <Knapp type="hoved" className={clsGrid(2)}>
                Legg til
            </Knapp>
        </div>
    );
};

export default Filter;
