import React, { FC } from 'react';
import classnames from 'classnames';
import { Undertittel } from 'nav-frontend-typografi';
import { RepoData } from 'crawler/src/dataHandling/repo';

import resultsLogo from '../../assets/resultat.svg';
import './Results.less';

interface ResultsProps {
    className?: string;
    /**
     * Filtered data
     */
    data?: RepoData[];
    /**
     * Recieves an error if loading of data went poorly
     */
    error?: string;
}

const Results: FC<ResultsProps> = (props: ResultsProps) => {
    const { className = '', data = [] , error} = props;

    
    let results =
        data.length === 0
            ? 'Ingen resultater...'
            : data.map((x, i) => {
                  return <p>Data {i}</p>;
              });
    results = error && error.length > 0 ? error : results;

    return (
        <div className={classnames(className, 'results')}>
            <div className="results__headline">
                <img className="results__logo" src={resultsLogo} alt="Resultat-logo" />
                <Undertittel>Resultat</Undertittel>
            </div>
            <div className="results__data">
                {results}
            </div>
        </div>
    );
};

export default Results;
