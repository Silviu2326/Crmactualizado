import React, { useEffect, useState } from 'react';
import { Period } from '../../types/planning';
import { ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
import EditExercisePopup from './EditExercisePopup';

interface Set {
  reps: number;
  weight: number;
  rest: number;
  tempo?: string;
  rpe?: number;
}

interface ExerciseDetails {
  nombre: string;
  sets: Set[];
  _id: string;
  exerciseId: string;
  rm?: number;
  relativeWeight?: number;
}

interface PeriodosCreadosProps {
  periodos: Period[];
  planificacion: any[];
  onEditExercise?: (exerciseId: string, periodIndex: number, updates: { rm?: number; relativeWeight?: number }) => void;
}

const PeriodosCreados: React.FC<PeriodosCreadosProps> = ({ 
  periodos, 
  planificacion,
  onEditExercise 
}) => {
  const [expandedExercises, setExpandedExercises] = useState<{ [key: string]: boolean }>({});
  const [editingExercise, setEditingExercise] = useState<{
    exercise: ExerciseDetails;
    periodIndex: number;
  } | null>(null);

  const toggleExercise = (exerciseId: string) => {
    setExpandedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  const handleEditExercise = (exercise: ExerciseDetails, periodIndex: number) => {
    setEditingExercise({ exercise, periodIndex });
  };

  const handleRMChange = (value: number) => {
    if (editingExercise && onEditExercise) {
      onEditExercise(editingExercise.exercise.exerciseId, editingExercise.periodIndex, { rm: value });
    }
  };

  const handleRelativeWeightChange = (value: number) => {
    if (editingExercise && onEditExercise) {
      onEditExercise(editingExercise.exercise.exerciseId, editingExercise.periodIndex, { relativeWeight: value });
    }
  };

  const getDayExercises = (weekNumber: number, dayNumber: number) => {
    const week = planificacion.find(w => w.weekNumber === weekNumber);
    if (!week) return [];

    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const dayName = dayNames[dayNumber - 1];
    
    const day = week.days[dayName];
    if (!day?.sessions || day.sessions.length === 0) return [];

    const exercises = day.sessions.flatMap(session => 
      session.exercises.map(exercise => ({
        nombre: exercise.exercise.nombre,
        sets: exercise.sets || [],
        _id: exercise._id,
        exerciseId: exercise.exercise._id,
        rm: exercise.rm,
        relativeWeight: exercise.relativeWeight
      }))
    );

    return exercises;
  };

  const groupExercises = (exercises: ExerciseDetails[]) => {
    const exerciseMap = new Map<string, ExerciseDetails>();

    exercises.forEach(exercise => {
      const existingExercise = exerciseMap.get(exercise.exerciseId);
      if (existingExercise) {
        existingExercise.sets = [...existingExercise.sets, ...exercise.sets];
        // Mantener los valores de rm y relativeWeight si existen
        if (exercise.rm) existingExercise.rm = exercise.rm;
        if (exercise.relativeWeight) existingExercise.relativeWeight = exercise.relativeWeight;
      } else {
        exerciseMap.set(exercise.exerciseId, {
          ...exercise,
          sets: [...exercise.sets]
        });
      }
    });

    return Array.from(exerciseMap.values());
  };

  const checkPeriodHasExercises = (weekStart: number, dayStart: number, weekEnd: number, dayEnd: number) => {
    let hasExercises = false;
    const allExercises: ExerciseDetails[] = [];

    for (let w = weekStart; w <= weekEnd; w++) {
      const startDay = w === weekStart ? dayStart : 1;
      const endDay = w === weekEnd ? dayEnd : 7;
      
      for (let d = startDay; d <= endDay; d++) {
        const dayExercises = getDayExercises(w, d);
        if (dayExercises.length > 0) {
          hasExercises = true;
          allExercises.push(...dayExercises);
        }
      }
    }

    const groupedExercises = groupExercises(allExercises);
    return { hasExercises, exercises: groupedExercises };
  };

  useEffect(() => {
    console.log('Periodos recibidos:', periodos);
    console.log('Planificación recibida:', planificacion);
  }, [periodos, planificacion]);

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Periodos Creados</h2>
      <div className="space-y-4">
        {periodos.map((periodo, index) => {
          const weekStart = Math.ceil(periodo.start / 7);
          const dayStart = periodo.start % 7 === 0 ? 7 : periodo.start % 7;
          const weekEnd = Math.ceil(periodo.end / 7);
          const dayEnd = periodo.end % 7 === 0 ? 7 : periodo.end % 7;

          const { hasExercises, exercises } = checkPeriodHasExercises(weekStart, dayStart, weekEnd, dayEnd);

          return (
            <div key={index} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{periodo.name}</h3>
                  <p className="text-sm text-gray-600">
                    Semana {weekStart} día {dayStart} - Semana {weekEnd} día {dayEnd}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded text-sm ${hasExercises ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {hasExercises ? 'Con ejercicios' : 'Sin ejercicios'}
                </div>
              </div>
              
              {hasExercises && (
                <div className="mt-3">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Ejercicios encontrados:</h4>
                  <div className="space-y-2">
                    {exercises.map((exercise) => (
                      <div 
                        key={exercise.exerciseId} 
                        className="border rounded-lg p-2 bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleExercise(exercise.exerciseId)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              {expandedExercises[exercise.exerciseId] ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                            <span className="text-sm font-medium">{exercise.nombre}</span>
                            {exercise.rm && (
                              <span className="text-xs text-gray-500">
                                (RM: {exercise.rm}kg)
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleEditExercise(exercise, index)}
                            className="p-1 hover:bg-blue-100 rounded text-blue-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {expandedExercises[exercise.exerciseId] && exercise.sets && (
                          <div className="mt-2 pl-7">
                            <div className="text-xs font-medium text-gray-500 mb-1">
                              Series totales: {exercise.sets.length}
                            </div>
                            {exercise.sets.map((set, idx) => (
                              <div key={idx} className="text-xs text-gray-600 mb-1">
                                Serie {idx + 1}: {set.reps} reps × {set.weight}kg
                                {set.tempo && ` • Tempo: ${set.tempo}`}
                                {set.rest && ` • Descanso: ${set.rest}s`}
                                {set.rpe && ` • RPE: ${set.rpe}`}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editingExercise && (
        <EditExercisePopup
          isOpen={!!editingExercise}
          onClose={() => setEditingExercise(null)}
          exerciseName={editingExercise.exercise.nombre}
          periodIndex={editingExercise.periodIndex}
          rm={editingExercise.exercise.rm}
          relativeWeight={editingExercise.exercise.relativeWeight}
          onRMChange={handleRMChange}
          onRelativeWeightChange={handleRelativeWeightChange}
        />
      )}
    </div>
  );
};

export default PeriodosCreados;
