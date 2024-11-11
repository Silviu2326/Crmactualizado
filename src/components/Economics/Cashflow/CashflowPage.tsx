import React from 'react';
import { TrendingUp, DollarSign, PieChart, Users } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import MetricCard from '../Planes/MetricCard';
import IngresoGrafico from './IngresoGrafico';
import IngresosTabla from './IngresosTabla';
import GraficoCashflow from './GraficoCashflow';
import GastoWidget from './GastoWidget';

const CashflowPage: React.FC = () => {
  const { theme } = useTheme();

  const metricData = [
    { title: "Proyección del mes", value: "$10,000", icon: <TrendingUp className="w-6 h-6 text-green-500" />, change: "↑ 15%" },
    { title: "Gasto Mensual", value: "$7,500", icon: <DollarSign className="w-6 h-6 text-red-500" />, change: "↑ 10%" },
    { title: "Beneficio neto", value: "$2,500", icon: <TrendingUp className="w-6 h-6 text-blue-500" />, change: "↑ 5%" },
    { title: "Ingresos", value: "$15,000", icon: <DollarSign className="w-6 h-6 text-green-500" />, change: "↑ 20%" },
    { title: "Margen de ganancia", value: "16.67%", icon: <PieChart className="w-6 h-6 text-purple-500" />, change: "↑ 2%" },
    { title: "Clientes Nuevos", value: "25", icon: <Users className="w-6 h-6 text-yellow-500" />, change: "↑ 5" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
    >
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
        Cashflow
      </h2>
      
      {/* MetricCards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metricData.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            change={metric.change}
          />
        ))}
      </div>

      {/* Gráficos y Tabla */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4">
            <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">Gráfico de Ingreso</h3>
            <IngresoGrafico />
          </div>
        </motion.div>
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="p-4">
            <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">Tabla de Ingreso</h3>
            <IngresosTabla />
          </div>
        </motion.div>
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden lg:col-span-2`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="p-4">
            <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-green-400 to-teal-500 text-transparent bg-clip-text">Gráfico de Cashflow</h3>
            <GraficoCashflow />
          </div>
        </motion.div>
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden lg:col-span-2`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="p-4">
            <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-red-400 to-orange-500 text-transparent bg-clip-text">Gastos</h3>
            <GastoWidget />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CashflowPage;