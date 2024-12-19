import React, { useState, useEffect } from 'react';
import { Search, X, Plus, Filter, Download, Dumbbell, Target, Clock, Users, Calendar, TrendingUp, Pencil, Trash2 } from 'lucide-react';
import Button from '../Common/Button';
import Table from '../Common/Table';
import CreateRoutineModal from './CreateRoutineModal';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface Metric {
  type: string;
  value: string;
  _id: string;
}

interface Exercise {
  name: string;
  metrics: Metric[];
  notes: string;
  _id: string;
}

interface Routine {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  notes: string;
  exercises: Exercise[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const WorkoutList: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateAIModalOpen, setIsCreateAIModalOpen] = useState(false);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await axios.get('https://fitoffice2-f70b52bef77e.herokuapp.com/api/routines/routines', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        setRoutines(response.data.data);
      } else {
        throw new Error('Error al obtener las rutinas');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las rutinas');
      console.error('Error fetching routines:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoutine = async (routineData: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      if (selectedRoutine) {
        // Si hay una rutina seleccionada, es una edición
        await axios.put(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/routines/routines/${selectedRoutine._id}`, routineData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Si no hay rutina seleccionada, es una creación
        await axios.post('https://fitoffice2-f70b52bef77e.herokuapp.com/api/routines/routines', routineData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      // Actualizar la lista de rutinas
      fetchRoutines();
      // Limpiar la rutina seleccionada
      setSelectedRoutine(null);
    } catch (err) {
      console.error('Error saving routine:', err);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const handleEditRoutine = (routine: Routine) => {
    setSelectedRoutine(routine);
    setIsCreateModalOpen(true);
  };

  const handleDeleteRoutine = async (routineId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta rutina?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      await axios.delete(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/routines/routines/${routineId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Actualizar la lista de rutinas
      fetchRoutines();
    } catch (err) {
      console.error('Error deleting routine:', err);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
          Rutinas de Entrenamiento
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Crea y gestiona rutinas personalizadas para tus clientes
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="flex space-x-2">
          <Button variant="create" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Crear Rutina
          </Button>
          <Button variant="normal" onClick={() => setIsCreateAIModalOpen(true)}>
            <TrendingUp className="w-5 h-5 mr-2" />
            Crear con IA
          </Button>
          <Button variant="normal">
            <Download className="w-5 h-5 mr-2" />
            Exportar
          </Button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 flex space-x-4"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar rutinas..."
            className={`w-full px-4 py-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-3 text-gray-400" />
        </div>
        <Button variant="filter">
          <Filter className="w-5 h-5 mr-2" />
          Filtros
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-lg shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Nombre</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Descripción</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Tags/Categorías</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Notas Adicionales</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Acciones</th>
              </tr>
            </thead>
            <tbody className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              {routines.map((routine, idx) => (
                <tr 
                  key={routine._id}
                  className={`${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-blue-50'
                  } transition-colors duration-200`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      {routine.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {routine.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {routine.tags.map((tag, index) => (
                        <span key={index} className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          tag.toLowerCase().includes('fuerza') 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : tag.toLowerCase().includes('cardio') 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : tag.toLowerCase().includes('hipertrofia')
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          : tag.toLowerCase().includes('resistencia')
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {routine.notes}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center space-x-3 items-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditRoutine(routine)}
                        className="text-blue-500 hover:text-blue-600 transition-colors duration-150"
                        aria-label={`Editar ${routine.name}`}
                      >
                        <Pencil className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteRoutine(routine._id)}
                        className="text-red-500 hover:text-red-600 transition-colors duration-150"
                        aria-label={`Eliminar ${routine.name}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal de creación/edición */}
      {isCreateModalOpen && (
        <CreateRoutineModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setSelectedRoutine(null);
          }}
          onSave={handleCreateRoutine}
          routine={selectedRoutine}
          theme={theme}
        />
      )}
    </div>
  );
};

export default WorkoutList;