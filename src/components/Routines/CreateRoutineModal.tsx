import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ChevronDown } from 'lucide-react';
import { BasicInformation } from './BasicInformation';
import { Exercise, CreateRoutineModalProps } from './types';
import axios from 'axios';

const metricOptions = [
  'Repeticiones', 'Peso', 'Descanso', 'Tempo', 'RPE',
  'RPM', 'RIR', 'Tiempo', 'Velocidad', 'Cadencia',
  'Distancia', 'Altura', 'Calorías', 'Ronda'
];

const CreateRoutineModal: React.FC<CreateRoutineModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  routine,
  theme = 'light' 
}) => {
  const [routineName, setRoutineName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([{
    id: Date.now().toString(),
    name: '',
    metrics: [
      { type: 'Repeticiones', value: '' },
      { type: 'Peso', value: '' },
      { type: 'Descanso', value: '' }
    ],
    notes: ''
  }]);
  const [openMetricDropdown, setOpenMetricDropdown] = useState<string | null>(null);
  const [apiExercises, setApiExercises] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [focusedExerciseId, setFocusedExerciseId] = useState<string | null>(null);

  useEffect(() => {
    if (routine) {
      setRoutineName(routine.name || '');
      setDescription(routine.description || '');
      setSelectedTags(routine.tags || []);
      setNotes(routine.notes || '');
      setExercises(routine.exercises || []);
    }
    fetchExercises();
  }, [routine]);

  const fetchExercises = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/exercises');
      setApiExercises(response.data.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const handleExerciseNameChange = (exerciseId: string, value: string) => {
    const filteredSuggestions = apiExercises.filter(exercise =>
      exercise.nombre.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(value ? filteredSuggestions : []);
    setFocusedExerciseId(exerciseId);

    const newExercises = exercises.map(exercise =>
      exercise.id === exerciseId ? { ...exercise, name: value } : exercise
    );
    setExercises(newExercises);
  };

  const selectSuggestion = (exerciseId: string, suggestion: any) => {
    const newExercises = exercises.map(exercise =>
      exercise.id === exerciseId ? { ...exercise, name: suggestion.nombre } : exercise
    );
    setExercises(newExercises);
    setSuggestions([]);
    setFocusedExerciseId(null);
  };

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: '',
      metrics: [
        { type: 'Repeticiones', value: '' },
        { type: 'Peso', value: '' },
        { type: 'Descanso', value: '' }
      ],
      notes: ''
    };
    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };

  const updateMetricValue = (exerciseId: string, metricIndex: number, value: string) => {
    setExercises(exercises.map(exercise =>
      exercise.id === exerciseId
        ? {
            ...exercise,
            metrics: exercise.metrics.map((metric, idx) =>
              idx === metricIndex ? { ...metric, value } : metric
            )
          }
        : exercise
    ));
  };

  const handleUpdateMetric = (exerciseId: string, metricIndex: number, newType: string) => {
    setExercises(prevExercises => 
      prevExercises.map(exercise => 
        exercise.id === exerciseId 
          ? {
              ...exercise,
              metrics: exercise.metrics.map((metric, idx) =>
                idx === metricIndex ? { ...metric, type: newType } : metric
              )
            }
          : exercise
      )
    );
    setOpenMetricDropdown(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevenir la propagación del evento
    
    const routineData = {
      name: routineName,
      description,
      tags: selectedTags,
      notes,
      exercises: exercises.map(ex => ({
        name: ex.name,
        metrics: ex.metrics.map(metric => ({ type: metric.type, value: metric.value })),
        notes: ex.notes
      }))
    };
    
    onSave(routineData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-5xl rounded-lg shadow-xl overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              {routine ? "Editar Rutina" : "Crear Nueva Rutina"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSave(e);
          }}>
            <BasicInformation
              routineName={routineName}
              setRoutineName={setRoutineName}
              description={description}
              setDescription={setDescription}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              notes={notes}
              setNotes={setNotes}
              theme={theme}
            />

            <div className="mt-8 overflow-visible">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-lg overflow-hidden shadow-sm">
                <thead className={`${
                  theme === 'dark' 
                    ? 'bg-gray-800 text-gray-200' 
                    : 'bg-blue-50 text-gray-700'
                }`}>
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider w-1/4">
                      Ejercicio
                    </th>
                    {exercises[0]?.metrics.map((metric, index) => (
                      <th key={index} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenMetricDropdown(openMetricDropdown === `header-${index}` ? null : `header-${index}`);
                          }}
                          className="group flex items-center gap-1 hover:text-blue-500 focus:outline-none transition-colors duration-200"
                        >
                          <span>{metric.type}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                            openMetricDropdown === `header-${index}` ? 'rotate-180' : ''
                          }`} />
                        </button>
                        {openMetricDropdown === `header-${index}` && (
                          <div className="fixed mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-50">
                            <div className="py-1 max-h-60 overflow-auto">
                              {metricOptions.map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const exerciseId = exercises[0]?.id;
                                    if (exerciseId) {
                                      handleUpdateMetric(exerciseId, index, option);
                                    }
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-150"
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Notas
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider w-20">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className={`${
                  theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                } divide-y divide-gray-200 dark:divide-gray-700`}>
                  {exercises.map((exercise, exerciseIndex) => (
                    <tr 
                      key={exercise.id} 
                      className={`${
                        theme === 'dark'
                          ? exerciseIndex % 2 === 0 
                            ? 'bg-gray-800/50' 
                            : 'bg-gray-900'
                          : exerciseIndex % 2 === 0
                            ? 'bg-gray-50/50'
                            : 'bg-white'
                      } ${theme === 'dark' ? 'hover:bg-gray-800/70' : 'hover:bg-gray-100'} transition-colors duration-150`}
                    >
                      <td className="px-6 py-4 relative">
                        <input
                          type="text"
                          value={exercise.name}
                          onChange={(e) => handleExerciseNameChange(exercise.id, e.target.value)}
                          onFocus={() => setFocusedExerciseId(exercise.id)}
                          className={`w-full bg-transparent border-0 focus:ring-2 focus:ring-blue-500 rounded-md ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                          }`}
                          placeholder="Nombre del ejercicio"
                        />
                        {focusedExerciseId === exercise.id && suggestions.length > 0 && (
                          <div className="fixed mt-1 ml-6 w-96 bg-white dark:bg-gray-700 rounded-md shadow-lg z-[100]" style={{ maxWidth: 'calc(100% - 2rem)' }}>
                            {suggestions.map((suggestion) => (
                              <button
                                key={suggestion._id}
                                type="button"
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-gray-600"
                                onClick={() => selectSuggestion(exercise.id, suggestion)}
                              >
                                {suggestion.nombre}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                      {exercise.metrics.map((metric, metricIndex) => (
                        <td key={metricIndex} className="px-6 py-4">
                          <input
                            type="text"
                            value={metric.value}
                            onChange={(e) => updateMetricValue(exercise.id, metricIndex, e.target.value)}
                            className={`w-full bg-transparent border-0 focus:ring-2 focus:ring-blue-500 rounded-md ${
                              theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                            }`}
                            placeholder={`${metric.type}`}
                          />
                        </td>
                      ))}
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={exercise.notes || ''}
                          onChange={(e) => {
                            const newExercises = [...exercises];
                            newExercises[exerciseIndex].notes = e.target.value;
                            setExercises(newExercises);
                          }}
                          className={`w-full bg-transparent border-0 focus:ring-2 focus:ring-blue-500 rounded-md ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                          }`}
                          placeholder="Notas"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => removeExercise(exercise.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          title="Eliminar ejercicio"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={addExercise}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Agregar Ejercicio
              </button>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={onClose}
                className={`px-6 py-2 rounded-lg font-medium ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                } transition-colors`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                {routine ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoutineModal;