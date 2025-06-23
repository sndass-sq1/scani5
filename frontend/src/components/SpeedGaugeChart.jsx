import React, { useRef, useEffect } from 'react';
import { Chart, ArcElement } from 'chart.js';

Chart.register(ArcElement);

const SpeedGaugeChart = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const speed = data?.risk * 10 ? data?.risk * 10 - 1.8 : 0;
        // 58.2
        const pointer = {
            id: 'pointer',
            defaults: {
                percentage: 0,
                maxAngle: 0,
            },
            afterDraw: (chart, args, opt) => {
                const { ctx } = chart;

                const data = chart._metasets[0].data[0];
                const radius = data.innerRadius + (data.outerRadius - data.innerRadius) / 2;

                const centerX = data.x;
                const centerY = data.y;

                const angle =
                    Math.PI * (speed / 100) * chart.options.plugins.pointer.percentage + Math.PI;

                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);

                ctx.save();

                ctx.beginPath();
                ctx.lineWidth = 4;
                ctx.arc(x, y, 12, 0, 2 * Math.PI);
                // ctx.fillText("75%", centerX, centerY - 15);

                ctx.strokeStyle = 'white';
                ctx.stroke();

                ctx.restore();

                ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'; // Darker shadow for more contrast
                ctx.shadowBlur = 1; // Blur radius to make the shadow softer and more spread
                // ctx.shadowOffsetX = 5; // Horizontal offset to push the shadow to the right
                // ctx.shadowOffsetY = 5;
            },
        };

        const chartData = {
            datasets: [
                {
                    data: [
                        data?.risk * 10 ? data?.risk * 10 : 0,
                        data?.risk * 10 ? 100 - data?.risk * 10 : 0,
                    ],
                    backgroundColor: [
                        data?.risk >= 1 && data?.risk <= 3
                            ? '#8ECF56'
                            : data?.risk >= 4 && data?.risk <= 6
                              ? '#FFD60A'
                              : data?.risk >= 7 && data?.risk <= 8
                                ? '#FFB933'
                                : data?.risk >= 9 && data?.risk <= 10
                                  ? '#EA4444'
                                  : '#8ECF56',
                        '#E5EAFC', // Default second color for other value
                    ],
                    // backgroundColor: ["rgba(231, 76, 60, 1)", "#E5EAFC"],
                    borderColor: [
                        'rgba(231, 76, 60, 1)',
                        '#E5EAFC',
                        // "rgba(255, 255, 255 ,1)",
                    ],
                    borderWidth: 0,
                    borderRadius: 3,
                },
            ],
        };

        const chartOptions = {
            cutout: 77,
            rotation: -90,
            circumference: 180,
            animation: {
                onProgress: function (context) {
                    if (context.initial) {
                        this.options.plugins.pointer.percentage =
                            context.currentStep / context.numSteps;
                    }
                },
            },

            maintainAspectRatio: false,
            plugins: {
                tooltip: { enabled: false },
                pointer: { currentAngle: 1 },
                datalabels: {
                    display: false,
                },
            },
        };

        const chart = new Chart(chartRef.current, {
            type: 'doughnut',
            data: chartData,
            options: chartOptions,
            plugins: [pointer],
        });

        return () => {
            chart.destroy();
        };
    }, [data]);

    return (
        <div className="SpeedGaugeChart">
            <canvas ref={chartRef} width="500" height="184"></canvas>
            <span
                className="SpeedGaugeChart__percentage"
                style={{
                    color:
                        data?.risk >= 1 && data?.risk <= 3
                            ? '#8ECF56'
                            : data?.risk >= 4 && data?.risk <= 6
                              ? '#FFD60A'
                              : data?.risk >= 7 && data?.risk <= 8
                                ? '#FFB933'
                                : data?.risk >= 9 && data?.risk <= 10
                                  ? '#EA4444'
                                  : '#8ECF56',
                }}>
                {data ? `${data?.risk * 10}%` : <span className="speed-gauge">Loading...</span>}
            </span>
        </div>
    );
};

export default SpeedGaugeChart;
