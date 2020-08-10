import React, { FC, useState, FormEvent } from 'react';
import classnames from 'classnames';
import { Undertittel } from 'nav-frontend-typografi';
import { SkjemaGruppe ,RadioGruppe, Radio, CheckboxGruppe, Checkbox, Input, Select } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';

import filterlogo from '../../assets/filter.svg';
import './Filter.less';
import FilterButton from '../FilterButton/FilterButton';
import semverRegex from 'semver-regex';

export interface FilterData {
    type: string;
    value: string;
}

export interface DepFilterData {
    name: string;
    version: string;
    scope: string;
}

export interface IFilter {
    activity: FilterData;
    preset: FilterData;
    depFilters: DepFilterData[];
}

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

    const [customDeps, setCustomDeps] = useState<DepFilterData[]>([]);
    const [activity, setActivity] = useState<FilterData>()
    const [depName, setDepName] = useState('');
    const [version, setVersion] = useState('');
    const [scope, setScope] = useState('spesific');

    const [error, setError] = useState('');
    const [nameError, setNameError] = useState(false);
    const [versionError, setVersionError] = useState(false);
    const handleClick = (info: FilterData, type:string) => {
        const data: IFilter = {

        }
        onFilterChange();
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        setError('');
        if (!depName.length) {
            setError('Må fylle ut dependency navn'); 
            setNameError(true);
            return
        }
        if (!!version.length && !semverRegex().test(version)) {
            setError('Ikke gylding semver format');
            setVersionError(true);
            return;
        }
        setNameError(false);
        setVersionError(false);

        const data: DepFilterData = {name: depName.toLowerCase(), version: version, scope: !!version.length ? scope : ''}

        setCustomDeps([...customDeps, data]);
    };

    const handleRemove = (data: DepFilterData[]) => {
        setCustomDeps([...data]);
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
                            <Select defaultValue="spesific" bredde="s" onChange={(e) => setScope(e.target.value)}>
                                <option value="spesific">Spesifikk</option>
                                <option value="over">Over</option>
                                <option value="under">Under</option>
                            </Select>
                        </div>
                        <Knapp type="hoved" className="filter__version--margin" kompakt>
                            Legg til
                        </Knapp>
                    </SkjemaGruppe>
                </form>

                <FilterButton onClick={handleRemove} data={customDeps} />

                <RadioGruppe legend="Siste aktivitet" className="filter--toppadding">
                    <Radio
                        onClick={() => handleClick({ type: 'activity', value: 'all' })}
                        label={'Alle'}
                        name="aktivitet"
                    />
                    <Radio
                        onClick={() => handleClick({ type: 'activity', value: '1' })}
                        label={'En månede'}
                        name="aktivitet"
                    />
                    <Radio
                        onClick={() => handleClick({ type: 'activity', value: '3' })}
                        label={'Tre måneder'}
                        name="aktivitet"
                    />
                    <Radio
                        onClick={() => handleClick({ type: 'activity', value: '6' })}
                        label={'Seks Måneder'}
                        name="aktivitet"
                    />
                    <Radio
                        onClick={() => handleClick({ type: 'activity', value: '12' })}
                        label={'Siste år'}
                        name="aktivitet"
                    />
                </RadioGruppe>
                <CheckboxGruppe className="filter--toppadding" legend="Dependency Presets">
                    <Checkbox onClick={() => handleClick({ type: 'dep', value: 'react' })} label={'React'} />
                    <Checkbox
                        onClick={() => handleClick({ type: 'dep', value: 'nav-components' })}
                        label={'navds komponenter'}
                    />
                    <Checkbox
                        onClick={() => handleClick({ type: 'dep', value: 'nav-components-styles' })}
                        label={'navds styles'}
                    />
                </CheckboxGruppe>
            </div>
        </div>
    );
};

export default Filter;
