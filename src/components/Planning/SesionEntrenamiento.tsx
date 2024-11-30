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
} from 'lucide-react';
import Button from '../Common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import EditSessionPopup from './EditSessionPopup';
import { trainingVariants } from './trainingVariants';
import type { Set } from './trainingVariants';

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

  // Eliminar el useEffect que actualiza el plan basado en variant

  const handleSaveSession = (updatedSession: Session) => {
    const updatedPlan: WeekPlan = {
      ...planSemanal,
      [diaSeleccionado]: {
        ...planSemanal[diaSeleccionado],
        sessions: planSemanal[diaSeleccionado].sessions.map((s) =>
          s.id === session.id ? { ...s, name: updatedSession.name } : s
        ),
      },
    };
    updatePlan(updatedPlan);
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
          s.id === session.id
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
          s.id === session.id
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
          s.id === session.id
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
          s.id === session.id
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
    <>
      <EditSessionPopup
        isOpen={showEditPopup}
        onClose={() => setShowEditPopup(false)}
        session={session}
        onSave={handleSaveSession}
      />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-4 rounded-lg border
          ${
            theme === 'dark'
              ? 'border-gray-700 bg-gray-750'
              : 'border-gray-200 bg-gray-50'
          }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Dumbbell className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold">{session.name}</h3>
            <span
              className={`px-2 py-1 rounded text-sm ${
                variant === 0
                  ? 'bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  : variant === 1
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : variant === 2
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}
            >
              Variante {variant}
            </span>
          </div>
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
              className={`rounded-lg transition-all duration-200
                ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
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
                                  className={`w-full p-2 rounded-md border
                                    ${
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
                                  className={`w-full p-2 rounded-md border
                                    ${
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
                                  className={`w-full p-2 rounded-md border
                                    ${
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
      </motion.div>
    </>
  );
};

export default SesionEntrenamiento;
