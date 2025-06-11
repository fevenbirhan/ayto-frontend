import React from 'react';
import { TimeRange } from '../../types/analytics';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ value, onChange }) => {
  const options: { value: TimeRange; label: string }[] = [
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last Quarter' },
    { value: 'year', label: 'Last Year' },
  ];

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="timeRange" className="text-sm font-medium text-gray-700">
        Time Range:
      </label>
      <select
        id="timeRange"
        value={value}
        onChange={(e) => onChange(e.target.value as TimeRange)}
        className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeRangeSelector; 