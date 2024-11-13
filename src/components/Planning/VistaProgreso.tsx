import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { TrendingUp, Award, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface VistaProgresoProps {
  semanaActual: number;
  // Aquí puedes añadir más props según sea necesario para mostrar el progreso
}

const VistaProgreso: React.FC<VistaProgresoProps> = ({ semanaActual }) => {
  const { theme } = useTheme();

  // Estos son datos de ejemplo. En una implementación real, estos datos vendrían de props o de una API
  const progresoSemanal = {
    pesoLevantado: 5000, // en kg
    caloriasBurnidas: 3500,
    objetivosCumplidos: 8,
  };

  const StatCard = ({ title, value, icon: Icon, unit }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } p-6 rounded-lg shadow-md flex items-center justify-between`}
    >
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-3xl font-bold">
          {value} <span className="text-sm font-normal">{unit}</span>
        </p>
      </div>
      <Icon className={`w-12 h-12 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      } rounded-xl p-6 shadow-lg`}
    >
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        Progreso - Semana {semanaActual}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Peso Total Levantado"
          value={progresoSemanal.pesoLevantado}
          icon={TrendingUp}
          unit="kg"
        />
        <StatCard
          title="Calorías Quemadas"
          value={progresoSemanal.caloriasBurnidas}
          icon={Target}
          unit="kcal"
        />
        <StatCard
          title="Objetivos Cumplidos"
          value={progresoSemanal.objetivosCumplidos}
          icon={Award}
          unit="de 10"
        />
      </div>
      {/* Aquí puedes añadir más elementos para mostrar el progreso, como gráficos o listas de logros */}
    </motion.div>
  );
};

export default VistaProgreso;