import React, { useState } from 'react';
import { RangeInput } from './RangeInput';
import { ObjectiveSelect } from './ObjectiveSelect';
import { ExperienceLevel } from './ExperienceLevel';

interface ClientInfoProps {
  onSubmit: () => void;
}

export function ClientInfo({ onSubmit }: ClientInfoProps) {
  const [objective, setObjective] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">👤</span>
        <h2 className="text-2xl font-bold text-indigo-700">
          Información del Cliente
        </h2>
      </div>

      <div className="space-y-8">
        <RangeInput
          label="Rango de Altura"
          min={150}
          max={220}
          defaultMin={150}
          defaultMax={200}
          unit="cm"
        />

        <RangeInput
          label="Rango de Peso"
          min={40}
          max={150}
          defaultMin={50}
          defaultMax={100}
          unit="kg"
        />

        <ObjectiveSelect
          value={objective}
          onChange={setObjective}
        />

        <ExperienceLevel
          value={experienceLevel}
          onChange={setExperienceLevel}
        />

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">
              Esta información nos ayudará a generar un programa más personalizado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
