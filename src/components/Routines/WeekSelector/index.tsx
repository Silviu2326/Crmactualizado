import React from 'react';
import { Calendar } from 'lucide-react';

interface WeekSelectorProps {
  selectedWeeks: number[];
  onSelectWeek: (week: number) => void;
  maxWeeks?: number;
}

export function WeekSelector({ 
  selectedWeeks, 
  onSelectWeek, 
  maxWeeks = 12 
}: WeekSelectorProps) {
  const weeks = Array.from({ length: maxWeeks }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center gap-3 mb-8">
        <Calendar className="h-8 w-8 text-indigo-600" />
        <h2 className="text-2xl font-bold text-indigo-700">
          Seleccionar Períodos
        </h2>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {weeks.map((week) => {
          const isSelected = selectedWeeks.includes(week);
          return (
            <button
              key={week}
              onClick={() => onSelectWeek(week)}
              className={`
                p-4 rounded-lg border-2 transition-all text-center
                ${isSelected 
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                  : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
                }
              `}
            >
              <span className="block text-lg font-semibold">
                {week}
              </span>
              <span className="text-sm text-gray-500">
                Semana
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-blue-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium">
            Selecciona las semanas que deseas incluir en la rutina
          </p>
        </div>
      </div>
    </div>
  );
}
