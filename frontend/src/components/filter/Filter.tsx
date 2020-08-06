import React, { FC } from 'react';
import classnames from 'classnames';
import { Undertittel } from 'nav-frontend-typografi';
import { RadioGruppe, Radio, CheckboxGruppe, Checkbox, Input } from 'nav-frontend-skjema';

import filterlogo from '../../assets/filter.svg';
import './Filter.less';

export interface FilterData {
    type: string;
    value: string;
}

interface FilterProps {
    /**
     * Additional class options
     */
    className?: string;
    /**
     * click handler for filter
     */
    onClick?: (info: FilterData) => void;
}

const Filter: FC<FilterProps> = (props: FilterProps) => {
    const { className = '', onClick = () => null } = props;

    const handleClick = (info: FilterData) => {
        onClick(info);
    };

    return (
        <div className={classnames(className, 'filter')}>
            <span className="filter__headline">
                <img className="filter__logo" src={filterlogo} alt="filter-logo" />
                <Undertittel>Filter</Undertittel>
            </span>
            <div className="filter__options">
                <Input label="Versjon" bredde="S" />
                <RadioGruppe className="filter__version--margin">
                    <Radio
                        onClick={() => handleClick({ type: 'version', value: 'spesific' })}
                        label={'Spesifikk'}
                        name="version"
                    />
                    <Radio
                        onClick={() => handleClick({ type: 'version', value: 'over' })}
                        label={'Over'}
                        name="version"
                    />
                    <Radio
                        onClick={() => handleClick({ type: 'version', value: 'under' })}
                        label={'Under'}
                        name="version"
                    />
                </RadioGruppe>
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
                <CheckboxGruppe className="filter--toppadding" legend="Dependencies">
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
