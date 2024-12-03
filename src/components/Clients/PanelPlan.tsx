import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Activity,
  Target,
  Dumbbell,
  FileText,
} from 'lucide-react';

interface PlanPlanProps {
  clienteId: string;
}

const PanelPlan: React.FC<PlanPlanProps> = ({ clienteId }) => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col w-full h-full gap-4 p-4">
      {/* Encabezado */}
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Plan de Entrenamiento
        </h2>
      </div>

      {/* Grid de información del plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center gap-2">
            <Target className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Objetivo Actual
            </h3>
          </div>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            [Objetivo del cliente]
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center gap-2">
            <Activity className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Progreso
            </h3>
          </div>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            [Progreso actual]
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Duración del Plan
            </h3>
          </div>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            [Duración]
          </p>
        </motion.div>
      </div>

      {/* Detalles del plan */}
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center gap-2 mb-4">
          <Dumbbell className={theme === 'dark' ? 'text-orange-400' : 'text-orange-600'} />
          <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Rutinas de Entrenamiento
          </h3>
        </div>
        <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {/* Aquí irían las rutinas de entrenamiento */}
          <p>No hay rutinas asignadas actualmente</p>
        </div>
      </div>

      {/* Notas y observaciones */}
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center gap-2 mb-4">
          <FileText className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} />
          <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Notas y Observaciones
          </h3>
        </div>
        <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {/* Aquí irían las notas relacionadas con el plan */}
          <p>No hay notas disponibles</p>
        </div>
      </div>
    </div>
  );
};

export default PanelPlan;
