import React, { useEffect, useState } from 'react';
import { Period } from '../../types/planning';
import { ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
import EditExercisePopup from './EditExercisePopup';
import VariantesEjerciciosPeriodos from './VariantesEjerciciosPeriodos';
import axios from 'axios';

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
  variant?: {
    type: string;
    percentage?: number;
    initialWeight?: number;
    remainingWeight?: number;
    incrementType?: 'porcentaje' | 'peso_fijo' | null;
    incrementValue?: number;
  };
  periodId?: number;
}

interface Exercise {
  _id: string;
  nombre: string;
  tipo?: string;
  grupoMuscular: string[];
  descripcion: string;
  equipo: string[];
  imgUrl?: string;
  fechaCreacion?: string;
  sets: {
    _id: string;
    reps: number;
    weight: number;
    rest: number;
    tempo?: string;
    rir?: number;
    rpe?: number;
    completed?: boolean;
    round?: number;
  }[];
}

interface Session {
  _id: string;
  exercises: Exercise[];
}

interface PeriodosCreadosProps {
  periodos: Period[];
  planificacion: any[];
  onEditExercise?: (exerciseId: string, periodIndex: number, updates: { rm?: number; relativeWeight?: number }) => void;
  isOpen: boolean;
  onClose: () => void;
  planningId: string;
  weekNumber: number;
  selectedDay: string;
  sessionId: string;
}

const PeriodosCreados: React.FC<PeriodosCreadosProps> = ({ 
  periodos, 
  planificacion,
  onEditExercise,
  isOpen,
  onClose,
  planningId,
  weekNumber,
  selectedDay,
  sessionId
}) => {
  const [expandedExercises, setExpandedExercises] = useState<{ [key: string]: boolean }>({});
  const [editingExercise, setEditingExercise] = useState<{
    exercise: ExerciseDetails;
    periodIndex: number;
  } | null>(null);
  const [showingVariants, setShowingVariants] = useState<{
    exerciseId: string;
    exerciseName: string;
    periodId: number;
  } | null>(null);
  const [exerciseVariants, setExerciseVariants] = useState<{
    [key: string]: { 
      variant: {
        type: string;
        percentage?: number;
        initialWeight?: number;
        remainingWeight?: number;
        incrementType?: 'porcentaje' | 'peso_fijo' | null;
        incrementValue?: number;
      }
    }
  }>({});
  const [exercises, setExercises] = useState<Exercise[]>([]);

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

  const handleVariantSelect = (
    type: string, 
    percentage?: number, 
    initialWeight?: number, 
    remainingWeight?: number, 
    incrementType?: 'porcentaje' | 'peso_fijo' | null, 
    incrementValue?: number
  ) => {
    if (!showingVariants) return;

    const variantKey = `${showingVariants.periodId}-${showingVariants.exerciseId}`;
    
    console.log('Guardando variante para:', variantKey, {
      type,
      percentage,
      initialWeight,
      remainingWeight,
      incrementType,
      incrementValue
    });

    setExerciseVariants(prev => ({
      ...prev,
      [variantKey]: {
        variant: {
          type,
          percentage,
          initialWeight,
          remainingWeight,
          incrementType,
          incrementValue
        }
      }
    }));

    setShowingVariants(null);
  };

  const getDayExercises = (weekNumber: number, dayNumber: number) => {
    const week = planificacion.find(w => w.weekNumber === weekNumber);
    if (!week) return [];

    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const dayName = dayNames[dayNumber - 1];
    
    const day = week.days[dayName];
    if (!day?.sessions || day.sessions.length === 0) return [];

    const exercises = day.sessions.flatMap(session => 
      (session.exercises || []).map(exercise => {
        if (!exercise?.exercise) return null;
        return {
          nombre: exercise.exercise.nombre || '',
          sets: exercise.sets || [],
          _id: exercise._id || '',
          exerciseId: exercise.exercise._id || '',
          rm: exercise.rm,
          relativeWeight: exercise.relativeWeight
        };
      }).filter(Boolean)
    );

    return exercises;
  };

  const groupExercisesByPeriod = (periodId: number, exercises: ExerciseDetails[]) => {
    const exerciseMap = new Map<string, ExerciseDetails>();

    exercises.forEach(exercise => {
      const existingExercise = exerciseMap.get(exercise.exerciseId);
      if (existingExercise) {
        // Combinar las series del mismo ejercicio
        existingExercise.sets = [...existingExercise.sets, ...exercise.sets];
        // Actualizar RM y relativeWeight si existen
        if (exercise.rm) existingExercise.rm = exercise.rm;
        if (exercise.relativeWeight) existingExercise.relativeWeight = exercise.relativeWeight;
      } else {
        // Añadir nuevo ejercicio con el periodId
        exerciseMap.set(exercise.exerciseId, {
          ...exercise,
          sets: [...exercise.sets],
          periodId
        });
      }
    });

    return Array.from(exerciseMap.values());
  };

  const checkPeriodHasExercises = (periodId: number, weekStart: number, dayStart: number, weekEnd: number, dayEnd: number) => {
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

    // Agrupar ejercicios por ID dentro del período
    const groupedExercises = groupExercisesByPeriod(periodId, allExercises);
    
    console.log(`Ejercicios agrupados para período ${periodId}:`, groupedExercises);
    return { hasExercises, exercises: groupedExercises };
  };

  const fetchExercises = async () => {
    try {
      const response = await axios.get(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/plannings/${planningId}/weeks/${weekNumber}/days/${selectedDay}/sessions/${sessionId}`);
      console.log('Response from API:', response.data);
      
      // Extraer los ejercicios de la respuesta
      let exercisesList = [];
      if (response.data && response.data.exercises) {
        // Si la respuesta tiene exercises directamente
        exercisesList = response.data.exercises.map(ex => ({
          _id: ex.exercise._id,
          nombre: ex.exercise.nombre,
          tipo: ex.exercise.tipo,
          grupoMuscular: ex.exercise.grupoMuscular,
          descripcion: ex.exercise.descripcion,
          equipo: ex.exercise.equipo,
          sets: ex.sets
        }));
      } else if (response.data && Array.isArray(response.data)) {
        // Si la respuesta es un array de ejercicios
        exercisesList = response.data;
      }

      console.log('Exercises list:', exercisesList);
      setExercises(exercisesList);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setExercises([]);
    }
  };

  useEffect(() => {
    if (planningId && weekNumber && selectedDay && sessionId) {
      console.log('Fetching exercises with params:', { planningId, weekNumber, selectedDay, sessionId });
      fetchExercises();
    }
  }, [planningId, weekNumber, selectedDay, sessionId]);

  useEffect(() => {
    console.log('Estado actual de ejercicios:', exerciseVariants);
  }, [exerciseVariants]);

  return (
    <div className="p-4">
      {/* Mostrar los ejercicios de la rutina */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Ejercicios de la Rutina</h3>
        {exercises.length > 0 ? (
          <div className="space-y-4">
            {exercises.map((exercise) => (
              <div key={exercise._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{exercise.nombre}</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleExercise(exercise._id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {expandedExercises[exercise._id] ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </div>
                </div>
                {expandedExercises[exercise._id] && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      {exercise.sets?.map((set, index) => (
                        <div key={index} className="border rounded p-2">
                          <p>Serie {index + 1}</p>
                          <p>Reps: {set.reps}</p>
                          <p>Peso: {set.weight}kg</p>
                          <p>Descanso: {set.rest}s</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay ejercicios en esta sesión</p>
        )}
      </div>

      {/* Contenido original del componente */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold mb-4">Periodos Creados</h2>
        <div className="space-y-4">
          {periodos.map((periodo, index) => {
            const weekStart = Math.ceil(periodo.start / 7);
            const dayStart = periodo.start % 7 === 0 ? 7 : periodo.start % 7;
            const weekEnd = Math.ceil(periodo.end / 7);
            const dayEnd = periodo.end % 7 === 0 ? 7 : periodo.end % 7;

            const { hasExercises, exercises: periodExercises } = checkPeriodHasExercises(index, weekStart, dayStart, weekEnd, dayEnd);
            
            console.log('Renderizando ejercicios del periodo:', {
              periodo: periodo.name,
              ejercicios: periodExercises,
              tienenVariantes: periodExercises.some(e => e.variant)
            });

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
                      {periodExercises.map((exercise) => {
                        const variantKey = `${index}-${exercise.exerciseId}`;
                        const exerciseVariant = exerciseVariants[variantKey];
                        
                        // Calcular el total de series únicas
                        const uniqueSets = exercise.sets.reduce((acc, set) => {
                          const setKey = `${set.reps}-${set.weight}-${set.tempo || ''}-${set.rest || ''}-${set.rpe || ''}`;
                          acc.set(setKey, set);
                          return acc;
                        }, new Map());
                        
                        return (
                          <div 
                            key={`${index}-${exercise.exerciseId}`}
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
                                <span className="text-xs text-gray-500">
                                  (Total apariciones: {exercise.sets.length})
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEditExercise(exercise, index)}
                                  className="p-1 hover:bg-blue-100 rounded text-blue-600"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setShowingVariants({ 
                                    exerciseId: exercise.exerciseId,
                                    exerciseName: exercise.nombre,
                                    periodId: index
                                  })}
                                  className="p-1 hover:bg-purple-100 rounded text-purple-600"
                                >
                                  Variants
                                </button>
                              </div>
                            </div>
                            
                            {expandedExercises[exercise.exerciseId] && exercise.sets && (
                              <div className="mt-2 pl-7">
                                <div className="text-xs font-medium text-gray-500 mb-1">
                                  Series totales: {exercise.sets.length}
                                  {exercise.sets.length > 1 && ' (agrupadas por configuración similar)'}
                                </div>
                                {Array.from(uniqueSets.values()).map((set, idx) => (
                                  <div key={idx} className="text-xs text-gray-600 mb-1">
                                    Serie {idx + 1}: {set.reps} reps × {set.weight}kg
                                    {set.tempo && ` • Tempo: ${set.tempo}`}
                                    {set.rest && ` • Descanso: ${set.rest}s`}
                                    {set.rpe && ` • RPE: ${set.rpe}`}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {exerciseVariant && (
                              <div className="mt-1 text-xs text-purple-600">
                                Variante: {exerciseVariant.variant.type}
                                {exerciseVariant.variant.percentage && ` • ${exerciseVariant.variant.percentage}%`}
                                {exerciseVariant.variant.initialWeight && ` • Peso inicial: ${exerciseVariant.variant.initialWeight}kg`}
                                {exerciseVariant.variant.remainingWeight && ` • Peso restante: ${exerciseVariant.variant.remainingWeight}kg`}
                                {exerciseVariant.variant.incrementType && ` • Incremento: ${exerciseVariant.variant.incrementValue}${exerciseVariant.variant.incrementType === 'porcentaje' ? '%' : 'kg'}`}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {editingExercise && (
          <EditExercisePopup
            exercise={editingExercise.exercise}
            onClose={() => setEditingExercise(null)}
            onRMChange={handleRMChange}
            onRelativeWeightChange={handleRelativeWeightChange}
          />
        )}
        
        {showingVariants && (
          <VariantesEjerciciosPeriodos
            isOpen={true}
            onClose={() => setShowingVariants(null)}
            exerciseId={showingVariants.exerciseId}
            exerciseName={showingVariants.exerciseName}
            onSelectVariant={handleVariantSelect}
          />
        )}
      </div>
    </div>
  );
};

export default PeriodosCreados;
