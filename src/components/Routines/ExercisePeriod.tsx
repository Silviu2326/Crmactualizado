import React from 'react';
import { Search } from 'lucide-react';
import clsx from 'clsx';

interface Exercise {
  name: string;
  conditional?: boolean;
  disabled?: boolean;
}

interface Period {
  start: number;
  end: number;
}

interface ExercisePeriodProps {
  period: Period;
  exercises: Exercise[];
  onModify: (exercise: Exercise) => void;
  onMakeConditional: (exercise: Exercise) => void;
  onRemoveConditional: (exercise: Exercise) => void;
}

export function ExercisePeriod({ 
  period, 
  exercises, 
  onModify, 
  onMakeConditional, 
  onRemoveConditional 
}: ExercisePeriodProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center gap-2">
        <span className="text-indigo-600">💪</span>
        {`Semana ${period.start} - Semana ${period.end}`}
      </h3>
      
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Buscar ejercicios..."
          className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-2">
        {exercises.map((exercise) => {
          const isConditional = exercise.conditional;
          const isDisabled = exercise.disabled;
          
          return (
            <div 
              key={exercise.name}
              className={clsx(
                "p-3 rounded-lg flex items-center justify-between",
                isConditional ? "bg-green-100" : "bg-white",
                isDisabled && "bg-red-100"
              )}
            >
              <div className="flex items-center gap-2">
                <span className={clsx(
                  "font-medium",
                  isDisabled ? "text-red-700" : isConditional ? "text-green-700" : "text-indigo-600"
                )}>
                  {exercise.name}
                </span>
                {isConditional && <span className="text-green-700 text-sm">(Sí)</span>}
                {isDisabled && <span className="text-red-700 text-sm">(No)</span>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onModify(exercise)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Modificar
                </button>
                {isConditional ? (
                  <button
                    onClick={() => onRemoveConditional(exercise)}
                    className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Quitar Condicional
                  </button>
                ) : (
                  <button
                    onClick={() => onMakeConditional(exercise)}
                    className={clsx(
                      "px-3 py-1 text-sm rounded-lg transition-colors",
                      isDisabled 
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    )}
                  >
                    {isDisabled ? "Hacer Condicional" : "Quitar Condicional"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
