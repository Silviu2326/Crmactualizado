import React from 'react';
import { Exercise } from './types';

interface ExerciseButtonsProps {
  exercise: Exercise;
  onModify: (exercise: Exercise) => void;
  onMakeConditional: (exercise: Exercise) => void;
  onRemoveConditional: (exercise: Exercise) => void;
}

export function ExerciseButtons({ 
  exercise, 
  onModify, 
  onMakeConditional, 
  onRemoveConditional 
}: ExerciseButtonsProps) {
  const isConditional = exercise.conditional;

  return (
    <div className="flex gap-2">
      <button
        onClick={() => onModify(exercise)}
        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
      >
        Modificar
      </button>
      {isConditional ? (
        <button
          onClick={() => onRemoveConditional(exercise)}
          className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium"
        >
          Quitar Condicional
        </button>
      ) : (
        <button
          onClick={() => onMakeConditional(exercise)}
          className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium"
        >
          Hacer Condicional
        </button>
      )}
    </div>
  );
}
