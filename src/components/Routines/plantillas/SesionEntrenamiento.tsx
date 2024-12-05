import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Plus, Trash2, Edit2 } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import Button from '../ui/Button';

interface Exercise {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  sets: number;
  reps: number;
  weight: number;
}

interface Session {
  _id: string;
  name: string;
  tipo: 'Normal' | 'Superset';
  rondas?: number;
  exercises: Exercise[];
}

interface SesionEntrenamientoProps {
  sesion: Session;
  onDeleteSession: () => void;
  onAddExercise: () => void;
  onUpdateSession: (updatedSession: Session) => void;
}

export const SesionEntrenamiento: React.FC<SesionEntrenamientoProps> = ({
  sesion,
  onDeleteSession,
  onAddExercise,
  onUpdateSession,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingExercise, setEditingExercise] = useState<string | null>(null);

  const handleUpdateExercise = (exerciseId: string, updates: Partial<Exercise>) => {
    const updatedSession = {
      ...sesion,
      exercises: sesion.exercises.map(exercise =>
        exercise._id === exerciseId
          ? { ...exercise, ...updates }
          : exercise
      )
    };
    onUpdateSession(updatedSession);
    setEditingExercise(null);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const updatedSession = {
      ...sesion,
      exercises: sesion.exercises.filter(exercise => exercise._id !== exerciseId)
    };
    onUpdateSession(updatedSession);
  };

  return (
    <div className={`p-4 rounded-lg shadow-md ${
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <h3 className="text-lg font-semibold">{sesion.name}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddExercise}
            className="flex items-center space-x-1"
          >
            <Plus size={16} />
            <span>Ejercicio</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeleteSession}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {sesion.exercises.map((exercise) => (
              <div
                key={exercise._id}
                className={`p-3 rounded ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{exercise.name}</h4>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingExercise(exercise._id)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteExercise(exercise._id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900 text-red-500 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {editingExercise === exercise._id ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-sm">Series</label>
                        <input
                          type="number"
                          value={exercise.sets}
                          onChange={(e) => handleUpdateExercise(exercise._id, { sets: parseInt(e.target.value) || 0 })}
                          className={`w-full p-1 rounded border ${
                            theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-sm">Repeticiones</label>
                        <input
                          type="number"
                          value={exercise.reps}
                          onChange={(e) => handleUpdateExercise(exercise._id, { reps: parseInt(e.target.value) || 0 })}
                          className={`w-full p-1 rounded border ${
                            theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-sm">Peso (kg)</label>
                        <input
                          type="number"
                          value={exercise.weight}
                          onChange={(e) => handleUpdateExercise(exercise._id, { weight: parseInt(e.target.value) || 0 })}
                          className={`w-full p-1 rounded border ${
                            theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Series:</span> {exercise.sets}
                    </div>
                    <div>
                      <span className="text-gray-500">Reps:</span> {exercise.reps}
                    </div>
                    <div>
                      <span className="text-gray-500">Peso:</span> {exercise.weight}kg
                    </div>
                  </div>
                )}
              </div>
            ))}

            {sesion.exercises.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No hay ejercicios en esta sesión
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SesionEntrenamiento;
