import React, { useEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const CustomDoughnut = ({ data, from }) => {
    const chartRef = useRef(null);

    // Extract data based on `from` prop
    let chartLabels, chartValues, chartColors;

    if (from === 'vul') {
        // Vulnerability data: Open vs Closed
        const open = data?.Open || 0;
        const closed = data?.Closed || 0;
        chartLabels = ['Open', 'Closed'];
        chartValues = [open, closed];
        chartColors = ['#FF5733', '#4CAF50']; // Red for Open, Green for Closed
    } else {
        // Default Severity Data
        const low = data?.low || 0;
        const medium = data?.medium || 0;
        const high = data?.high || 0;
        const critical = data?.critical || 0;
        chartLabels = ['Low', 'Medium', 'High', 'Critical'];
        chartValues = [low, medium, high, critical];
        chartColors = ['#00B517', '#FFC217', '#FF8930', '#FB3A3A'];
    }

    // Check if there is any data to display
    const hasData = chartValues.some((value) => value > 0);

    // Define the data for the Doughnut chart
    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                label: from === 'vul' ? 'Open vs Closed' : 'Severity Distribution',
                data: chartValues,
                backgroundColor: chartColors,
                spacing: 5,
                borderWidth: 1,
            },
        ],
    };

    // Define the options for the Doughnut chart
    const chartOptions = {
        responsive: true,
        cutout: '85%',
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 20,
                    font: { size: 14 },
                    padding: 10,
                    usePointStyle: true,
                    pointStyle: 'rectRounded',
                },
                onHover: function (event) {
                    event.native.target.style.cursor = 'pointer';
                },
                onLeave: function (event) {
                    event.native.target.style.cursor = 'default';
                },
            },
            title: {
                display: true,
                align: 'start',
                color: '#727272',
                // text: from === 'vul' ? 'Vulnerability status' : 'Severity Distribution',
                font: { size: 18 },
            },
            datalabels: false,
        },
    };

    // Ensure chart updates correctly
    useEffect(() => {
        if (!chartRef.current) return;
        setTimeout(() => {
            chartRef.current?.update();
        }, 300);
    }, [data, from]);

    return (
        <div className="cus-doughnut">
            {hasData ? (
                <>
                    <div className="doughnut-chart">
                        <Doughnut ref={chartRef} data={chartData} options={chartOptions} />
                    </div>

                    {/* Inner Circle Image */}
                    <img
                        src={`/images/dashboard/inner-circle.svg`}
                        alt="Inner Circle"
                        className="inner-circle"
                    />
                </>
            ) : (
                <div className="doughnut-nodata">
                    {/* <img src={`/images/Nodata.png`} alt="No Data" /> */}
                    <div className="chart-inner">No Data</div>
                </div>
            )}
        </div>
    );
};

export default CustomDoughnut;
