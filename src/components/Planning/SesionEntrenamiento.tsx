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
import axios from 'axios';

interface Session {
  _id: string;
  name: string;
  tipo: 'Normal' | 'Superset';
  rondas?: number;
  exercises: Exercise[];
}

interface Exercise {
  _id: string;
  name: string;
  sets: Set[];
}

interface Set {
  id: string;
  reps: number;
  weight: number;
  rest: number;
}

interface SesionEntrenamientoProps {
  session: Session;
  onClose: () => void;
  planningId: string;
  weekNumber: number;
  selectedDay: string;
}

const SesionEntrenamiento: React.FC<SesionEntrenamientoProps> = ({
  session,
  onClose,
  planningId,
  weekNumber,
  selectedDay,
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
    const updatedPlan: any = {
      ...session,
      name: updatedSession.name,
    };
    console.log('Plan actualizado:', updatedPlan);
  };

  const handleUpdateRounds = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      console.log('Actualizando rondas para sesión:', session._id, 'Nuevas rondas:', editedRounds);

      const response = await fetch(`http://localhost:3000/api/plannings/session/${session._id}/rounds`, {
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
      setIsEditingRounds(false);
    } catch (error) {
      console.error('Error al actualizar las rondas:', error);
    }
  };

  const handleDeleteSession = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/plannings/session/${session._id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      onClose();
    } catch (error) {
      console.error('Error deleting session:', error);
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

  const updatePlanningExercise = async (exerciseId: string, updatedSets: Set[]) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      console.log('SesionEntrenamiento: Actualizando ejercicio:', {
        planningId,
        weekNumber,
        day: selectedDay,
        sessionId: session._id,
        exerciseId,
        sets: updatedSets
      });

      const url = `http://localhost:3000/api/plannings/${planningId}/weeks/${weekNumber}/days/${selectedDay}/sessions/${session._id}/exercises/${exerciseId}`;
      
      const response = await axios.put(
        url,
        { sets: updatedSets },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data) {
        throw new Error('Error al actualizar el ejercicio');
      }

      console.log('SesionEntrenamiento: Ejercicio actualizado exitosamente:', response.data);
      return response.data;
    } catch (err) {
      console.error('SesionEntrenamiento: Error al actualizar ejercicio:', err);
      throw err;
    }
  };

  const handleSetChange = async (exerciseId: string, setId: string, field: keyof Set, value: number) => {
    try {
      const exercise = session.exercises.find(e => e._id === exerciseId);
      if (!exercise) return;

      const updatedSets = exercise.sets.map(set => 
        set.id === setId ? { ...set, [field]: value } : set
      );

      await updatePlanningExercise(exerciseId, updatedSets);
      
      // Actualizar el estado local después de la actualización exitosa
      session.exercises = session.exercises.map(e => 
        e._id === exerciseId ? { ...e, sets: updatedSets } : e
      );
    } catch (error) {
      console.error('Error al actualizar el set:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const handleAddSet = async (exerciseId: string) => {
    try {
      const exercise = session.exercises.find(e => e._id === exerciseId);
      if (!exercise) return;

      const newSet: Set = {
        id: Date.now().toString(),
        reps: 12,
        weight: 10,
        rest: 60
      };

      const updatedSets = [...exercise.sets, newSet];
      await updatePlanningExercise(exerciseId, updatedSets);

      // Actualizar el estado local después de la actualización exitosa
      session.exercises = session.exercises.map(e => 
        e._id === exerciseId ? { ...e, sets: updatedSets } : e
      );
    } catch (error) {
      console.error('Error al agregar el set:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const handleDeleteSet = async (exerciseId: string, setId: string) => {
    try {
      const exercise = session.exercises.find(e => e._id === exerciseId);
      if (!exercise || exercise.sets.length <= 1) return; // No permitir eliminar el último set

      const updatedSets = exercise.sets.filter(set => set.id !== setId);
      await updatePlanningExercise(exerciseId, updatedSets);

      // Actualizar el estado local después de la actualización exitosa
      session.exercises = session.exercises.map(e => 
        e._id === exerciseId ? { ...e, sets: updatedSets } : e
      );
    } catch (error) {
      console.error('Error al eliminar el set:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const renderSetValue = (value: number, unit: string) => {
    switch(unit) {
      case 'kg':
        return `${value} kg`;
      case 'reps':
        return `${value} reps`;
      case 'sec':
        return `${value} seg`;
      default:
        return value;
    }
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
            <Button variant="normal" onClick={onClose} className="p-2">
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="normal"
              onClick={() => setShowEditPopup(true)}
              className="p-2"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="delete" onClick={handleDeleteSession} className="p-2">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-3">
          {session.exercises.map((exercise) => (
            <motion.div
              key={exercise._id}
              className={`rounded-lg transition-all duration-200 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-white'
              }`}
            >
              <div
                className="p-3 flex items-center justify-between cursor-pointer hover:bg-opacity-90"
                onClick={() => toggleEjercicio(exercise._id)}
              >
                <div className="flex items-center space-x-4">
                  <Target className="w-5 h-5 text-green-500" />
                  <span className="font-medium">{exercise.name}</span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-6">
                    <span>{exercise.sets.length} series</span>
                  </div>
                  {ejerciciosExpandidos.has(exercise._id) ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {ejerciciosExpandidos.has(exercise._id) && (
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
                            key={`${exercise._id}-set-${index}`}
                            className={`p-4 rounded-lg ${
                              theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">Serie {index + 1}</h4>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Repeticiones
                                </label>
                                <input
                                  type="number"
                                  value={set.reps}
                                  onChange={(e) => handleSetChange(exercise._id, set.id, 'reps', parseInt(e.target.value))}
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
                                  onChange={(e) => handleSetChange(exercise._id, set.id, 'weight', parseInt(e.target.value))}
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
                                  onChange={(e) => handleSetChange(exercise._id, set.id, 'rest', parseInt(e.target.value))}
                                  className={`w-full p-2 rounded-md border ${
                                    theme === 'dark'
                                      ? 'bg-gray-700 border-gray-500'
                                      : 'bg-white border-gray-300'
                                  }`}
                                />
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <span>Valor: {renderSetValue(set.reps, 'reps')} - {renderSetValue(set.weight, 'kg')} - {renderSetValue(set.rest, 'sec')}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <button
                          onClick={() => handleAddSet(exercise._id)}
                          className="flex items-center text-blue-500 hover:text-blue-700"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Agregar Set
                        </button>
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
