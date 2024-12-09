import React, { useState } from 'react';
import { PeriodHeader } from './PeriodHeader';
import { SearchBar } from './SearchBar';
import { ExerciseList } from './ExerciseList';
import { Exercise } from './types';

interface ExercisePeriodProps {
  periodId: string;
  exercises: Exercise[];
  onModify: (exercise: Exercise) => void;
  onMakeConditional: (exercise: Exercise) => void;
  onRemoveConditional: (exercise: Exercise) => void;
}

export function ExercisePeriod({
  periodId,
  exercises,
  onModify,
  onMakeConditional,
  onRemoveConditional
}: ExercisePeriodProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-white rounded-lg shadow-lg p-6">
      <PeriodHeader
        title={`Período ${periodId}`}
        description="Selecciona y configura los ejercicios para este período"
      />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
      />

      <ExerciseList
        exercises={filteredExercises}
        onModify={onModify}
        onMakeConditional={onMakeConditional}
        onRemoveConditional={onRemoveConditional}
      />
    </div>
  );
}
