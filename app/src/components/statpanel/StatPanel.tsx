import { Stat } from '@nav-frontend/shared-types';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { guid } from 'nav-frontend-js-utils';
import { Input } from 'nav-frontend-skjema';
import { Ingress } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import './StatPanel.less';

interface StatPanelProps {
    stat: Stat;
    className: string;
}

const StatPanel = (props: StatPanelProps) => {
    const { stat, className } = props;

    const [filter, setFilter] = useState<string>('');
    return (
        <Ekspanderbartpanel tittel={stat.name} className={className}>
            <Input
                placeholder="Key"
                onChange={async (e) => setFilter(e.target.value)}
                className="statsPanel__input"
            />
            <div className="statsPanel__panel">
                {Object.keys(stat).map((key, index) => {
                    if (
                        !['name', 'length'].includes(key) &&
                        stat[key][0].toLowerCase().indexOf(filter) !== -1
                    ) {
                        return (
                            <span key={guid()} className="statsPanel__statData">
                                <Ingress>{`${stat[key][0]}: `}</Ingress>
                                <Ingress>{`${stat[key][1]}`}</Ingress>
                            </span>
                        );
                    }
                    return null;
                })}
            </div>
        </Ekspanderbartpanel>
    );
};

export default StatPanel;
