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
  Plus,
} from 'lucide-react';
import PopupRM from '../Planning/PopupRM';

interface RM {
  ejercicio: string;
  peso: number;
  fecha: string;
}

interface Exercise {
  _id: string;
  nombre: string;
  grupoMuscular: string[];
  descripcion: string;
  equipo: string[];
  fechaCreacion: string;
  __v: number;
}

interface ExerciseResponse {
  message: string;
  data: Exercise[];
}

interface PlanPlanProps {
  clienteId: string;
  planningDetails: {
    nombre: string;
    meta: string;
    fechaInicio: string;
    semanas: number;
    semanas_detalle: Array<{
      weekNumber: number;
      startDate: string;
      days: {
        [key: string]: {
          day: string;
          fecha: string;
          sessions: Array<any>;
        }
      }
    }>;
  };
}

const PanelPlan: React.FC<PlanPlanProps> = ({ clienteId, planningDetails }) => {
  const { theme } = useTheme();
  const [rms, setRMs] = useState<RM[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isRMModalOpen, setIsRMModalOpen] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        console.log('Fetching exercises...');
        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/exercises');
        if (response.ok) {
          const data: ExerciseResponse = await response.json();
          console.log('Exercises fetched successfully:', data);
          setExercises(data.data);
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    const fetchRMs = async () => {
      try {
        console.log('Fetching RMs...');
        const token = localStorage.getItem('token');
        const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/rms`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log('RMs fetched successfully:', data);
          setRMs(data);
        }
      } catch (error) {
        console.error('Error loading RMs:', error);
      }
    };

    fetchRMs();
  }, [clienteId]);

  const obtenerSesionesHoy = () => {
    const hoy = new Date();
    const fechaInicioPlan = new Date(planningDetails.fechaInicio);
    
    // Si la fecha actual es anterior al inicio del plan
    if (hoy < fechaInicioPlan) {
      return {
        tipo: 'pendiente',
        mensaje: `La planificación comenzará el ${fechaInicioPlan.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}`
      };
    }

    // Verificar si semanas_detalle existe y es un array
    if (!planningDetails.semanas_detalle || !Array.isArray(planningDetails.semanas_detalle)) {
      return {
        tipo: 'error',
        mensaje: 'No hay detalles de planificación disponibles'
      };
    }

    // Buscar la semana actual
    for (const week of planningDetails.semanas_detalle) {
      const fechaInicioSemana = new Date(week.startDate);
      const fechaFinSemana = new Date(fechaInicioSemana);
      fechaFinSemana.setDate(fechaFinSemana.getDate() + 7);

      if (hoy >= fechaInicioSemana && hoy < fechaFinSemana) {
        // Encontrar el día actual
        const nombreDia = hoy.toLocaleDateString('es-ES', { weekday: 'long' });
        const diaCapitalizado = nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1);
        const sesionesHoy = week.days[diaCapitalizado]?.sessions || [];

        return {
          tipo: 'sesiones',
          sesiones: sesionesHoy,
          mensaje: sesionesHoy.length === 0 ? 'No hay sesiones programadas para hoy' : undefined
        };
      }
    }

    return {
      tipo: 'error',
      mensaje: 'No se encontraron sesiones para la fecha actual'
    };
  };

  const sesionesHoy = obtenerSesionesHoy();
  
  return (
    <div className="flex flex-col w-full h-full gap-4 p-4">
      {/* Encabezado con nombre del plan */}
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          {planningDetails.nombre}
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
            {planningDetails.meta}
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
                style={{ width: '45%' }}
              ></div>
            </div>
            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              45% completado
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
            Inicio: {new Date(planningDetails.fechaInicio).toLocaleDateString()}
            <br />
            Semanas: {planningDetails.semanas}
          </p>
        </motion.div>
      </div>

      {/* Sección de RMs */}
      <div className={`mt-8 p-6 rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Records Máximos (RMs)
          </h3>
          <button
            onClick={() => setIsRMModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-violet-500 hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Añadir RM
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Ejercicio
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Peso (kg)
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                } uppercase tracking-wider`}>
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
            }`}>
              {exercises.length === 0 ? (
                <tr>
                  <td colSpan={3} className={`px-6 py-4 text-center ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>No hay ejercicios registrados</td>
                </tr>
              ) : (
                exercises.map((exercise) => (
                  <tr key={exercise._id} className={
                    theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                  }>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      {exercise.nombre}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      Desconocido
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      Desconocida
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
          {sesionesHoy.tipo === 'sesiones' && sesionesHoy.sesiones.length > 0 && (
            <button
              onClick={() => console.log('Editar rutina del día')}
              className={`p-2 rounded-full hover:bg-gray-700 transition-colors ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <Edit size={20} />
            </button>
          )}
        </div>
        <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {sesionesHoy.tipo === 'pendiente' ? (
            <p className="text-yellow-500">{sesionesHoy.mensaje}</p>
          ) : sesionesHoy.tipo === 'sesiones' ? (
            sesionesHoy.sesiones.length > 0 ? (
              <div className="space-y-2">
                {sesionesHoy.sesiones.map((sesion, index) => (
                  <div key={index} className="p-2 bg-gray-700 rounded">
                    <p className="font-medium">{sesion.nombre}</p>
                    {/* Aquí puedes agregar más detalles de la sesión */}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">{sesionesHoy.mensaje}</p>
            )
          ) : (
            <p className="text-red-500">{sesionesHoy.mensaje}</p>
          )}
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
          Cliente con molestia leve en rodilla derecha. Evitar ejercicios de alto impacto.
        </div>
      </div>

      {/* Modal de RMs */}
      {isRMModalOpen && (
        <PopupRM
          onClose={() => setIsRMModalOpen(false)}
          planningId={clienteId}
        />
      )}
    </div>
  );
};

export default PanelPlan;
