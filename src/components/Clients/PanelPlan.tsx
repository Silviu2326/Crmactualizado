import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Activity,
  Target,
  Dumbbell,
  FileText,
  Edit,
} from 'lucide-react';

interface PlanPlanProps {
  clienteId: string;
}

interface Plan {
  nombre: string;
  meta: string;
  fechaInicio: string;
  fechaFin: string;
  progreso: number;
  rutinaHoy: string;
  notas: string;
}

const PanelPlan: React.FC<PlanPlanProps> = ({ clienteId }) => {
  const { theme } = useTheme();
  const [plan, setPlan] = useState<Plan>({
    nombre: 'Plan de Pérdida de Peso',
    meta: 'Reducir 5kg en 3 meses con entrenamiento progresivo',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-03-31',
    progreso: 45,
    rutinaHoy: 'Entrenamiento de fuerza + 30 min cardio',
    notas: 'Cliente con molestia leve en rodilla derecha. Evitar ejercicios de alto impacto.',
  });

  const handleEditRutina = () => {
    // Implementar lógica para editar la rutina
    console.log('Editar rutina del día');
  };

  return (
    <div className="flex flex-col w-full h-full gap-4 p-4">
      {/* Encabezado con nombre del plan */}
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          {plan.nombre}
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
              Meta de la Planificación
            </h3>
          </div>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {plan.meta}
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
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${plan.progreso}%` }}
              ></div>
            </div>
            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {plan.progreso}% completado
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Duración
            </h3>
          </div>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Inicio: {new Date(plan.fechaInicio).toLocaleDateString()}
            <br />
            Fin: {new Date(plan.fechaFin).toLocaleDateString()}
          </p>
        </motion.div>
      </div>

      {/* Rutina de hoy */}
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Dumbbell className={theme === 'dark' ? 'text-orange-400' : 'text-orange-600'} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Rutina de Hoy
            </h3>
          </div>
          <button
            onClick={handleEditRutina}
            className={`p-2 rounded-full hover:bg-gray-700 transition-colors ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            <Edit size={20} />
          </button>
        </div>
        <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {plan.rutinaHoy}
        </div>
      </div>

      {/* Notas */}
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center gap-2 mb-4">
          <FileText className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} />
          <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Notas
          </h3>
        </div>
        <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {plan.notas}
        </div>
      </div>
    </div>
  );
};

export default PanelPlan;
