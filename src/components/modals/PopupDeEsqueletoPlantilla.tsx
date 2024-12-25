import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import clsx from 'clsx';
import Button from '../Common/Button';
import SelectedPeriods from './SelectedPeriods';

interface Day {
  id: string;
  dayNumber: number;
}

interface Week {
  weekNumber: number;
  days: Day[];
}

interface WeekRange {
  start: number;
  end: number;
  name: string;
}

function WeekGrid({ 
  weekDays, 
  selectedWeeks, 
  onWeekSelect, 
  selectionStart,
  hoveredWeek,
  onHover,
  getPreviewRange 
}: {
  weekDays: Week[];
  selectedWeeks: WeekRange[];
  onWeekSelect: (weekNumber: number) => void;
  selectionStart: number | null;
  hoveredWeek: number | null;
  onHover: (weekNumber: number | null) => void;
  getPreviewRange: () => WeekRange | null;
}) {
  const isNumberSelected = (number: number) => {
    return selectedWeeks.some(range => 
      number >= range.start && number <= range.end
    );
  };

  const isNumberInPreview = (number: number) => {
    if (!selectionStart || !hoveredWeek) return false;
    const previewRange = getPreviewRange();
    if (!previewRange) return false;
    return number >= previewRange.start && number <= previewRange.end;
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-3 text-left bg-gray-50 border">Semana</th>
            <th className="p-3 text-center bg-gray-50 border">Día 1</th>
            <th className="p-3 text-center bg-gray-50 border">Día 2</th>
            <th className="p-3 text-center bg-gray-50 border">Día 3</th>
            <th className="p-3 text-center bg-gray-50 border">Día 4</th>
            <th className="p-3 text-center bg-gray-50 border">Día 5</th>
            <th className="p-3 text-center bg-gray-50 border">Día 6</th>
            <th className="p-3 text-center bg-gray-50 border">Día 7</th>
          </tr>
        </thead>
        <tbody>
          {weekDays.map((week) => (
            <tr key={week.weekNumber}>
              <td className="p-3 border bg-gray-50 whitespace-nowrap">
                Semana {week.weekNumber}
              </td>
              {week.days.map((day) => (
                <td 
                  key={day.id}
                  className="p-1 border text-center"
                >
                  <button
                    className={clsx(
                      "w-full p-2 rounded transition-all duration-200",
                      isNumberSelected(day.dayNumber) && "bg-green-500 text-white",
                      isNumberInPreview(day.dayNumber) && !isNumberSelected(day.dayNumber) && "bg-green-200",
                      !isNumberSelected(day.dayNumber) && !isNumberInPreview(day.dayNumber) && "hover:bg-gray-100"
                    )}
                    onClick={() => onWeekSelect(day.dayNumber)}
                    onMouseEnter={() => onHover(day.dayNumber)}
                    onMouseLeave={() => onHover(null)}
                  >
                    {day.dayNumber}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface PopupDeEsqueletoPlantillaProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const PopupDeEsqueletoPlantilla: React.FC<PopupDeEsqueletoPlantillaProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'musculacion',
  });

  const [selectedWeeks, setSelectedWeeks] = useState<WeekRange[]>([]);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);

  const getWeekDays = (numberOfWeeks: number): Week[] => {
    const weeks: Week[] = [];
    let dayCounter = 1;
    
    for (let weekNum = 1; weekNum <= numberOfWeeks; weekNum++) {
      const days: Day[] = [];
      for (let dayNum = 1; dayNum <= 7; dayNum++) {
        days.push({
          id: `week${weekNum}-day${dayNum}`,
          dayNumber: dayCounter++
        });
      }
      weeks.push({
        weekNumber: weekNum,
        days
      });
    }
    
    return weeks;
  };

  const handleWeekSelect = (weekNumber: number) => {
    if (selectionStart === null) {
      setSelectionStart(weekNumber);
    } else {
      const start = Math.min(selectionStart, weekNumber);
      const end = Math.max(selectionStart, weekNumber);
      
      setSelectedWeeks(prev => [
        ...prev,
        { 
          start, 
          end, 
          name: `Período ${prev.length + 1}` 
        }
      ]);
      
      setSelectionStart(null);
      setHoveredWeek(null);
    }
  };

  const getPreviewRange = () => {
    if (!selectionStart || !hoveredWeek) return null;
    const start = Math.min(selectionStart, hoveredWeek);
    const end = Math.max(selectionStart, hoveredWeek);
    return { start, end, name: '' };
  };

  const handleRemovePeriod = (index: number) => {
    setSelectedWeeks(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdatePeriodName = (index: number, name: string) => {
    setSelectedWeeks(prev => 
      prev.map((range, i) => 
        i === index ? { ...range, name } : range
      )
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      totalWeeks: 4,
      selectedPeriods: selectedWeeks
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Crear Nueva Plantilla</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Plantilla
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Entrenamiento
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="musculacion">Musculación</option>
                <option value="cardio">Cardio</option>
                <option value="flexibilidad">Flexibilidad</option>
                <option value="hiit">HIIT</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Selecciona los períodos de la plantilla (4 semanas)
            </h3>
            <WeekGrid
              weekDays={getWeekDays(4)}
              selectedWeeks={selectedWeeks}
              onWeekSelect={handleWeekSelect}
              selectionStart={selectionStart}
              hoveredWeek={hoveredWeek}
              onHover={setHoveredWeek}
              getPreviewRange={getPreviewRange}
            />
          </div>

          {selectedWeeks.length > 0 && (
            <SelectedPeriods
              selectedWeeks={selectedWeeks}
              onRemovePeriod={handleRemovePeriod}
              onUpdatePeriodName={handleUpdatePeriodName}
            />
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="secondary"
              onClick={onClose}
              type="button"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
            >
              Crear Plantilla
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupDeEsqueletoPlantilla;
