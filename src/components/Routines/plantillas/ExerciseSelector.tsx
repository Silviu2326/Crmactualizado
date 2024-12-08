import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Search, X, Plus, Filter, Dumbbell, Target, Clock } from 'lucide-react';
import Button from '../../Common/Button';
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

interface Set {
  reps: number;
  weight: number;
  weightType: string;
  rest: number;
  tempo: string;
  rpe: number;
}

interface ExerciseWithSets {
  exercise: Exercise;
  sets: Set[];
}

interface ExerciseSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: ExerciseWithSets) => void;
  templateId: string;
  weekNumber: number;
  dayNumber: number;
  sessionId: string;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  isOpen,
  onClose,
  onSelectExercise,
  templateId,
  weekNumber,
  dayNumber,
  sessionId,
}) => {
  const { theme } = useTheme();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('');

  // Log inicial de props y validación
  useEffect(() => {
    if (isOpen) {
      console.log('=== ExerciseSelector Abierto ===');
      console.log('Validando datos recibidos:');
      
      const missingData = [];
      if (!templateId) missingData.push('Template ID');
      if (!weekNumber) missingData.push('Semana');
      if (!dayNumber) missingData.push('Día');
      if (!sessionId) missingData.push('Sesión ID');

      if (missingData.length > 0) {
        console.error('Datos faltantes:', missingData.join(', '));
      }

      console.table({
        'Template ID': templateId || 'FALTA',
        'Semana': weekNumber || 'FALTA',
        'Día': dayNumber || 'FALTA',
        'Sesión ID': sessionId || 'FALTA'
      });
      
      console.log('Estado de los datos:');
      console.log('- Template ID:', templateId ? '✓' : '✗');
      console.log('- Semana:', weekNumber ? '✓' : '✗');
      console.log('- Día:', dayNumber ? '✓' : '✗');
      console.log('- Sesión ID:', sessionId ? '✓' : '✗');
      console.log('================================');
    }
  }, [isOpen, templateId, weekNumber, dayNumber, sessionId]);

  // Mostrar datos recibidos cuando el selector se abre
  useEffect(() => {
    if (isOpen) {
      const missingData = [];
      if (!templateId) missingData.push('Template ID');
      if (!weekNumber) missingData.push('Semana');
      if (!dayNumber) missingData.push('Día');
      if (!sessionId) missingData.push('Sesión ID');
  
      if (missingData.length > 0) {
        console.warn('Faltan datos:', missingData.join(', '));
      } else {
        console.log('Todos los datos están presentes');
      }
    }
  }, [isOpen, templateId, weekNumber, dayNumber, sessionId]);
  
  // Log inicial de props
  useEffect(() => {
    console.log('ExerciseSelector - Props recibidos:', {
      templateId,
      weekNumber,
      dayNumber,
      sessionId
    });
  }, [templateId, weekNumber, dayNumber, sessionId]);

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
      const response = await axios.get('https://fitoffice2-f70b52bef77e.herokuapp.com/api/exercises', {
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

  const handleSelectExercise = async (exercise: Exercise) => {
    console.log('ExerciseSelector - handleSelectExercise llamado');
    console.log('Datos del ejercicio:', exercise);

    try {
      // Datos del ejercicio por defecto
      const defaultSet = {
        reps: 12,
        weight: 20,
        weightType: "absolute",
        rest: 60,
        tempo: "2-0-2",
        rpe: 8
      };

      const exerciseData = {
        exerciseId: exercise._id,
        sets: [defaultSet]
      };

      const url = `https://fitoffice2-f70b52bef77e.herokuapp.com/api/planningtemplate/templates/${templateId}/weeks/${weekNumber}/days/${dayNumber}/sessions/${sessionId}/exercises`;
      
      console.log('URL de la petición:', url);
      console.log('Datos a enviar:', exerciseData);

      const response = await axios.post(url, exerciseData);

      console.log('Respuesta del servidor:', response.data);

      if (response.status === 200 || response.status === 201) {
        onSelectExercise({
          exercise: exercise,
          sets: [defaultSet]
        });
        onClose();
      }
    } catch (error) {
      console.error('Error al agregar ejercicio:', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }
      setError('Error al agregar el ejercicio');
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed inset-x-0 bottom-0 z-50 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } rounded-t-xl shadow-xl max-h-[90vh] overflow-y-auto`}
          >
            <div className="sticky top-0 p-4 border-b border-gray-200 dark:border-gray-700 bg-inherit">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Seleccionar Ejercicio</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Mostrar datos recibidos en la UI */}
              <div className={`mb-4 p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <h3 className="text-sm font-semibold mb-2">Datos de la Sesión:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Template:</span>
                    <span className="ml-2">{templateId?.slice(-6)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Semana:</span>
                    <span className="ml-2">{weekNumber}</span>
                  </div>
                  <div>
                    <span className="font-medium">Día:</span>
                    <span className="ml-2">{dayNumber}</span>
                  </div>
                  <div>
                    <span className="font-medium">Sesión:</span>
                    <span className="ml-2">{sessionId?.slice(-6)}</span>
                  </div>
                </div>
              </div>
              
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
        </>
      )}
    </AnimatePresence>
  );
};

export default ExerciseSelector;
