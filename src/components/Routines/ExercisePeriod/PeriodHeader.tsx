import React from 'react';

interface PeriodHeaderProps {
  title: string;
  description?: string;
}

export function PeriodHeader({ title, description }: PeriodHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-1">{title}</h2>
      {description && (
        <p className="text-gray-600">{description}</p>
      )}
    </div>
  );
}
