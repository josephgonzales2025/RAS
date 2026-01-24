import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Registrar los componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function MonthlyStatsChart({ data, type = 'line' }) {
    const labels = data.map(item => item.month_label);
    const weightData = data.map(item => item.total_weight);
    const freightData = data.map(item => item.total_freight);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Peso Total (kg)',
                data: weightData,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: type === 'bar' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: type === 'line',
                yAxisID: 'y',
            },
            {
                label: 'Flete Total (S/.)',
                data: freightData,
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: type === 'bar' ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: type === 'line',
                yAxisID: 'y1',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 15,
                },
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14,
                },
                bodyFont: {
                    size: 13,
                },
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            if (context.datasetIndex === 0) {
                                label += new Intl.NumberFormat('es-PE', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }).format(context.parsed.y) + ' kg';
                            } else {
                                label += 'S/. ' + new Intl.NumberFormat('es-PE', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }).format(context.parsed.y);
                            }
                        }
                        return label;
                    }
                }
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Peso (kg)',
                    font: {
                        size: 12,
                        weight: 'bold',
                    },
                },
                ticks: {
                    callback: function(value) {
                        return new Intl.NumberFormat('es-PE').format(value);
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Flete (S/.)',
                    font: {
                        size: 12,
                        weight: 'bold',
                    },
                },
                ticks: {
                    callback: function(value) {
                        return 'S/. ' + new Intl.NumberFormat('es-PE').format(value);
                    }
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    return (
        <div className="w-full h-full">
            {type === 'line' ? (
                <Line data={chartData} options={options} />
            ) : (
                <Bar data={chartData} options={options} />
            )}
        </div>
    );
}
