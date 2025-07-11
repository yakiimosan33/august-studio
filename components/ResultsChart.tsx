'use client';

import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ResultsChartProps {
  options: Array<{
    id: string;
    option: string;
    votes: number;
    percentage: number;
  }>;
  totalVotes: number;
  chartType: 'bar' | 'doughnut';
}

export default function ResultsChart({ options, totalVotes, chartType }: ResultsChartProps) {
  const chartRef = useRef(null);

  const chartData = {
    labels: options.map(opt => opt.option),
    datasets: [
      {
        label: '投票数',
        data: options.map(opt => opt.votes),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(147, 51, 234, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(251, 146, 60)',
          'rgb(147, 51, 234)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `投票結果 (合計: ${totalVotes}票)`,
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: { dataIndex: number; parsed: { y: number } }) => {
            const percentage = options[context.dataIndex].percentage;
            return `${context.parsed.y}票 (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: `投票結果 (合計: ${totalVotes}票)`,
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: { dataIndex: number; parsed: number; label: string }) => {
            const percentage = options[context.dataIndex].percentage;
            return `${context.label}: ${context.parsed}票 (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px]">
      {chartType === 'bar' ? (
        <Bar ref={chartRef} data={chartData} options={barOptions} />
      ) : (
        <Doughnut ref={chartRef} data={chartData} options={doughnutOptions} />
      )}
    </div>
  );
}