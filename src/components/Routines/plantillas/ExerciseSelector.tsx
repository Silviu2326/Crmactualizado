import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

// Lista de ejercicios de ejemplo
const mockExercises = [
  {
    _id: '1',
    name: 'Press de Banca',
    description: 'Ejercicio para pecho',
    category: 'Pecho',
    sets: 3,
    reps: 12,
    weight: 0
  },
  {
    _id: '2',
    name: 'Sentadillas',
    description: 'Ejercicio para piernas',
    category: 'Piernas',
    sets: 3,
    reps: 12,
    weight: 0
  },
  {
    _id: '3',
    name: 'Dominadas',
    description: 'Ejercicio para espalda',
    category: 'Espalda',
    sets: 3,
    reps: 12,
    weight: 0
  },
  {
    _id: '4',
    name: 'Curl de Bíceps',
    description: 'Ejercicio para bíceps',
    category: 'Brazos',
    sets: 3,
    reps: 12,
    weight: 0
  }
];

interface Exercise {
  _id: string;
  name: string;
  description: string;
  category: string;
  sets: number;
  reps: number;
  weight: number;
}

interface ExerciseSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  isOpen,
  onClose,
  onSelectExercise,
}) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [exercises] = useState<Exercise[]>(mockExercises);

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            className={`fixed inset-x-0 bottom-0 z-50 p-4 rounded-t-xl shadow-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Seleccionar Ejercicio</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar ejercicio..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div className="max-h-96 overflow-y-auto">
                {filteredExercises.map((exercise) => (
                  <motion.div
                    key={exercise._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`p-4 mb-2 rounded-lg cursor-pointer transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700 bg-gray-800'
                        : 'hover:bg-gray-100 bg-white'
                    }`}
                    onClick={() => {
                      onSelectExercise(exercise);
                      onClose();
                    }}
                  >
                    <h3 className="font-medium">{exercise.name}</h3>
                    <p className="text-sm text-gray-500">{exercise.description}</p>
                    <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      {exercise.category}
                    </span>
                  </motion.div>
                ))}

                {filteredExercises.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No se encontraron ejercicios
                  </div>
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
