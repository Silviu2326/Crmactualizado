import React from 'react';

interface RangeInputProps {
  label: string;
  min: number;
  max: number;
  defaultMin: number;
  defaultMax: number;
  unit: string;
}

export function RangeInput({ label, min, max, defaultMin, defaultMax, unit }: RangeInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Mínimo</label>
          <div className="relative">
            <input
              type="number"
              min={min}
              max={max}
              defaultValue={defaultMin}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">{unit}</span>
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Máximo</label>
          <div className="relative">
            <input
              type="number"
              min={min}
              max={max}
              defaultValue={defaultMax}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
