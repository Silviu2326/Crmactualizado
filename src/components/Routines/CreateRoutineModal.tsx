import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  reps: string;
  weight: string;
  rest: string;
}

interface CreateRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (routineData: any) => void;
}

const CreateRoutineModal: React.FC<CreateRoutineModalProps> = ({ isOpen, onClose, onSave }) => {
  const [routineName, setRoutineName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedGoal, setSelectedGoal] = useState('');

  const predefinedTags = ['Upper body', 'Lower body', 'Push', 'Pull', 'Legs'];
  const goalOptions = [
    'Cardio',
    'Fuerza',
    'Hipertrofia',
    'Resistencia',
    'Movilidad',
    'Coordinación',
    'Definición',
    'Recomposición',
    'Rehabilitación',
    'Otra'
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: '',
      reps: '',
      weight: '',
      rest: ''
    };
    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };

  const updateExercise = (id: string, field: keyof Exercise, value: string) => {
    setExercises(exercises.map(exercise =>
      exercise.id === id ? { ...exercise, [field]: value } : exercise
    ));
  };

  const handleSave = () => {
    const routineData = {
      name: routineName,
      description,
      tags: selectedTags,
      notes,
      exercises,
      goal: selectedGoal
    };
    onSave(routineData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Crear Nueva Rutina</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-red-800" />
          </button>
        </div>

        {/* General Information */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre de la Rutina
            </label>
            <input
              type="text"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Ingrese el nombre de la rutina"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Meta
            </label>
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">Seleccione una meta</option>
              {goalOptions.map(goal => (
                <option key={goal} value={goal}>{goal}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Describa la rutina"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags/Categorías
            </label>
            <div className="flex flex-wrap gap-2">
              {predefinedTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notas Adicionales
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="textarea textarea-bordered w-full h-24"
              placeholder="Añada notas adicionales sobre la rutina"
            />
          </div>
        </div>

        {/* Exercises Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ejercicios/Actividades
          </h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Ejercicio</th>
                  <th>Repeticiones</th>
                  <th>Peso</th>
                  <th>Descanso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {exercises.map((exercise) => (
                  <tr key={exercise.id}>
                    <td>
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                        className="input input-bordered w-full"
                        placeholder="Nombre del ejercicio"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(exercise.id, 'reps', e.target.value)}
                        className="input input-bordered w-full"
                        placeholder="Repeticiones"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={exercise.weight}
                        onChange={(e) => updateExercise(exercise.id, 'weight', e.target.value)}
                        className="input input-bordered w-full"
                        placeholder="Peso (kg)"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={exercise.rest}
                        onChange={(e) => updateExercise(exercise.id, 'rest', e.target.value)}
                        className="input input-bordered w-full"
                        placeholder="Descanso"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => removeExercise(exercise.id)}
                        className="btn btn-ghost btn-sm text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={addExercise}
            className="btn btn-ghost btn-sm mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar ejercicio
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleSave}
            className="btn bg-purple-600 hover:bg-purple-700 text-white"
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="btn bg-red-800 hover:bg-red-900 text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoutineModal;
