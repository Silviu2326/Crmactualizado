import React, { useState } from 'react';
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../../contexts/ThemeContext';
import Button from '../../common/Button';

const GraficoCashflow: React.FC = () => {
  const { theme } = useTheme();
  const [viewType, setViewType] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  const data = {
    weekly: [
      { name: 'Lun', ingresos: 4000, gastos: 3000, beneficio: 1000 },
      { name: 'Mar', ingresos: 3000, gastos: 2500, beneficio: 500 },
      { name: 'Mié', ingresos: 2000, gastos: 2800, beneficio: -800 },
      { name: 'Jue', ingresos: 2780, gastos: 2000, beneficio: 780 },
      { name: 'Vie', ingresos: 1890, gastos: 1700, beneficio: 190 },
      { name: 'Sáb', ingresos: 2390, gastos: 1500, beneficio: 890 },
      { name: 'Dom', ingresos: 3490, gastos: 2100, beneficio: 1390 },
    ],
    monthly: [
      { name: 'Ene', ingresos: 65000, gastos: 55000, beneficio: 10000 },
      { name: 'Feb', ingresos: 59000, gastos: 52000, beneficio: 7000 },
      { name: 'Mar', ingresos: 80000, gastos: 70000, beneficio: 10000 },
      { name: 'Abr', ingresos: 81000, gastos: 68000, beneficio: 13000 },
      { name: 'May', ingresos: 56000, gastos: 51000, beneficio: 5000 },
      { name: 'Jun', ingresos: 55000, gastos: 54000, beneficio: 1000 },
      { name: 'Jul', ingresos: 40000, gastos: 45000, beneficio: -5000 },
    ],
    yearly: [
      { name: '2020', ingresos: 800000, gastos: 700000, beneficio: 100000 },
      { name: '2021', ingresos: 900000, gastos: 750000, beneficio: 150000 },
      { name: '2022', ingresos: 950000, gastos: 800000, beneficio: 150000 },
      { name: '2023', ingresos: 1000000, gastos: 820000, beneficio: 180000 },
    ],
  };

  return (
    <div className="h-96">
      <div className="mb-4 flex justify-center space-x-2">
        {['weekly', 'monthly', 'yearly'].map((type) => (
          <Button
            key={type}
            variant={viewType === type ? 'normal' : 'filter'}
            onClick={() => setViewType(type as 'weekly' | 'monthly' | 'yearly')}
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
          <Bar dataKey="ingresos" fill={theme === 'dark' ? '#3B82F6' : '#60A5FA'} name="Ingresos" />
          <Bar dataKey="gastos" fill={theme === 'dark' ? '#EF4444' : '#F87171'} name="Gastos" />
          <Line type="monotone" dataKey="beneficio" stroke={theme === 'dark' ? '#10B981' : '#34D399'} name="Beneficio" strokeWidth={2} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoCashflow;