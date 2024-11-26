// src/components/Economics/Cashflow/IngresoGrafico.tsx
import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface IngresoData {
  name: string;
  ingresos: number;
}

const IngresoGrafico: React.FC = () => {
  const { theme } = useTheme();
  const [viewType, setViewType] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Datos de ejemplo para el gráfico
  const data = useMemo(
    () => ({
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
    }),
    []
  );

  // Definir colores basados en el tema
  const colors = {
    ingresos: theme === 'dark' ? '#3B82F6' : '#60A5FA', // Azul
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
    setViewType(e.target.value as 'daily' | 'weekly' | 'monthly');
  };

  // Manejar cambio de fechas
  const handlePrev = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      switch (viewType) {
        case 'daily':
          newDate.setDate(newDate.getDate() - 1);
          break;
        case 'weekly':
          newDate.setDate(newDate.getDate() - 7);
          break;
        case 'monthly':
          newDate.setMonth(newDate.getMonth() - 1);
          break;
      }
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      switch (viewType) {
        case 'daily':
          newDate.setDate(newDate.getDate() + 1);
          break;
        case 'weekly':
          newDate.setDate(newDate.getDate() + 7);
          break;
        case 'monthly':
          newDate.setMonth(newDate.getMonth() + 1);
          break;
      }
      return newDate;
    });
  };

  // Obtener la visualización de fecha según el viewType y currentDate
  const getDateDisplay = () => {
    switch (viewType) {
      case 'daily':
        return currentDate.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      case 'weekly':
        const weekStart = new Date(currentDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Lunes
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6); // Domingo
        return `Semana del ${weekStart.toLocaleDateString()} al ${weekEnd.toLocaleDateString()}`;
      case 'monthly':
        return currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      default:
        return '';
    }
  };

  return (
    <div className={`relative h-96 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-200`}>
      {/* Encabezado con título, desplegable y botones de navegación alineados a la derecha */}
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
          Ingresos
        </h3>
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
              <option>daily</option>
              <option>weekly</option>
              <option>monthly</option>
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
        <BarChart
          data={data[viewType]}
          margin={{
            top: 20,
            right: 30,
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

          {/* Eje Y */}
          <YAxis
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
            dataKey="ingresos"
            name="Ingresos"
            fill={colors.ingresos}
            barSize={30}
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IngresoGrafico;
