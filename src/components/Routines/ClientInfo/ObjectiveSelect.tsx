import React from 'react';

const OBJECTIVES = [
  { id: 'strength', label: 'Fuerza', icon: '💪' },
  { id: 'hypertrophy', label: 'Hipertrofia', icon: '🏋️‍♂️' },
  { id: 'endurance', label: 'Resistencia', icon: '🏃‍♂️' },
  { id: 'weight-loss', label: 'Pérdida de peso', icon: '⚖️' },
];

interface ObjectiveSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function ObjectiveSelect({ value, onChange }: ObjectiveSelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Objetivo Principal
      </label>
      <div className="grid grid-cols-2 gap-3">
        {OBJECTIVES.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`
              flex items-center gap-2 p-3 rounded-lg border-2 transition-all
              ${value === id 
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
              }
            `}
          >
            <span className="text-xl">{icon}</span>
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
