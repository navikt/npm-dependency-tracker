import React, { FC } from "react";
import classnames from 'classnames';
import { Undertittel } from 'nav-frontend-typografi';

import resultsLogo from '../../assets/resultat.svg';
import './Results.less';

interface ResultsProps {
    className?: string;
}


const Results: FC<ResultsProps> = (props:ResultsProps) => {
    const { className = '' } = props;
    return (
        <div className={classnames(className, "results")}> 
            <img className="results__logo" src={resultsLogo} alt="Resultat-logo" />
            <Undertittel>Resultat</Undertittel>  
        </div>
    );
}

export default Results;