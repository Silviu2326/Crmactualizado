// src/components/Economics/Cashflow/GraficoCashflow.tsx
import React, { useState, useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import Button from '../../Common/Button';

interface CashflowData {
  name: string;
  ingresos: number;
  gastos: number;
  beneficio: number;
}

const GraficoCashflow: React.FC = () => {
  const { theme } = useTheme();
  const [viewType, setViewType] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Datos de ejemplo para el gráfico
  const data = useMemo(
    () => ({
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
    }),
    []
  );

  // Definir colores basados en el tema
  const colors = {
    ingresos: theme === 'dark' ? '#3B82F6' : '#60A5FA', // Azul
    gastos: theme === 'dark' ? '#EF4444' : '#F87171',   // Rojo
    beneficio: theme === 'dark' ? '#10B981' : '#34D399', // Verde
    grid: theme === 'dark' ? '#374151' : '#E5E7EB',
    axis: theme === 'dark' ? '#9CA3AF' : '#4B5563',
    tooltipBg: theme === 'dark' ? '#1F2937' : '#FFFFFF',
    tooltipBorder: theme === 'dark' ? '#374151' : '#E5E7EB',
    legendText: theme === 'dark' ? '#D1D5DB' : '#1F2937',
  };

  // Personalizar Tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: any;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: colors.tooltipBg,
            border: `1px solid ${colors.tooltipBorder}`,
            borderRadius: '0.375rem',
            padding: '10px',
            color: theme === 'dark' ? '#FFFFFF' : '#000000',
          }}
        >
          <p className="label font-semibold">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color, margin: 0 }}>
              {`${entry.name}: ${entry.value.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR',
              })}`}
            </p>
          ))}
        </div>
      );
    }

    return null;
  };

  // Manejar cambio de vista desde el desplegable
  const handleViewTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewType(e.target.value as 'weekly' | 'monthly' | 'yearly');
  };

  // Manejar cambio de fechas
  const handlePrev = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      switch (viewType) {
        case 'weekly':
          newDate.setDate(newDate.getDate() - 7);
          break;
        case 'monthly':
          newDate.setMonth(newDate.getMonth() - 1);
          break;
        case 'yearly':
          newDate.setFullYear(newDate.getFullYear() - 1);
          break;
      }
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      switch (viewType) {
        case 'weekly':
          newDate.setDate(newDate.getDate() + 7);
          break;
        case 'monthly':
          newDate.setMonth(newDate.getMonth() + 1);
          break;
        case 'yearly':
          newDate.setFullYear(newDate.getFullYear() + 1);
          break;
      }
      return newDate;
    });
  };

  // Obtener la visualización de fecha según el viewType y currentDate
  const getDateDisplay = () => {
    switch (viewType) {
      case 'weekly':
        const weekStart = new Date(currentDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Lunes
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6); // Domingo
        return `Semana del ${weekStart.toLocaleDateString()} al ${weekEnd.toLocaleDateString()}`;
      case 'monthly':
        return currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      case 'yearly':
        return currentDate.getFullYear().toString();
      default:
        return '';
    }
  };

  return (
    <div className={`relative h-96 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-200`}>
      {/* Botones de navegación de fechas y desplegable alineados a la derecha */}
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Cash Flow</h3>
        <div className="flex items-center space-x-2">
          {/* Botón Anterior */}
          <button
            onClick={handlePrev}
            className={`p-1 rounded-full ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            } transition-colors duration-200`}
            title="Anterior"
          >
            <ChevronLeft className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
          {/* Desplegable de selección de vista */}
          <div className="relative inline-block text-left">
            <select
              value={viewType}
              onChange={handleViewTypeChange}
              className={`block w-full pl-3 pr-10 py-2 text-base border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            >
              <option>weekly</option>
              <option>monthly</option>
              <option>yearly</option>
            </select>
          </div>
          {/* Botón Siguiente */}
          <button
            onClick={handleNext}
            className={`p-1 rounded-full ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            } transition-colors duration-200`}
            title="Siguiente"
          >
            <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>

      {/* Visualización de la fecha actual */}
      <div className="mb-4 text-center">
        <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
          {getDateDisplay()}
        </span>
      </div>

      {/* Gráfico Responsivo */}
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data[viewType]}
          margin={{
            top: 20,
            right: 50, // Aumentado para el eje Y secundario si se implementa
            left: 20,
            bottom: 20,
          }}
        >
          {/* Rejilla del gráfico */}
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />

          {/* Eje X */}
          <XAxis
            dataKey="name"
            stroke={colors.axis}
            tick={{ fill: colors.axis }}
            fontSize={12}
          />

          {/* Eje Y Primario */}
          <YAxis
            yAxisId="left"
            stroke={colors.axis}
            tick={{ fill: colors.axis }}
            fontSize={12}
            label={{
              value: 'Euros',
              angle: -90,
              position: 'insideLeft',
              fill: colors.axis,
              fontSize: 12,
            }}
          />

          {/* Eje Y Secundario para Beneficio (opcional) */}
          {/* Descomenta las siguientes líneas si los beneficios tienen un rango muy diferente */}
          {/* <YAxis
            yAxisId="right"
            orientation="right"
            stroke={colors.axis}
            tick={{ fill: colors.axis }}
            fontSize={12}
            label={{
              value: 'Beneficio (€)',
              angle: 90,
              position: 'insideRight',
              fill: colors.axis,
              fontSize: 12,
            }}
          /> */}

          {/* Tooltip Personalizado */}
          <Tooltip content={<CustomTooltip />} />

          {/* Leyenda */}
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{
              color: colors.legendText,
              fontSize: 12,
            }}
          />

          {/* Barras de Ingresos */}
          <Bar
            yAxisId="left"
            dataKey="ingresos"
            name="Ingresos"
            fill={colors.ingresos}
            barSize={30}
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />

          {/* Barras de Gastos */}
          <Bar
            yAxisId="left"
            dataKey="gastos"
            name="Gastos"
            fill={colors.gastos}
            barSize={30}
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />

          {/* Línea de Beneficio */}
          <Line
            type="monotone"
            dataKey="beneficio"
            name="Beneficio"
            stroke={colors.beneficio}
            strokeWidth={3}
            dot={{ fill: colors.beneficio, r: 4 }}
            activeDot={{ r: 6 }}
            yAxisId="left" // Cambia a 'right' si usas Dual Y-Axis
            animationDuration={800}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoCashflow;
