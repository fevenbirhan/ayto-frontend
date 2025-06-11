import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TrendChartProps {
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

const TrendChart: React.FC<TrendChartProps> = ({ title, labels, datasets }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const data = {
    labels,
    datasets,
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <Line options={options} data={data} />
    </div>
  );
};

export default TrendChart; 