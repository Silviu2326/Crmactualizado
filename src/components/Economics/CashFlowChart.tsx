import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { Settings } from 'lucide-react';
import ChartConfigModal from './ChartConfigModal';

interface CashFlowChartProps {
  viewType: 'daily' | 'monthly' | 'annual';
  currentDate: Date;
  ingresos: any[];
  gastos: any[];
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({ viewType, currentDate, ingresos, gastos }) => {
  const { theme } = useTheme();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar'>(viewType === 'monthly' ? 'line' : 'bar');
  const [visibleSeries, setVisibleSeries] = useState({
    ingresos: true,
    gastos: true,
    beneficio: true,
  });

  // Función para generar todas las fechas del período
  const generateDateRange = () => {
    const dates = [];
    let startDate = new Date(currentDate);
    let endDate = new Date(currentDate);

    switch (viewType) {
      case 'daily':
        // Mostrar todos los días del mes actual
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
        break;

      case 'monthly':
        // Mostrar todos los meses del año actual
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        endDate = new Date(currentDate.getFullYear(), 11, 31);
        for (let m = 0; m < 12; m++) {
          dates.push(new Date(currentDate.getFullYear(), m, 1));
        }
        break;

      case 'annual':
        // Mostrar los últimos 5 años hasta el actual
        const currentYear = currentDate.getFullYear();
        for (let y = currentYear - 4; y <= currentYear; y++) {
          dates.push(new Date(y, 0, 1));
        }
        break;
    }

    return dates;
  };

  // Función para procesar los datos basados en el tipo de vista
  const processData = () => {
    const dates = generateDateRange();
    const dataMap = new Map();

    // Inicializar todas las fechas con valores en 0
    dates.forEach(date => {
      const key = formatDateKey(date);
      dataMap.set(key, { name: key, ingresos: 0, gastos: 0 });
    });

    // Procesar ingresos
    ingresos.forEach(ingreso => {
      const fecha = new Date(ingreso.fecha);
      const key = formatDateKey(fecha);
      if (dataMap.has(key)) {
        const existing = dataMap.get(key);
        existing.ingresos += ingreso.monto;
        dataMap.set(key, existing);
      }
    });

    // Procesar gastos (convertir a valores negativos)
    gastos.forEach(gasto => {
      const fecha = new Date(gasto.fecha);
      const key = formatDateKey(fecha);
      if (dataMap.has(key)) {
        const existing = dataMap.get(key);
        existing.gastos -= gasto.importe; // Convertir a negativo
        dataMap.set(key, existing);
      }
    });

    // Convertir el mapa a array y calcular beneficios
    return Array.from(dataMap.values())
      .map(item => ({
        ...item,
        beneficio: item.ingresos + item.gastos // Sumamos porque gastos ya es negativo
      }));
  };

  // Función para formatear la clave de fecha según el tipo de vista
  const formatDateKey = (date: Date) => {
    switch (viewType) {
      case 'daily':
        return date.toLocaleDateString('es-ES', { 
          day: 'numeric',
          month: 'short'
        });
      case 'monthly':
        return date.toLocaleDateString('es-ES', { 
          month: 'long'
        });
      case 'annual':
        return date.getFullYear().toString();
      default:
        return '';
    }
  };

  const data = processData();

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
          formatter={(value: any, name: string) => {
            if (typeof value !== 'number') return ['0€', ''];
            const absValue = Math.abs(value);
            let label = '';
            switch(name) {
              case 'ingresos':
                label = 'Ingresos';
                break;
              case 'gastos':
                label = 'Gastos';
                break;
              case 'beneficio':
                label = 'Beneficio';
                break;
              default:
                label = name;
            }
            return [`${value >= 0 ? '+' : '-'}${absValue.toLocaleString('es-ES')}€`, label];
          }}
          labelFormatter={(label) => `${label}`}
        />
        <Legend
          formatter={(value) => {
            switch(value) {
              case 'ingresos': return 'Ingresos';
              case 'gastos': return 'Gastos';
              case 'beneficio': return 'Beneficio';
              default: return value;
            }
          }}
          onClick={(e) => {
            const dataKey = e.dataKey as string | undefined;
            // Verificamos si dataKey es uno de los valores permitidos antes de llamar a toggleSeries
            if (dataKey === 'ingresos' || dataKey === 'gastos' || dataKey === 'beneficio') {
              toggleSeries(dataKey as 'ingresos' | 'gastos' | 'beneficio');
            }
          }}
        />

        {visibleSeries.ingresos && (chartType === 'line' ? 
          <Line 
            type="monotone" 
            dataKey="ingresos" 
            stroke="#4ADE80" 
            strokeWidth={2}
            name="ingresos"
          /> :
          <Bar 
            dataKey="ingresos" 
            fill="#4ADE80"
            name="ingresos"
          />
        )}
        {visibleSeries.gastos && (chartType === 'line' ? 
          <Line 
            type="monotone" 
            dataKey="gastos" 
            stroke="#EF4444" 
            strokeWidth={2}
            name="gastos"
          /> :
          <Bar 
            dataKey="gastos" 
            fill="#EF4444"
            name="gastos"
          />
        )}
        {visibleSeries.beneficio && (chartType === 'line' ?
          <Line 
            type="monotone" 
            dataKey="beneficio" 
            stroke="#60A5FA" 
            strokeWidth={2}
            name="beneficio"
          /> :
          <Bar 
            dataKey="beneficio" 
            fill="#60A5FA"
            name="beneficio"
          />
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