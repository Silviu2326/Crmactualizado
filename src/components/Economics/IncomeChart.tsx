import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartControls from './ChartControls';
import ChartStats from './ChartStats';

interface IncomeData {
  label: string;
  income: number;
}

interface IncomeChartProps {
  viewType: 'monthly' | 'annual' | 'weekly';
  currentDate: Date;
}

const IncomeChart: React.FC<IncomeChartProps> = ({ viewType, currentDate: initialDate }) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedViewType, setSelectedViewType] = useState(viewType);

  const monthlyData: IncomeData[] = useMemo(() => [
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
  ], []);

  const annualData: IncomeData[] = useMemo(() => [
    { label: '2019', income: 50000 },
    { label: '2020', income: 55000 },
    { label: '2021', income: 60000 },
    { label: '2022', income: 65000 },
    { label: '2023', income: 70000 },
  ], []);

  const weeklyData: IncomeData[] = useMemo(() => [
    { label: 'Lun', income: 1000 },
    { label: 'Mar', income: 1200 },
    { label: 'Mié', income: 1100 },
    { label: 'Jue', income: 1300 },
    { label: 'Vie', income: 1500 },
    { label: 'Sáb', income: 1400 },
    { label: 'Dom', income: 900 },
  ], []);

  const getData = () => {
    switch (selectedViewType) {
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
    return [0, Math.ceil(maxIncome * 1.1)];
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    switch (selectedViewType) {
      case 'weekly':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'annual':
        newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
        break;
    }
    setCurrentDate(newDate);
  };

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: selectedViewType !== 'annual' ? 'long' : undefined,
      day: selectedViewType === 'weekly' ? 'numeric' : undefined,
    };
    return currentDate.toLocaleDateString('es-ES', options);
  };

  const currentData = getData();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <ChartControls
          viewType={selectedViewType}
          onViewTypeChange={setSelectedViewType}
          onNavigate={navigateDate}
          formattedDate={formatDate()}
        />
        
        <ChartStats data={currentData} viewType={selectedViewType} />

        <div className="bg-gray-50 rounded-xl p-4">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={currentData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="label" 
                stroke="#6b7280"
                tick={{ fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                domain={getYAxisDomain()} 
                stroke="#6b7280"
                tick={{ fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => 
                  new Intl.NumberFormat('es-ES', { 
                    style: 'currency', 
                    currency: 'EUR',
                    maximumFractionDigits: 0
                  }).format(value)
                }
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                formatter={(value) => [
                  new Intl.NumberFormat('es-ES', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  }).format(value as number),
                  'Ingresos'
                ]}
                labelStyle={{ color: '#374151' }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px'
                }}
                formatter={() => 'Ingresos'}
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#2563eb' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default IncomeChart;