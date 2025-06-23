import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);
const donutChartOptions = {
    responsive: true,
    cutout: '75%',
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                boxWidth: 20,
                boxHeight: 20,
                borderRadius: 10,
                usePointStyle: true,
                font: {
                    size: 14,
                },
                padding: 25,
            },
            onHover: function (event) {
                event.native.target.style.cursor = 'pointer';
            },
            onLeave: function (event) {
                event.native.target.style.cursor = 'default';
            },
        },
        datalabels: {
            display: false,
        },
        title: {
            display: true,

            font: {
                size: 18,
            },
        },
    },
};

const ChartComp = ({ type = '', data = {} }) => {
    return (
        <>
            {data?.datasets?.[0]?.data?.some((val) => val > 0) ? (
                <>{type === 'donut' && <Doughnut data={data} options={donutChartOptions} />}</>
            ) : (
                <div className="chart-inner">No Data</div>
            )}
        </>
    );
};

export default ChartComp;
