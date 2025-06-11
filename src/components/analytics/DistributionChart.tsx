import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DistributionChartProps {
  title: string;
  labels: string[];
  data: number[];
  backgroundColor: string[];
}

const DistributionChart: React.FC<DistributionChartProps> = ({
  title,
  labels,
  data,
  backgroundColor,
}) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <Pie options={options} data={chartData} />
    </div>
  );
};

export default DistributionChart; 