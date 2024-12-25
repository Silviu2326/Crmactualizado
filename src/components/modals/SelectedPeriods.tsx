import React from 'react';
import { Period } from '../../types/planning';

interface SelectedPeriodsProps {
  period: Period;
  onPeriodChange: (updatedPeriod: Period) => void;
  onDelete: () => void;
  onAddExercise: () => void;
}

export const SelectedPeriods: React.FC<SelectedPeriodsProps> = ({
  period,
  onPeriodChange,
  onDelete,
  onAddExercise
}) => {
  if (!period) {
    return null;
  }

  const formatDateRange = (start: number, end: number) => {
    const startWeek = Math.ceil(start / 7);
    const startDay = start % 7 === 0 ? 7 : start % 7;
    const endWeek = Math.ceil(end / 7);
    const endDay = end % 7 === 0 ? 7 : end % 7;

    return `Semana ${startWeek} (día ${startDay}) - Semana ${endWeek} (día ${endDay})`;
  };

  return (
    <div className="mt-4 bg-blue-50 p-4 rounded-lg">
      <div className="flex flex-col bg-white p-2 rounded">
        <div className="flex items-center justify-between mb-2">
          <input
            type="text"
            value={period.name || ''}
            onChange={(e) => onPeriodChange({ ...period, name: e.target.value })}
            placeholder="Nombre del período"
            className="text-sm text-gray-700 border rounded px-2 py-1 flex-grow mr-2"
          />
          <div className="flex gap-2">
            <button
              className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded"
              onClick={onAddExercise}
            >
              + Ejercicio
            </button>
            <button 
              className="text-red-400 hover:text-red-600 px-2 py-1 rounded"
              onClick={onDelete}
            >
              Eliminar
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          {formatDateRange(period.start, period.end)}
        </div>
        {period.exercises && period.exercises.length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-medium text-gray-700">Ejercicios:</h4>
            <ul className="mt-1 space-y-1">
              {period.exercises.map((exercise, index) => (
                <li key={exercise._id || index} className="text-sm text-gray-600">
                  {exercise.nombre}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedPeriods;
