import { PackFilter } from '@nav-frontend/shared-types';
import React, { useEffect, useState } from 'react';
import semverRegex from 'semver-regex';
import { HoyreChevron } from 'nav-frontend-chevron';
import classnames from 'classnames';
import { Input, Select } from 'nav-frontend-skjema';
import { Xknapp } from 'nav-frontend-ikonknapper';

import './FilterPanel.less';
import { useDispatch } from 'react-redux';
import { changePackFilter, removePackFilter } from '../../redux/modules/currentData';

interface FilterPanelProps {
    filter: PackFilter;
    className: string;
}

const FilterPanel = (props: FilterPanelProps) => {
    const { filter, className } = props;

    const dispatch = useDispatch();
    const [name, setName] = useState<{ str: string; error: string }>({
        str: filter.name,
        error: ''
    });
    const [version, setVersion] = useState<{ str: string; error: string }>({
        str: filter.version,
        error: ''
    });
    const [timeline, setTimeline] = useState(filter.timeline);
    useEffect(() => {
        let err = false;
        if (name.str === '') {
            setName({ ...name, error: 'Navn må være satt' });
            err = true;
        } else setName({ ...name, error: '' });
        if (!!version.str.length && !semverRegex().test(version.str)) {
            setVersion({ ...version, error: 'Ikke gyldig semver' });
            err = true;
        } else setVersion({ ...version, error: '' });
        if (err) return;
        dispatch(
            changePackFilter({
                name: name.str,
                version: version.str,
                timeline: timeline,
                key: filter.key
            })
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name.str, version.str, timeline]);

    return (
        <div className={classnames(className, 'filterPanel')}>
            <HoyreChevron className="filterPanel__chevron" />
            <Input
                onChange={(e) => setName({ ...name, str: e.target.value })}
                className="filterPanel__inputLarge"
                bredde="XXL"
                placeholder="Pakkenavn"
                value={name.str}
                feil={name.error}
            />
            <Input
                onChange={(e) => setVersion({ ...version, str: e.target.value })}
                bredde="M"
                placeholder="Versjon"
                value={version.str}
                feil={version.error}
            />
            <Select onChange={(e) => setTimeline(e.target.value)} bredde="s" value={timeline}>
                <option value="eksakt">Eksakt</option>
                <option value="nyere">Nyere</option>
                <option value="eldre">Eldre</option>
            </Select>
            <Xknapp
                onClick={() => dispatch(removePackFilter(filter.key))}
                className="filterPanel__xknapp"
            />
        </div>
    );
};

export default FilterPanel;
