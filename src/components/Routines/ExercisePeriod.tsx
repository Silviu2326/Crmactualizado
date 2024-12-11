import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import clsx from 'clsx';

interface Exercise {
  _id: string;
  nombre: string;
  grupoMuscular: string[];
  descripcion: string;
  equipo: string[];
  fechaCreacion: string;
  conditional?: boolean;
  disabled?: boolean;
}

interface Period {
  start: number;
  end: number;
}

interface ExercisePeriodProps {
  period: Period;
  onModify: (exercise: Exercise) => void;
  onMakeConditional: (exercise: Exercise) => void;
  onRemoveConditional: (exercise: Exercise) => void;
}

export function ExercisePeriod({ 
  period, 
  onModify, 
  onMakeConditional, 
  onRemoveConditional 
}: ExercisePeriodProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDateRange = (start: number, end: number) => {
    const startWeek = Math.ceil(start / 7);
    const startDay = start % 7 === 0 ? 7 : start % 7;
    const endWeek = Math.ceil(end / 7);
    const endDay = end % 7 === 0 ? 7 : end % 7;
    return `Semana ${startWeek} (día ${startDay}) - Semana ${endWeek} (día ${endDay})`;
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/exercises', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los ejercicios');
        }

        const data = await response.json();
        setExercises(data.data.map((exercise: Exercise) => ({
          ...exercise,
          conditional: false,
          disabled: false
        })));
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const filteredExercises = exercises.filter(exercise =>
    exercise.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.grupoMuscular.some(grupo => 
      grupo.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return <div className="bg-white rounded-lg shadow-lg p-6">Cargando ejercicios...</div>;
  }

  if (error) {
    return <div className="bg-white rounded-lg shadow-lg p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center gap-2">
        <span className="text-indigo-600">💪</span>
        {formatDateRange(period.start, period.end)}
      </h3>
      
      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar ejercicios..."
          className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-2">
        {filteredExercises.map((exercise) => {
          const isConditional = exercise.conditional;
          const isDisabled = exercise.disabled;
          
          return (
            <div 
              key={exercise._id}
              className={clsx(
                "p-3 rounded-lg flex items-center justify-between",
                isConditional ? "bg-green-100" : "bg-white",
                isDisabled && "bg-red-100"
              )}
            >
              <div className="flex flex-col">
                <span className={clsx(
                  "font-medium",
                  isDisabled ? "text-red-700" : isConditional ? "text-green-700" : "text-indigo-600"
                )}>
                  {exercise.nombre}
                </span>
                <span className="text-sm text-gray-500">
                  {exercise.grupoMuscular.join(', ')}
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
                    {isDisabled ? "Hacer Condicional" : "Hacer Condicional"}
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