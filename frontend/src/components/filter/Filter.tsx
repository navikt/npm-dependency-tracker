import React, { FC } from "react";
import classnames from 'classnames';
import { Undertittel } from 'nav-frontend-typografi';
import { RadioGruppe, Radio, CheckboxGruppe, Checkbox, Input, RadioPanelGruppe } from 'nav-frontend-skjema';

import filterlogo from '../../assets/filter.svg';
import './Filter.less';

interface FilterProps {
    className?: string;
}


const Filter: FC<FilterProps> = (props:FilterProps) => {
    const { className = '' } = props;
    return (
        <div className={classnames(className, "filter")}> 
            <span className="filter__headline">
                <img className="filter__logo" src={filterlogo} alt="filter-logo" />
                <Undertittel>Filter</Undertittel> 
            </span>
            <div className="filter__options">
                <Input label="Versjon" bredde="S"/>
                <RadioGruppe className="filter__version--margin">
                    <Radio label={'Spesifikk'} name="version"/>    
                    <Radio label={'Over'} name="version" />
                    <Radio label={'Under'} name="version" />
                </RadioGruppe>
                <RadioGruppe legend="Siste aktivitet" className="filter--toppadding">
                    <Radio label={'Alle'} name="aktivitet" />
                    <Radio label={'En månede'} name="aktivitet" />
                    <Radio label={'Tre måneder'} name="aktivitet" />
                    <Radio label={'Seks Måneder'} name="aktivitet" />
                    <Radio label={'Siste år'} name="aktivitet" />
                </RadioGruppe>
                <CheckboxGruppe className="filter--toppadding" legend="Dependencies">
                    <Checkbox label={'React'} />
                    <Checkbox label={'navds komponenter'}  />
                    <Checkbox label={'navds styles'}  />
                </CheckboxGruppe>
            </div>
            
        </div>
    );
}

export default Filter;