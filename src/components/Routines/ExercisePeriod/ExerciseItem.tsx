import React from 'react';
import clsx from 'clsx';
import { Exercise } from './types';

interface ExerciseItemProps {
  exercise: Exercise;
  onModify: (exercise: Exercise) => void;
  onMakeConditional: (exercise: Exercise) => void;
  onRemoveConditional: (exercise: Exercise) => void;
}

export function ExerciseItem({ 
  exercise, 
  onModify, 
  onMakeConditional, 
  onRemoveConditional 
}: ExerciseItemProps) {
  const getBackgroundColor = () => {
    if (exercise.disabled) return "bg-red-50 hover:bg-red-100";
    if (exercise.conditional) return "bg-green-50 hover:bg-green-100";
    return "bg-indigo-50 hover:bg-indigo-100";
  };

  const getTextColor = () => {
    if (exercise.disabled) return "text-red-700";
    if (exercise.conditional) return "text-green-700";
    return "text-indigo-700";
  };

  return (
    <div className={clsx(
      "p-3 rounded-lg flex items-center justify-between transition-colors",
      getBackgroundColor()
    )}>
      <div className="flex items-center gap-2">
        <span className={clsx(
          "font-medium",
          getTextColor()
        )}>
          {exercise.name}
        </span>
        {exercise.conditional && (
          <span className="text-green-700 text-sm font-medium bg-green-100 px-2 py-0.5 rounded-full">
            Condicional
          </span>
        )}
        {exercise.disabled && (
          <span className="text-red-700 text-sm font-medium bg-red-100 px-2 py-0.5 rounded-full">
            Deshabilitado
          </span>
        )}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onModify(exercise)}
          className={clsx(
            "px-3 py-1.5 text-sm rounded-lg transition-colors font-medium",
            exercise.disabled ? "bg-red-200 text-red-700 hover:bg-red-300" :
            exercise.conditional ? "bg-green-200 text-green-700 hover:bg-green-300" :
            "bg-indigo-200 text-indigo-700 hover:bg-indigo-300"
          )}
        >
          Modificar
        </button>
        
        {!exercise.conditional && !exercise.disabled && (
          <button
            onClick={() => onMakeConditional(exercise)}
            className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Hacer Condicional
          </button>
        )}
        {exercise.conditional && !exercise.disabled && (
          <button
            onClick={() => onRemoveConditional(exercise)}
            className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Quitar Condicional
          </button>
        )}
      </div>
    </div>
  );
}
