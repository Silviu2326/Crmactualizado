import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, X, Plus, Filter, Dumbbell, Target, Clock } from 'lucide-react';
import Button from '../Common/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroup: string;
  defaultSets: {
    reps: number;
    weight?: number;
    rest?: number;
  }[];
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  equipment: string[];
}
const predefinedExercises: Exercise[] = [
  {
    id: 'squat',
    name: 'Sentadilla',
    category: 'Compuesto',
    muscleGroup: 'Piernas',
    defaultSets: [
      { reps: 8, weight: 60, rest: 90 },
      { reps: 8, weight: 65, rest: 90 },
      { reps: 8, weight: 70, rest: 90 },
      { reps: 0, weight: 0, rest: 60 }, // Serie adicional para variantes que requieren 4 series
    ],
    difficulty: 'Intermedio',
    equipment: ['Barra', 'Rack'],
  },
  {
    id: 'bench-press',
    name: 'Press de Banca',
    category: 'Compuesto',
    muscleGroup: 'Pecho',
    defaultSets: [
      { reps: 8, weight: 40, rest: 90 },
      { reps: 8, weight: 45, rest: 90 },
      { reps: 8, weight: 50, rest: 90 },
      { reps: 0, weight: 0, rest: 60 }, // Serie adicional
    ],
    difficulty: 'Intermedio',
    equipment: ['Barra', 'Banco'],
  },
  {
    id: 'deadlift',
    name: 'Peso Muerto',
    category: 'Compuesto',
    muscleGroup: 'Espalda',
    defaultSets: [
      { reps: 6, weight: 80, rest: 120 },
      { reps: 6, weight: 85, rest: 120 },
      { reps: 6, weight: 90, rest: 120 },
      { reps: 0, weight: 0, rest: 60 }, // Serie adicional
    ],
    difficulty: 'Avanzado',
    equipment: ['Barra'],
  },
];

interface ExerciseSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  isOpen,
  onClose,
  onSelectExercise,
}) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  const categories = Array.from(
    new Set(predefinedExercises.map((e) => e.category))
  );
  const muscleGroups = Array.from(
    new Set(predefinedExercises.map((e) => e.muscleGroup))
  );
  const difficulties = Array.from(
    new Set(predefinedExercises.map((e) => e.difficulty))
  );

  const filteredExercises = predefinedExercises.filter((exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || exercise.category === selectedCategory;
    const matchesMuscleGroup =
      !selectedMuscleGroup || exercise.muscleGroup === selectedMuscleGroup;
    const matchesDifficulty =
      !selectedDifficulty || exercise.difficulty === selectedDifficulty;
    return (
      matchesSearch &&
      matchesCategory &&
      matchesMuscleGroup &&
      matchesDifficulty
    );
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden
              ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Seleccionar Ejercicio
                </h2>
                <Button
                  variant="normal"
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar ejercicios..."
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-all
                      ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-white border-gray-300'
                      }`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all
                      ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-white border-gray-300'
                      }`}
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedMuscleGroup}
                    onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                    className={`px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all
                      ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-white border-gray-300'
                      }`}
                  >
                    <option value="">Todos los grupos musculares</option>
                    {muscleGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className={`px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all
                      ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-white border-gray-300'
                      }`}
                  >
                    <option value="">Todas las dificultades</option>
                    {difficulties.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 max-h-[60vh] overflow-y-auto pr-2">
                {filteredExercises.map((exercise) => (
                  <motion.div
                    key={exercise.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-xl cursor-pointer transition-all duration-300
                      ${
                        theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-650'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    onClick={() => {
                      onSelectExercise(exercise);
                      onClose();
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                          }`}
                        >
                          <Dumbbell className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {exercise.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {exercise.category} · {exercise.muscleGroup}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="create"
                        className="flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Añadir</span>
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div
                        className={`p-3 rounded-lg
                        ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}
                      >
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-green-500" />
                          <span className="text-sm">
                            {exercise.defaultSets.length} series
                          </span>
                        </div>
                      </div>
                      <div
                        className={`p-3 rounded-lg
                        ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}
                      >
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">
                            {exercise.defaultSets[0].rest}s descanso
                          </span>
                        </div>
                      </div>
                      <div
                        className={`p-3 rounded-lg
                        ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}
                      >
                        <div className="flex items-center space-x-2">
                          <Filter className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{exercise.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExerciseSelector;
