import React from 'react';
import { ExerciseItem } from './ExerciseItem';
import { Exercise } from './types';

interface ExerciseListProps {
  exercises: Exercise[];
  onModify: (exercise: Exercise) => void;
  onMakeConditional: (exercise: Exercise) => void;
  onRemoveConditional: (exercise: Exercise) => void;
}

export function ExerciseList({
  exercises,
  onModify,
  onMakeConditional,
  onRemoveConditional
}: ExerciseListProps) {
  if (exercises.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay ejercicios para mostrar</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {exercises.map((exercise) => (
        <ExerciseItem
          key={exercise.id}
          exercise={exercise}
          onModify={onModify}
          onMakeConditional={onMakeConditional}
          onRemoveConditional={onRemoveConditional}
        />
      ))}
    </div>
  );
}
