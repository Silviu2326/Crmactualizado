import React from 'react';
import { AlertTriangle, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: string;
  trend: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, icon, trend }) => {
  const { theme } = useTheme();

  const IconComponent = {
    AlertTriangle,
    Calendar
  }[icon];

  return (
    <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} transform transition-all duration-300 hover:scale-105`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-3xl font-bold mb-2">{value}</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
        </div>
        <div className={`p-3 rounded-full ${
          icon === 'AlertTriangle' 
            ? theme === 'dark' ? 'bg-red-900/20' : 'bg-red-100' 
            : theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100'
        }`}>
          <IconComponent className={`w-6 h-6 ${
            icon === 'AlertTriangle'
              ? 'text-red-500'
              : theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
          }`} />
        </div>
      </div>
      <div className={`mt-4 flex items-center ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {trend >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        <span className="text-sm font-medium">{Math.abs(trend)}% {trend >= 0 ? 'incremento' : 'decremento'}</span>
      </div>
    </div>
  );
};

export default MetricCard;