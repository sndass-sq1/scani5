import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ucFirst } from '../utils/UcFirst';
// Register Chart.js components and plugins
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Piechart = ({ vuldata }) => {
    let label = vuldata
        ? Object.keys(vuldata)
              ?.slice(0, 4)
              .map((label) => ucFirst(label))
        : '';
    let datavalue = vuldata ? Object.values(vuldata)?.slice(0, 4) : '';
    const data = {
        labels: label,
        datasets: [
            {
                label: 'Votes',
                data: datavalue,
                backgroundColor: ['#ea2727', '#f59e0b', '#facc15', '#8fdb4f', '#19bef0'],
                borderColor: ['#ea2727', '#f59e0b', '#facc15', '#8fdb4f', '#19bef0'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,

        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 20, // Legend box width
                    boxHeight: 20, // Legend box height

                    font: {
                        size: 14,
                    },
                    padding: 10,
                    width: 100,
                    maxWidth: 200,
                    usePointStyle: true,
                    pointStyle: 'rectRounded',
                },
            },
            tooltip: {
                enabled: true,
            },
            datalabels: {
                display: false,
            },
        },
    };
    return (
        <div className="piechart">
            {data?.datasets?.[0]?.data?.some((val) => val > 0) ? (
                <Pie data={data} options={options} />
            ) : (
                <div className="chart-inner">No Data</div>
            )}
        </div>
    );
};

export default Piechart;
