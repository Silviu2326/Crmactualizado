import React from 'react';

const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Principiante', icon: '🌱' },
  { id: 'intermediate', label: 'Intermedio', icon: '⭐' },
  { id: 'advanced', label: 'Avanzado', icon: '🌟' },
];

interface ExperienceLevelProps {
  value: string;
  onChange: (value: string) => void;
}

export function ExperienceLevel({ value, onChange }: ExperienceLevelProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Nivel de Experiencia
      </label>
      <div className="flex gap-3">
        {EXPERIENCE_LEVELS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`
              flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all
              ${value === id 
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
              }
            `}
          >
            <span className="text-2xl">{icon}</span>
            <span className="font-medium text-sm">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
