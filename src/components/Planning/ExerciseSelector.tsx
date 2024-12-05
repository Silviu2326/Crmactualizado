import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, X, Plus, Filter, Dumbbell, Target, Clock } from 'lucide-react';
import Button from '../Common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface Exercise {
  _id: string;
  nombre: string;
  tipo?: string;
  grupoMuscular: string[];
  descripcion: string;
  equipo: string[];
  imgUrl: string;
  fechaCreacion: string;
}

interface ExerciseWithSets extends Exercise {
  sets: {
    id: string;
    reps: number;
    weight: number;
    rest: number;
  }[];
}

interface ExerciseSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: ExerciseWithSets) => void;
  planningId: string;
  weekNumber: number;
  selectedDay: string;
  sessionId: string;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  isOpen,
  onClose,
  onSelectExercise,
  planningId,
  weekNumber,
  selectedDay,
  sessionId,
}) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('ExerciseSelector: Iniciando fetchExercises');
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      console.log('ExerciseSelector: Realizando petición a la API de ejercicios');
      const response = await axios.get('http://localhost:3000/api/exercises', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.data) {
        console.log('ExerciseSelector: Ejercicios obtenidos exitosamente:', response.data.data.length);
        setExercises(response.data.data);
      } else {
        throw new Error('Error al obtener los ejercicios');
      }
    } catch (err) {
      console.error('ExerciseSelector: Error en fetchExercises:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los ejercicios');
    } finally {
      setLoading(false);
    }
  };

  const addExerciseToSession = async (exerciseId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      console.log('ExerciseSelector: Agregando ejercicio a la sesión', {
        planningId,
        weekNumber,
        day: selectedDay,
        sessionId,
        exerciseId
      });

      const url = `http://localhost:3000/api/plannings/${planningId}/weeks/${weekNumber}/days/${selectedDay}/sessions/${sessionId}/exercises`;
      
      const response = await axios.post(
        url,
        { exerciseId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data) {
        throw new Error('Error al agregar el ejercicio a la sesión');
      }

      console.log('ExerciseSelector: Ejercicio agregado exitosamente:', response.data);
      return true;
    } catch (err) {
      console.error('ExerciseSelector: Error al agregar ejercicio:', err);
      throw err;
    }
  };

  const handleSelectExercise = async (exercise: Exercise) => {
    try {
      console.log('ExerciseSelector: Ejercicio seleccionado:', exercise);
      
      // Primero hacer la petición al backend
      await addExerciseToSession(exercise._id);
      
      // Si la petición fue exitosa, crear el ejercicio con sets
      const exerciseWithSets: ExerciseWithSets = {
        ...exercise,
        sets: [{
          id: Date.now().toString(),
          reps: 12,
          weight: 10,
          rest: 60
        }]
      };

      console.log('ExerciseSelector: Ejercicio con sets:', exerciseWithSets);
      onSelectExercise(exerciseWithSets);
      onClose();
    } catch (error) {
      console.error('Error al agregar el ejercicio:', error);
      setError('Error al agregar el ejercicio a la sesión');
    }
  };

  // Obtener tipos y grupos musculares únicos de los ejercicios
  const types = Array.from(
    new Set(exercises.map((e) => e.tipo).filter(Boolean))
  );
  
  const muscleGroups = Array.from(
    new Set(exercises.flatMap((e) => e.grupoMuscular))
  );

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      !selectedType || exercise.tipo === selectedType;
    const matchesMuscleGroup =
      !selectedMuscleGroup || exercise.grupoMuscular.includes(selectedMuscleGroup);

    return matchesSearch && matchesType && matchesMuscleGroup;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-4xl ${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        } rounded-lg shadow-2xl overflow-hidden`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Seleccionar Ejercicio</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Barra de búsqueda y filtros */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar ejercicio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
              </div>
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            >
              <option value="">Todos los tipos</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={selectedMuscleGroup}
              onChange={(e) => setSelectedMuscleGroup(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            >
              <option value="">Todos los músculos</option>
              {muscleGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          {/* Lista de ejercicios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {loading ? (
              <div className="col-span-2 text-center py-8">Cargando ejercicios...</div>
            ) : error ? (
              <div className="col-span-2 text-center py-8 text-red-500">{error}</div>
            ) : filteredExercises.length === 0 ? (
              <div className="col-span-2 text-center py-8">No se encontraron ejercicios</div>
            ) : (
              filteredExercises.map((exercise) => (
                <motion.div
                  key={exercise._id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-50 hover:bg-gray-100'
                  } transition-all shadow-md`}
                  onClick={() => handleSelectExercise(exercise)}
                >
                  <div className="flex items-start gap-4">
                    {exercise.imgUrl && (
                      <img
                        src={exercise.imgUrl}
                        alt={exercise.nombre}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{exercise.nombre}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {exercise.descripcion}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {exercise.grupoMuscular.map((muscle) => (
                          <span
                            key={muscle}
                            className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExerciseSelector;
