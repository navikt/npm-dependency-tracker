import React, { FormEvent, useState } from 'react';
// import { useDispatch } from 'react-redux';
import classnames from 'classnames';
import { Input, Select } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';

import filterlogo from '../../assets/filter.svg';
import './Filter.less';
import { addPackFilter } from '../../redux/modules/currentData';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/create';
import FilterPanel from '../filterPanel/FilterPanel';

const clsGrid = (n: number) => {
    return classnames(`mdc-layout-grid__cell`, `mdc-layout-grid__cell--span-${n}`);
};

const validSemver = (v: string) => {
    return true;
};

export const Filter = () => {
    const dispatch = useDispatch();
    const [name, setname] = useState<{ str: string; error: string }>({ str: '', error: '' });
    const [version, setversion] = useState<{ str: string; error: string }>({ str: '', error: '' });
    const [timeline, settimeline] = useState<string>('');
    const [bool, setbool] = useState<string>('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        let err = false;
        if (name.str === '') {
            setname({ ...name, error: 'Navn må være satt' });
            err = true;
        } else setname({ ...name, error: '' });
        if (!validSemver(version.str)) {
            setversion({ ...version, error: 'Ikke gyldig semver' });
            err = true;
        } else setversion({ ...version, error: '' });
        if (err) return;
        dispatch(
            addPackFilter({ name: name.str, version: version.str, timeline: timeline, bool: bool })
        );
    };

    const filters = useSelector((state: RootState) => state.dataReducer.packFilter);
    // console.log(JSON.stringify(filters, null, 4));
    return (
        <div className={classnames('mdc-layout-grid__inner', 'filter')}>
            <div className={classnames('filter__headline', clsGrid(12))}>
                <img className="filter__logo" src={filterlogo} alt="filter-logo" />
                <Undertittel>Filter</Undertittel>
                <span className="filter__preset">
                    <Select label="Presets:" bredde="s">
                        <option value="ingen">Ingen</option>
                        <option value="abc">abc</option>
                        <option value="bcd">bcd</option>
                        <option value="cdf">cdf</option>
                    </Select>
                </span>
            </div>
            <div className={clsGrid(12)}>
                <form onSubmit={handleSubmit} className={'mdc-layout-grid__inner'}>
                    <Input
                        feil={name.error}
                        onChange={(e) => setname({ ...name, str: e.target.value })}
                        label="Pakkenavn"
                        className={classnames(clsGrid(4), 'filter--width')}
                    />
                    <Input
                        feil={version.error}
                        onChange={(e) => setversion({ ...version, str: e.target.value })}
                        label="Versjon"
                        className={classnames(clsGrid(2))}
                    />
                    <Select
                        label="Tid"
                        onChange={(e) => settimeline(e.target.value)}
                        className={classnames(clsGrid(2))}
                    >
                        <option value="eksakt">Eksakt</option>
                        <option value="nyere">Nyere</option>
                        <option value="eldre">Eldre</option>
                    </Select>
                    <Select
                        label="Bool"
                        onChange={(e) => setbool(e.target.value)}
                        className={classnames(clsGrid(2))}
                    >
                        <option value="AND">AND &&</option>
                        <option value="OR">OR ||</option>
                        <option value="NOT">NOT X</option>
                    </Select>
                    <Knapp type="hoved" className={classnames(clsGrid(2), 'filter__knapp')}>
                        Legg til
                    </Knapp>
                </form>
            </div>
            <div className={classnames(clsGrid(12), 'filter__container')}>
                {filters.map((filter) => {
                    return <FilterPanel filter={filter} />;
                })}
            </div>
        </div>
    );
};

export default Filter;
