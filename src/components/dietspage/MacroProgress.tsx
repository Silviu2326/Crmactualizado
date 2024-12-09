import React from 'react';

interface MacroProgressProps {
  label: string;
  current: number;
  target: number;
  unit: string;
}

export default function MacroProgress({ label, current, target, unit }: MacroProgressProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const isOverTarget = current > target;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className={`${isOverTarget ? 'text-red-600' : 'text-gray-600'}`}>
          {Math.round(current)}/{Math.round(target)} {unit}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isOverTarget ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
