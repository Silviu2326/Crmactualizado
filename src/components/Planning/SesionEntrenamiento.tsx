// src/components/SesionEntrenamiento.tsx

import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Plus,
  Edit2,
  Trash2,
  Dumbbell,
  Target,
  ChevronDown,
  ChevronUp,
  Save,
  XCircle,
} from 'lucide-react';
import Button from '../Common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import EditSessionPopup from './EditSessionPopup';
import { trainingVariants } from './trainingVariants';
import type { Set } from './trainingVariants';

interface Session {
  _id: string;
  name: string;
  tipo: 'Normal' | 'Superset';
  rondas?: number;
  exercises: Exercise[];
}

interface SesionEntrenamientoProps {
  session: Session;
  diaSeleccionado: string;
  onDeleteSession: () => void;
  onAddExercise: () => void;
  planSemanal: WeekPlan;
  updatePlan: (plan: WeekPlan) => void;
  variant: 0 | 1 | 2 | 3;
  previousDayStatus?: 'good' | 'regular' | 'bad';
}

const SesionEntrenamiento: React.FC<SesionEntrenamientoProps> = ({
  session,
  diaSeleccionado,
  onDeleteSession,
  onAddExercise,
  planSemanal,
  updatePlan,
  variant,
  previousDayStatus,
}) => {
  const { theme } = useTheme();
  const [ejerciciosExpandidos, setEjerciciosExpandidos] = useState<Set<string>>(
    new Set()
  );
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [isEditingRounds, setIsEditingRounds] = useState(false);
  const [editedRounds, setEditedRounds] = useState(session.rondas || 0);

  console.log('Session data:', session);

  const handleSaveSession = (updatedSession: Session) => {
    const updatedPlan: WeekPlan = {
      ...planSemanal,
      [diaSeleccionado]: {
        ...planSemanal[diaSeleccionado],
        sessions: planSemanal[diaSeleccionado].sessions.map((s) =>
          s._id === session._id ? { ...s, name: updatedSession.name } : s
        ),
      },
    };
    updatePlan(updatedPlan);
  };

  const handleUpdateRounds = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      console.log('Actualizando rondas para sesión:', session._id, 'Nuevas rondas:', editedRounds);

      const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/plannings/session/${session._id}/rounds`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rondas: editedRounds }),
      });

      console.log('Respuesta del servidor:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al actualizar las rondas');
      }

      // Actualizar el estado local
      const updatedPlan = {
        ...planSemanal,
        [diaSeleccionado]: {
          ...planSemanal[diaSeleccionado],
          sessions: planSemanal[diaSeleccionado].sessions.map(s =>
            s._id === session._id ? { ...s, rondas: editedRounds } : s
          ),
        },
      };
      updatePlan(updatedPlan);
      setIsEditingRounds(false);
    } catch (error) {
      console.error('Error al actualizar las rondas:', error);
    }
  };

  const toggleEjercicio = (ejercicioId: string) => {
    setEjerciciosExpandidos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ejercicioId)) {
        newSet.delete(ejercicioId);
      } else {
        newSet.add(ejercicioId);
      }
      return newSet;
    });
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const updatedPlan: WeekPlan = {
      ...planSemanal,
      [diaSeleccionado]: {
        ...planSemanal[diaSeleccionado],
        sessions: planSemanal[diaSeleccionado].sessions.map((s) =>
          s._id === session._id
            ? {
                ...s,
                exercises: s.exercises.filter((e) => e.id !== exerciseId),
              }
            : s
        ),
      },
    };
    updatePlan(updatedPlan);
    setEjerciciosExpandidos((prev) => {
      const newSet = new Set(prev);
      newSet.delete(exerciseId);
      return newSet;
    });
  };

  const handleAddSet = (exerciseId: string) => {
    const newSet: Set = {
      id: `set-${Date.now()}`,
      reps: 12,
      weight: 0,
      rest: 60,
    };

    const updatedPlan: WeekPlan = {
      ...planSemanal,
      [diaSeleccionado]: {
        ...planSemanal[diaSeleccionado],
        sessions: planSemanal[diaSeleccionado].sessions.map((s) =>
          s._id === session._id
            ? {
                ...s,
                exercises: s.exercises.map((exercise) =>
                  exercise.id === exerciseId
                    ? { ...exercise, sets: [...exercise.sets, newSet] }
                    : exercise
                ),
              }
            : s
        ),
      },
    };
    updatePlan(updatedPlan);
  };

  const handleDeleteSet = (exerciseId: string, setId: string) => {
    const updatedPlan: WeekPlan = {
      ...planSemanal,
      [diaSeleccionado]: {
        ...planSemanal[diaSeleccionado],
        sessions: planSemanal[diaSeleccionado].sessions.map((s) =>
          s._id === session._id
            ? {
                ...s,
                exercises: s.exercises.map((exercise) =>
                  exercise.id === exerciseId
                    ? {
                        ...exercise,
                        sets: exercise.sets.filter((set) => set.id !== setId),
                      }
                    : exercise
                ),
              }
            : s
        ),
      },
    };
    updatePlan(updatedPlan);
  };

  const handleUpdateSet = (
    exerciseId: string,
    setId: string,
    updatedSet: { reps: number; weight?: number; rest?: number }
  ) => {
    const updatedPlan: WeekPlan = {
      ...planSemanal,
      [diaSeleccionado]: {
        ...planSemanal[diaSeleccionado],
        sessions: planSemanal[diaSeleccionado].sessions.map((s) =>
          s._id === session._id
            ? {
                ...s,
                exercises: s.exercises.map((exercise) =>
                  exercise.id === exerciseId
                    ? {
                        ...exercise,
                        sets: exercise.sets.map((set) =>
                          set.id === setId ? { ...set, ...updatedSet } : set
                        ),
                      }
                    : exercise
                ),
              }
            : s
        ),
      },
    };
    updatePlan(updatedPlan);
  };

  return (
    <div
      className={`p-4 rounded-lg shadow-md mb-4 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <div className="flex flex-col space-y-2">
        {/* Encabezado de la sesión */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold">{session.name}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                {session.tipo}
              </span>
              {session.tipo === 'Superset' && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Rondas:</span>
                  {isEditingRounds ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={editedRounds}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value >= 1) {
                            setEditedRounds(value);
                          }
                        }}
                        min="1"
                        className={`w-16 px-2 py-1 rounded border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600'
                            : 'bg-white border-gray-300'
                        }`}
                      />
                      <button
                        onClick={handleUpdateRounds}
                        className="text-green-500 hover:text-green-600"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingRounds(false);
                          setEditedRounds(session.rondas || 0);
                        }}
                        className="text-red-500 hover:text-red-600"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditingRounds(true)}
                      className="flex items-center space-x-1 text-sm hover:text-blue-500"
                    >
                      <span>{session.rondas || 0}</span>
                      <Edit2 size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Controles de la sesión */}
          <div className="flex items-center space-x-2">
            <Button variant="normal" onClick={onAddExercise} className="p-2">
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="normal"
              onClick={() => setShowEditPopup(true)}
              className="p-2"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="delete" onClick={onDeleteSession} className="p-2">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-3">
          {session.exercises.map((exercise) => (
            <motion.div
              key={exercise.id}
              className={`rounded-lg transition-all duration-200 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-white'
              }`}
            >
              <div
                className="p-3 flex items-center justify-between cursor-pointer hover:bg-opacity-90"
                onClick={() => toggleEjercicio(exercise.id)}
              >
                <div className="flex items-center space-x-4">
                  <Target className="w-5 h-5 text-green-500" />
                  <span className="font-medium">{exercise.name}</span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-6">
                    <span>{exercise.sets.length} series</span>
                    <Button
                      variant="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteExercise(exercise.id);
                      }}
                      className="p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {ejerciciosExpandidos.has(exercise.id) ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {ejerciciosExpandidos.has(exercise.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                  >
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="space-y-4">
                        {exercise.sets.map((set, index) => (
                          <div
                            key={set.id}
                            className={`p-4 rounded-lg ${
                              theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">Serie {index + 1}</h4>
                              <Button
                                variant="delete"
                                onClick={() =>
                                  handleDeleteSet(exercise.id, set.id)
                                }
                                className="p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Repeticiones
                                </label>
                                <input
                                  type="number"
                                  value={set.reps}
                                  onChange={(e) =>
                                    handleUpdateSet(exercise.id, set.id, {
                                      reps: parseInt(e.target.value),
                                    })
                                  }
                                  className={`w-full p-2 rounded-md border ${
                                    theme === 'dark'
                                      ? 'bg-gray-700 border-gray-500'
                                      : 'bg-white border-gray-300'
                                  }`}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Peso (kg)
                                </label>
                                <input
                                  type="number"
                                  value={set.weight}
                                  onChange={(e) =>
                                    handleUpdateSet(exercise.id, set.id, {
                                      weight: parseInt(e.target.value),
                                    })
                                  }
                                  className={`w-full p-2 rounded-md border ${
                                    theme === 'dark'
                                      ? 'bg-gray-700 border-gray-500'
                                      : 'bg-white border-gray-300'
                                  }`}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Descanso (s)
                                </label>
                                <input
                                  type="number"
                                  value={set.rest}
                                  onChange={(e) =>
                                    handleUpdateSet(exercise.id, set.id, {
                                      rest: parseInt(e.target.value),
                                    })
                                  }
                                  className={`w-full p-2 rounded-md border ${
                                    theme === 'dark'
                                      ? 'bg-gray-700 border-gray-500'
                                      : 'bg-white border-gray-300'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <Button
                          variant="normal"
                          onClick={() => handleAddSet(exercise.id)}
                          className="flex items-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Añadir Serie</span>
                        </Button>
                        <Button
                          variant="create"
                          className="flex items-center space-x-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Guardar</span>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {session.exercises.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay ejercicios en esta sesión
          </div>
        )}
      </div>
    </div>
  );
};

export default SesionEntrenamiento;
