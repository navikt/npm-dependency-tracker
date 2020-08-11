import React, { FC, useState, FormEvent, useEffect } from 'react';
import classnames from 'classnames';
import { Undertittel } from 'nav-frontend-typografi';
import { SkjemaGruppe, RadioGruppe, Radio, CheckboxGruppe, Checkbox, Input, Select } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import { FilterData, FilterType, SelectedData, VersionScope, DepNameData, ActivityRange } from '../types';

import filterlogo from '../../assets/filter.svg';
import './Filter.less';
import FilterButton from '../FilterButton/FilterButton';
import semverRegex from 'semver-regex';
import PresetCheckbox from '../PresetCheckbox/PresetCheckbox';

interface FilterProps {
    /**
     * Additional class options
     */
    className?: string;
    /**
     * click handler for filter
     */
    onFilterChange?: (info: FilterData) => void;
}

const Filter: FC<FilterProps> = (props: FilterProps) => {
    const { className = '', onFilterChange = () => null } = props;
    let presets = ["React", "DS Komponenter", "DS Komponenter-styles"];


    const [namedDeps, setNamedDeps] = useState<DepNameData[]>([]);
    const [activity, setActivity] = useState<SelectedData>({ type: FilterType.ACTIVITY, value: ActivityRange.ALL });
    const [depPresets, setDepPresets] = useState<SelectedData[]>([]);

    const [depName, setDepName] = useState('');
    const [version, setVersion] = useState('');
    const [scope, setScope] = useState<VersionScope>(VersionScope.SPESIFIC);

    const [error, setError] = useState('');
    const [nameError, setNameError] = useState(false);
    const [versionError, setVersionError] = useState(false);

    const [filterOptions, setFilterOptions] = useState<FilterData>();

    useEffect(() => {
        if (filterOptions) onFilterChange(filterOptions);
    }, [filterOptions]);

    useEffect(() => {}, [namedDeps, activity, depPresets]);

    const handleClick = (data: SelectedData) => {
        switch (data.type) {
            case FilterType.ACTIVITY:
                setActivity(data);
                break;
            case FilterType.DEPPRESET:
                //setDepPresets();
                break;
            default:
                break;
        }
    };

    const handleCheckbox = (data: SelectedData[]) => {
        return;
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        setError('');
        if (!depName.length) {
            setError('Må fylle ut dependency navn');
            setNameError(true);
            return;
        }
        if (!!version.length && !semverRegex().test(version)) {
            setError('Ikke gylding semver format');
            setVersionError(true);
            return;
        }
        setNameError(false);
        setVersionError(false);

        const data: DepNameData = {
            name: depName.toLowerCase(),
            version: version,
            scope: !!version.length ? scope : VersionScope.SPESIFIC
        };

        setNamedDeps([...namedDeps, data]);
    };

    const handleRemove = (data: DepNameData[]) => {
        setNamedDeps([...data]);
    };

    return (
        <div className={classnames(className, 'filter')}>
            <span className="filter__headline">
                <img className="filter__logo" src={filterlogo} alt="filter-logo" />
                <Undertittel>Filter</Undertittel>
            </span>
            <div className="filter__options">
                <form className="filter__form" onSubmit={(e) => handleSubmit(e)}>
                    <SkjemaGruppe utenFeilPropagering feil={error}>
                        <Input feil={nameError} label="Navn" bredde="L" onChange={(e) => setDepName(e.target.value)} />
                        <div className="filter__options--row">
                            <Input
                                feil={versionError}
                                label="Versjon"
                                bredde="S"
                                onChange={(e) => setVersion(e.target.value)}
                            />
                            <Select defaultValue="spesific" bredde="s" onChange={(e) => setScope(+e.target.value)}>
                                <option value={VersionScope.SPESIFIC}>Spesifikk</option>
                                <option value={VersionScope.UP}>Over</option>
                                <option value={VersionScope.DOWN}>Under</option>
                            </Select>
                        </div>
                        <Knapp type="hoved" className="filter__version--margin" kompakt>
                            Legg til
                        </Knapp>
                    </SkjemaGruppe>
                </form>

                <FilterButton onClick={handleRemove} data={namedDeps} />

                <RadioGruppe legend="Siste aktivitet" className="filter--toppadding">
                    <Radio
                        onClick={() => handleClick({ type: FilterType.ACTIVITY, value: ActivityRange.ALL })}
                        label={'Alle'}
                        name="aktivitet"
                    />
                    <Radio
                        onClick={() => handleClick({ type: FilterType.ACTIVITY, value: ActivityRange.ONE })}
                        label={'En månede'}
                        name="aktivitet"
                    />
                    <Radio
                        onClick={() => handleClick({ type: FilterType.ACTIVITY, value: ActivityRange.THREE })}
                        label={'Tre måneder'}
                        name="aktivitet"
                    />
                    <Radio
                        onClick={() => handleClick({ type: FilterType.ACTIVITY, value: ActivityRange.SIX })}
                        label={'Seks Måneder'}
                        name="aktivitet"
                    />
                    <Radio
                        onClick={() => handleClick({ type: FilterType.ACTIVITY, value: ActivityRange.YEAR })}
                        label={'Siste år'}
                        name="aktivitet"
                    />
                </RadioGruppe>
                <PresetCheckbox onInputChange={handleCheckbox} presets={presets} />
            </div>
        </div>
    );
};

export default Filter;
