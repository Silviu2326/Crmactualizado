import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { Settings } from 'lucide-react';
import ChartConfigModal from './ChartConfigModal';

interface CashFlowChartProps {
  viewType: 'weekly' | 'monthly' | 'annual';
  currentDate: Date;
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({ viewType, currentDate }) => {
  const { theme } = useTheme();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar'>(viewType === 'monthly' ? 'line' : 'bar');
  const [visibleSeries, setVisibleSeries] = useState({
    ingresos: true,
    gastos: true,
    beneficio: true,
  });

  // Función para generar datos de ejemplo basados en el tipo de vista y la fecha actual
  const generateData = () => {
    const data = [];
    let startDate = new Date(currentDate);
    let endDate = new Date(currentDate);
    let increment: number;

    switch (viewType) {
      case 'weekly':
        startDate.setDate(startDate.getDate() - startDate.getDay());
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        increment = 1;
        break;
      case 'monthly':
        startDate.setDate(1);
        endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        increment = 1;
        break;
      case 'annual':
        startDate = new Date(startDate.getFullYear(), 0, 1);
        endDate = new Date(startDate.getFullYear(), 11, 31);
        increment = 30;
        break;
    }

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + increment)) {
      const ingresos = Math.floor(Math.random() * 5000) + 3000;
      const gastos = Math.floor(Math.random() * 3000) + 1000;
      data.push({
        name: date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
        ingresos: ingresos,
        gastos: gastos,
        beneficio: ingresos - gastos,
      });
    }

    return data;
  };

  const data = generateData();

  const toggleSeries = (series: 'ingresos' | 'gastos' | 'beneficio') => {
    setVisibleSeries(prev => ({ ...prev, [series]: !prev[series] }));
  };

  const renderChart = () => {
    const ChartComponent = chartType === 'line' ? LineChart : BarChart;
    return (
      <ChartComponent
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
        <XAxis dataKey="name" stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'} />
        <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'} />
        <Tooltip
          contentStyle={{
            backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
            borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
            color: theme === 'dark' ? '#F3F4F6' : '#1F2937',
          }}
        />
        <Legend
          onClick={(e) => {
            const dataKey = e.dataKey as string | undefined;
            // Verificamos si dataKey es uno de los valores permitidos antes de llamar a toggleSeries
            if (dataKey === 'ingresos' || dataKey === 'gastos' || dataKey === 'beneficio') {
              toggleSeries(dataKey as 'ingresos' | 'gastos' | 'beneficio');
            }
          }}
        />

        {visibleSeries.ingresos && (chartType === 'line' ? 
          <Line type="monotone" dataKey="ingresos" stroke="#4ADE80" strokeWidth={2} /> :
          <Bar dataKey="ingresos" fill="#4ADE80" />
        )}
        {visibleSeries.gastos && (chartType === 'line' ?
          <Line type="monotone" dataKey="gastos" stroke="#F87171" strokeWidth={2} /> :
          <Bar dataKey="gastos" fill="#F87171" />
        )}
        {visibleSeries.beneficio && (chartType === 'line' ?
          <Line type="monotone" dataKey="beneficio" stroke="#60A5FA" strokeWidth={2} /> :
          <Bar dataKey="beneficio" fill="#60A5FA" />
        )}
      </ChartComponent>
    );
  };

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
      <button
        onClick={() => setIsConfigOpen(true)}
        className={`absolute bottom-2 right-2 p-1 rounded-full ${
          theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
        } hover:bg-opacity-80 transition-colors duration-200`}
      >
        <Settings size={16} />
      </button>
      {isConfigOpen && (
        <ChartConfigModal
          onClose={() => setIsConfigOpen(false)}
          onSave={(newChartType) => {
            setChartType(newChartType);
            setIsConfigOpen(false);
          }}
          currentChartType={chartType}
          viewType={viewType}
        />
      )}
    </div>
  );
};

export default CashFlowChart;