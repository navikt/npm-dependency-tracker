import React from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip
} from 'recharts';

type renderProps = {
    data: any[];
    yAxis: string;
    xAxis: string;
};

const ChartRendrer = (props: renderProps) => {
    const { data, xAxis, yAxis } = props;
    return (
        <ResponsiveContainer width="100%" height="100%" minHeight="300px" minWidth="600px">
            <LineChart data={data}>
                <Line
                    type="linear"
                    dataKey={yAxis}
                    stroke="#8884d8"
                    dot={{ stroke: '#333', strokeWidth: 1 }}
                />
                <CartesianGrid stroke="#ddd" strokeDasharray="2 2" />
                <XAxis dataKey={xAxis} />
                <YAxis />
                <Tooltip />
            </LineChart>
        </ResponsiveContainer>
    );
};

const Chart = () => {
    return <h1>test</h1>;
};

export default Chart;
