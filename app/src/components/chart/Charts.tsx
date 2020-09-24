import React from 'react';
import { useSelector } from 'react-redux';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip
} from 'recharts';
import { RootState } from '../../redux/creator';
import { Undertittel } from 'nav-frontend-typografi';

import './Chart.less';
import { guid } from 'nav-frontend-js-utils';

type renderProps = {
    data: any[];
    lines: string[];
    xAxis: string;
};

const ChartRendrer = (props: renderProps) => {
    const { data, xAxis, lines } = props;
    return (
        <ResponsiveContainer width="100%" height="100%" minHeight="300px" minWidth="600px">
            <LineChart data={data}>
                {lines.map((str) => {
                    return <Line key={guid()} type="linear" dataKey={str} stroke="#8884d8" />;
                })}
                <CartesianGrid stroke="#ddd" strokeDasharray="2 2" />
                <XAxis dataKey={xAxis} />
                <YAxis />
                <Tooltip />
            </LineChart>
        </ResponsiveContainer>
    );
};

const Chart = () => {
    const history = useSelector((state: RootState) => state.AppReducer.server.history);
    return (
        <div className="chart">
            {history.length === 0 ? (
                <Undertittel>Ingen data...</Undertittel>
            ) : (
                <div className="chart__view">
                    {history.map((his) => {
                        if (his.lines.length === 0) return null;
                        else {
                            return (
                                <div key={guid()} className="chart__content">
                                    <Undertittel>{his.name}</Undertittel>
                                    <ChartRendrer
                                        data={his.events}
                                        xAxis={his.xAxis}
                                        lines={his.lines}
                                    />
                                </div>
                            );
                        }
                    })}
                </div>
            )}
        </div>
    );
};

export default Chart;
