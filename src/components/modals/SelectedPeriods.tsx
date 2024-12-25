import React from 'react';

interface WeekRange {
  start: number;
  end: number;
  name: string;
}

interface SelectedPeriodsProps {
  selectedWeeks: WeekRange[];
  onRemovePeriod: (index: number) => void;
  onUpdatePeriodName: (index: number, name: string) => void;
}

export const SelectedPeriods: React.FC<SelectedPeriodsProps> = ({ 
  selectedWeeks, 
  onRemovePeriod,
  onUpdatePeriodName 
}) => {
  const formatDateRange = (start: number, end: number) => {
    const startWeek = Math.ceil(start / 7);
    const startDay = start % 7 === 0 ? 7 : start % 7;
    const endWeek = Math.ceil(end / 7);
    const endDay = end % 7 === 0 ? 7 : end % 7;

    return `Semana ${startWeek} (día ${startDay}) - Semana ${endWeek} (día ${endDay})`;
  };

  return (
    <div className="mt-4 bg-blue-50 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Períodos seleccionados:
      </h3>
      <div className="space-y-2">
        {selectedWeeks.map((range, index) => (
          <div 
            key={index}
            className="flex flex-col bg-white p-2 rounded"
          >
            <div className="flex items-center justify-between mb-2">
              <input
                type="text"
                value={range.name}
                onChange={(e) => onUpdatePeriodName(index, e.target.value)}
                placeholder="Nombre del período"
                className="text-sm text-gray-700 border rounded px-2 py-1 flex-grow mr-2"
              />
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => onRemovePeriod(index)}
              >
                ×
              </button>
            </div>
            <span className="text-sm text-gray-500">
              {formatDateRange(range.start, range.end)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedPeriods;
