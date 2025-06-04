/** @format */

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, ArcElement, Legend, Tooltip, registerables } from 'chart.js';

Chart.register(ArcElement, Legend, Tooltip, ...registerables);

const RiskDistribution = ({ riskDistribution }) => {
    const [timePeriod, setTimePeriod] = useState('yearly');
    const [chartData, setChartData] = useState(null);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    // const months = [
    //     'Jan',
    //     'Feb',
    //     'Mar',
    //     'Apr',
    //     'May',
    //     'Jun',
    //     'Jul',
    //     'Aug',
    //     'Sep',
    //     'Oct',
    //     'Nov',
    //     'Dec',
    // ];

    const getYearlyData = () => {
        if (!riskDistribution || !riskDistribution.dataset) return null;

        const labels = riskDistribution?.dataset[0]?.data?.map((val) => val?.month);

        // months; // Using static months as labels for yearly data
        const datasets = riskDistribution.dataset.map((item) => ({
            label: item.label.charAt(0).toUpperCase() + item.label.slice(1),
            data: item.data.map((entry) => entry.value), // Map to values for each month
            borderColor:
                item.label === 'critical'
                    ? '#FB3A3A'
                    : item.label === 'high'
                      ? '#FF8930'
                      : item.label === 'medium'
                        ? '#FFC217'
                        : '#00B517',
            backgroundColor:
                item.label === 'critical'
                    ? '#FB3A3A'
                    : item.label === 'high'
                      ? '#FF8930'
                      : item.label === 'medium'
                        ? '#FFC217'
                        : '#00B517',
            tension: 0.2,
        }));

        return { labels, datasets };
    };

    const getMonthlyData = () => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
        const datasets = ['Critical', 'High', 'Medium', 'Low'].map((label, index) => ({
            label,
            data: Array.from({ length: daysInMonth }, () => Math.floor(Math.random() * 100)),
            borderColor: ['#FB3A3A', '#FF8930', '#FFC217', '#00B517'][index],
            backgroundColor: ['#FB3A3A', '#FF8930', '#FFC217', '#00B517'][index],
            tension: 0.2,
        }));
        return { labels, datasets };
    };

    const getDataByPeriod = () => {
        switch (timePeriod) {
            case 'monthly':
                return getMonthlyData();
            case 'yearly':
                return getYearlyData();
            default:
                return null;
        }
    };

    useEffect(() => {
        setChartData(getDataByPeriod());
    }, [timePeriod, riskDistribution]);

    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                    },
                },
                onHover: function (event) {
                    event.native.target.style.cursor = 'pointer';
                },
                onLeave: function (event) {
                    event.native.target.style.cursor = 'default';
                },
            },
            datalabels: false,
        },
        scales: {
            x: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 45,
                    minRotation: 0,
                    font: {
                        size: 14,
                    },
                },
                title: {
                    display: true,
                    text: timePeriod === 'monthly' ? 'Days of the Month' : 'Months',
                    font: {
                        size: 16,
                    },
                },
            },
            y: {
                ticks: {
                    display: false, // Hides numeric values on the y-axis
                },
                grid: {
                    drawTicks: false, // Optional: hides tick marks on the y-axis
                },
                border: {
                    display: false, // Optionally hide the border line
                },
            },
        },
        elements: {
            line: {
                borderWidth: 1,
            },
            point: {
                radius: 2,
                hoverRadius: 4,
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <div>
            <div className="char-risk-distribution">
                {chartData ? <Line data={chartData} options={options} /> : <p>Loading data...</p>}
            </div>
        </div>
    );
};

export default RiskDistribution;
