import React, { FC, Fragment } from 'react';
import classnames from 'classnames';
import { Undertittel } from 'nav-frontend-typografi';
import { RepoData } from 'crawler/src/dataHandling/repo';
import { Stats } from '../types';
import Panel from 'nav-frontend-paneler';
import { Element } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Lenke from 'nav-frontend-lenker';
import './Results.less';

interface ResultsProps {
    className?: string;
    /**
     * Filtered data
     */
    repos?: RepoData[];
    /**
     * Generated statistics for repos
     */
    stats: Stats[];
    /**
     * Recieves an error if loading of data went poorly
     */
    error?: string;
}

const Results: FC<ResultsProps> = (props: ResultsProps) => {
    const { className = '', repos = [], error, stats } = props;

    let results =
        repos.length === 0
            ? 'Ingen resultater...'
            : repos.map((x, i) => {
                  return (
                      <Ekspanderbartpanel
                          className="results__repo"
                          key={x.activity}
                          tittel={x.name.split('navikt/')[1]}
                      >
                          <Undertittel className="results__undertittel">
                              <Lenke href={x.url} target="_blank">
                                  Github-Repo
                              </Lenke>
                          </Undertittel>
                          <Undertittel className="results__undertittel"> Siste aktivitet: </Undertittel>
                          <Element>{x.activity}</Element>

                          <Undertittel className="results__undertittel"> Språk: </Undertittel>
                          <Element>{x.language}</Element>

                          <Undertittel className="results__undertittel"> Branch </Undertittel>
                          <Element>{x.branch}</Element>

                          <Undertittel className="results__undertittel"> Dependencies: </Undertittel>

                          <pre>{JSON.stringify(x.packages, null, 4)}</pre>
                      </Ekspanderbartpanel>
                  );
              });
    results = error ? error : results;

    let langStat =
        stats[1]?.name.toLowerCase() === 'språk'
            ? stats[1].data.map((lang: [string, number][]) => {
                  return (
                      <Fragment key={lang[0].toString()}>
                          <Element>{lang[0] + ': ' + lang[1]}</Element>
                      </Fragment>
                  );
              })
            : null;
    let repoStat = stats[0]?.name.toLowerCase() === 'repos' ? <Element>{stats[0].data}</Element> : null;
    return (
        <div className={classnames(className, 'results')}>
            <div className="results__headline">
                <Undertittel>Resultat</Undertittel>
            </div>
            <div className="results__data">
                <div className={classnames('results__data--collumn')}>
                    <Panel border className={classnames('results__panel', 'results__panel--small')}>
                        <Undertittel>Antall Repos</Undertittel>
                        {repoStat}
                    </Panel>
                </div>
                <div className={classnames('results__data--collumn')}>
                    <Panel border className={classnames('results__panel')}>
                        <Undertittel>Språk</Undertittel>
                        {langStat}
                    </Panel>
                </div>
                {results}
            </div>
        </div>
    );
};

export default Results;
