import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../../contexts/ThemeContext';
import Button from '../../Common/Button';

const IngresoGrafico: React.FC = () => {
  const { theme } = useTheme();
  const [viewType, setViewType] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  const data = {
    daily: [
      { name: 'Lun', ingresos: 4000 },
      { name: 'Mar', ingresos: 3000 },
      { name: 'Mié', ingresos: 2000 },
      { name: 'Jue', ingresos: 2780 },
      { name: 'Vie', ingresos: 1890 },
      { name: 'Sáb', ingresos: 2390 },
      { name: 'Dom', ingresos: 3490 },
    ],
    weekly: [
      { name: 'Semana 1', ingresos: 15000 },
      { name: 'Semana 2', ingresos: 18000 },
      { name: 'Semana 3', ingresos: 16000 },
      { name: 'Semana 4', ingresos: 19000 },
    ],
    monthly: [
      { name: 'Ene', ingresos: 65000 },
      { name: 'Feb', ingresos: 59000 },
      { name: 'Mar', ingresos: 80000 },
      { name: 'Abr', ingresos: 81000 },
      { name: 'May', ingresos: 56000 },
      { name: 'Jun', ingresos: 55000 },
      { name: 'Jul', ingresos: 40000 },
    ],
  };

  return (
    <div className="h-96">
      <div className="mb-4 flex justify-center space-x-2">
        {['daily', 'weekly', 'monthly'].map((type) => (
          <Button
            key={type}
            variant={viewType === type ? 'normal' : 'filter'}
            onClick={() => setViewType(type as 'daily' | 'weekly' | 'monthly')}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data[viewType]}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
          <XAxis dataKey="name" stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'} />
          <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'} />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
              border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
              borderRadius: '0.375rem',
            }}
          />
          <Legend />
          <Bar dataKey="ingresos" fill={theme === 'dark' ? '#3B82F6' : '#60A5FA'} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IngresoGrafico;