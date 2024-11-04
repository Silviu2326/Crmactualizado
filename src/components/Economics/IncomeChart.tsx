import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface IncomeData {
  label: string;
  income: number;
}

interface IncomeChartProps {
  viewType: 'monthly' | 'annual' | 'weekly';
  currentDate: Date;
}

const IncomeChart: React.FC<IncomeChartProps> = ({ viewType, currentDate }) => {
  const monthlyData: IncomeData[] = [
    { label: 'Ene', income: 4000 },
    { label: 'Feb', income: 3000 },
    { label: 'Mar', income: 5000 },
    { label: 'Abr', income: 4500 },
    { label: 'May', income: 6000 },
    { label: 'Jun', income: 5500 },
    { label: 'Jul', income: 7000 },
    { label: 'Ago', income: 6500 },
    { label: 'Sep', income: 8000 },
    { label: 'Oct', income: 7500 },
    { label: 'Nov', income: 9000 },
    { label: 'Dic', income: 8500 },
  ];

  const annualData: IncomeData[] = [
    { label: '2019', income: 50000 },
    { label: '2020', income: 55000 },
    { label: '2021', income: 60000 },
    { label: '2022', income: 65000 },
    { label: '2023', income: 70000 },
  ];

  const weeklyData: IncomeData[] = [
    { label: 'Lun', income: 1000 },
    { label: 'Mar', income: 1200 },
    { label: 'Mié', income: 1100 },
    { label: 'Jue', income: 1300 },
    { label: 'Vie', income: 1500 },
    { label: 'Sáb', income: 1400 },
    { label: 'Dom', income: 900 },
  ];

  const getData = () => {
    switch (viewType) {
      case 'annual':
        return annualData;
      case 'weekly':
        return weeklyData;
      default:
        return monthlyData;
    }
  };

  const getYAxisDomain = () => {
    const data = getData();
    const maxIncome = Math.max(...data.map(item => item.income));
    return [0, Math.ceil(maxIncome * 1.1)]; // 10% more than max to give space
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Gráfico de Ingresos</h3>
        <span>{currentDate ? currentDate.toLocaleDateString('es-ES') : 'Fecha no disponible'}</span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={getData()}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis domain={getYAxisDomain()} />
          <Tooltip 
            formatter={(value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value as number)}
          />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeChart;
