import React, { useState, useMemo } from 'react';
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface CashflowData {
  label: string;
  ingresos: number;
  gastos: number;
  beneficio: number;
}

interface CashflowWidgetProps {
  ingresos: number;
  gastos: number;
  isEditMode: boolean;
  onRemove: () => void;
  onUpdate: () => void;  // Añadido onUpdate aquí
}

const CashflowWidget: React.FC<CashflowWidgetProps> = ({
  ingresos,
  gastos,
  isEditMode,
  onRemove,
  onUpdate,
}) => {
  const [viewType, setViewType] = useState<'weekly' | 'monthly' | 'annual'>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const { theme } = useTheme();

  // Datos de ejemplo para el gráfico (sin cambios)
  const weeklyData: CashflowData[] = useMemo(() => [
    { label: 'Lun', ingresos, gastos, beneficio:  ingresos - gastos },
    { label: 'Mar', ingresos: 1200, gastos: 900, beneficio:  ingresos - gastos },
    { label: 'Mié', ingresos: 1100, gastos: 850, beneficio:  ingresos - gastos },
    { label: 'Jue', ingresos: 1300, gastos: 950, beneficio:  ingresos - gastos },
    { label: 'Vie', ingresos: 1500, gastos: 1100, beneficio:  ingresos - gastos },
    { label: 'Sáb', ingresos: 1400, gastos: 1000, beneficio:  ingresos - gastos },
    { label: 'Dom', ingresos: 900, gastos: 700, beneficio:  ingresos - gastos },
  ], [ingresos, gastos]);

  const monthlyData: CashflowData[] = useMemo(() => [
    { label: 'Ene', ingresos, gastos, beneficio:  ingresos - gastos },
    { label: 'Feb', ingresos: 4000, gastos: 2000, beneficio: 2000 },
    { label: 'Mar', ingresos: 3200, gastos: 1800, beneficio: 1400 },
    { label: 'Abr', ingresos: 5000, gastos: 2300, beneficio: 2700 },
    { label: 'May', ingresos: 4500, gastos: 2100, beneficio: 2400 },
    { label: 'Jun', ingresos: 4800, gastos: 2200, beneficio: 2600 },
    { label: 'Jul', ingresos: 5200, gastos: 2600, beneficio: 2600 },
    { label: 'Ago', ingresos: 4300, gastos: 2100, beneficio: 2200 },
    { label: 'Sep', ingresos: 4100, gastos: 2000, beneficio: 2100 },
    { label: 'Oct', ingresos: 3900, gastos: 1900, beneficio: 2000 },
    { label: 'Nov', ingresos: 5700, gastos: 2700, beneficio: 3000 },
    { label: 'Dic', ingresos: 5900, gastos: 2900, beneficio: 3000 },
  ], [ingresos, gastos]);

  const annualData: CashflowData[] = useMemo(() => [
    { label: '2020', ingresos, gastos, beneficio: ingresos - gastos },
    { label: '2021', ingresos: 55000, gastos: 42000, beneficio: 13000 },
    { label: '2022', ingresos: 60000, gastos: 45000, beneficio: 15000 },
    { label: '2023', ingresos: 65000, gastos: 48000, beneficio: 17000 },
    { label: '2024', ingresos: 70000, gastos: 50000, beneficio: 20000 },
  ], [ingresos, gastos]);

  const getData = () => {
    switch (viewType) {
      case 'weekly':
        return weeklyData;
      case 'annual':
        return annualData;
      default:
        return monthlyData;
    }
  };

  const handlePrev = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      switch (viewType) {
        case 'weekly':
          newDate.setDate(newDate.getDate() - 7);
          break;
        case 'monthly':
          newDate.setMonth(newDate.getMonth() - 1);
          break;
        case 'annual':
          newDate.setFullYear(newDate.getFullYear() - 1);
          break;
      }
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      switch (viewType) {
        case 'weekly':
          newDate.setDate(newDate.getDate() + 7);
          break;
        case 'monthly':
          newDate.setMonth(newDate.getMonth() + 1);
          break;
        case 'annual':
          newDate.setFullYear(newDate.getFullYear() + 1);
          break;
      }
      return newDate;
    });
  };

  const getDateDisplay = () => {
    switch (viewType) {
      case 'weekly':
        return `Semana del ${currentDate.toLocaleDateString()}`;
      case 'monthly':
        return currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      case 'annual':
        return currentDate.getFullYear().toString();
    }
  };

  return (
    <div className={`p-4 h-full flex flex-col justify-between ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-md transition-colors duration-200`}>
      {isEditMode && (
        <>
          <button onClick={onRemove} className={`absolute top-2 right-2 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} bg-white rounded-full p-1 shadow-md`}>
            <TrendingUp className="w-4 h-4" />
          </button>
          <button onClick={onUpdate} className={`absolute top-2 right-10 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} bg-white rounded-full p-1 shadow-md`}>
            Actualizar
          </button>
        </>
      )}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Cash Flow</h3>
        <div className="flex items-center space-x-2">
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value as 'weekly' | 'monthly' | 'annual')}
            className={`${
              theme === 'dark'
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white text-gray-700 border-gray-300'
            } border py-1 px-2 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option>weekly</option>
            <option>monthly</option>
            <option>annual</option>
          </select>
          <div className="flex items-center space-x-1">
            <button onClick={handlePrev} className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <ChevronLeft className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{getDateDisplay()}</span>
            <button onClick={handleNext} className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4a5568' : '#f0f0f0'} />
            <XAxis dataKey="label" stroke={theme === 'dark' ? '#a0aec0' : '#888888'} />
            <YAxis stroke={theme === 'dark' ? '#a0aec0' : '#888888'} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#2d3748' : 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                color: theme === 'dark' ? '#e2e8f0' : 'inherit'
              }}
              formatter={(value) => [`${value}€`, '']}
            />
            <Legend />
            <Bar dataKey="ingresos" fill={theme === 'dark' ? '#4c51bf' : '#4ade80'} name="Ingresos" radius={[4, 4, 0, 0]} />
            <Bar dataKey="gastos" fill={theme === 'dark' ? '#e53e3e' : '#f87171'} name="Gastos" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="beneficio" stroke={theme === 'dark' ? '#38b2ac' : '#60a5fa'} strokeWidth={2} name="Beneficio" dot={{ fill: theme === 'dark' ? '#38b2ac' : '#60a5fa', r: 4 }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-2 text-center`}>
        Resumen de ingresos, gastos y beneficios para {getDateDisplay()}
      </div>
    </div>
  );
};

export default CashflowWidget;