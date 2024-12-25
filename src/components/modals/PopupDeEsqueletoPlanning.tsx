import React, { useState, useEffect } from 'react';
import { X, Plus, ChevronDown, ChevronUp, Edit2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import Button from '../Common/Button';
import SelectedPeriods from './SelectedPeriods';
import PeriodosPlantilla from './periodosplantilla';
import { Dumbbell } from 'lucide-react';
import EditExercisePopup from './EditExercisePopup';
import PeriodosCreados from './PeriodosCreados';

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

interface Set {
  repeticiones: number;
  descanso: number;
}

interface Exercise {
  _id: string;
  nombre: string;
  grupoMuscular: string[];
  descripcion: string;
  equipo: string[];
}

interface PeriodExercise extends Exercise {
  isExpanded?: boolean;
  isEditing?: boolean;
  rm?: number;
  relativeWeight?: number;
  sets?: Set[];
}

interface Period extends WeekRange {
  exercises: PeriodExercise[];
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
  selectedWeeks: Period[];
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

interface PopupDeEsqueletoPlanningProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any, shouldClose?: boolean) => void;
  numberOfWeeks: number;
  plan?: any[];
}

const PopupDeEsqueletoPlanning: React.FC<PopupDeEsqueletoPlanningProps> = ({
  isOpen,
  onClose,
  onSubmit,
  numberOfWeeks,
  plan = [],
}) => {
  const [formData, setFormData] = useState({});
  const [selectedWeeks, setSelectedWeeks] = useState<Period[]>([]);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [showPeriodosPlantilla, setShowPeriodosPlantilla] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingExercise, setEditingExercise] = useState<{
    periodIndex: number;
    exerciseId: string;
  } | null>(null);
  const [periodosGuardados, setPeriodosGuardados] = useState<Period[]>([]);
  const [mostrarPeriodosCreados, setMostrarPeriodosCreados] = useState(false);
  const [etapa, setEtapa] = useState<'seleccion' | 'revision'>('seleccion');

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/exercises');
        const data = await response.json();
        setExercises(data.data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
      setLoading(false);
    };

    if (showPeriodosPlantilla) {
      fetchExercises();
    }
  }, [showPeriodosPlantilla]);

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
      setSelectedWeeks(prev => [...prev, { start, end, name: `Período ${prev.length + 1}`, exercises: [] }]);
      setSelectionStart(null);
      setHoveredWeek(null);
    }
  };

  const getPreviewRange = (): WeekRange | null => {
    if (selectionStart === null || hoveredWeek === null) return null;
    return {
      start: Math.min(selectionStart, hoveredWeek),
      end: Math.max(selectionStart, hoveredWeek),
      name: `Período ${selectedWeeks.length + 1}`
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold dark:text-white">
            {etapa === 'seleccion' ? 'Crear Esqueleto de Planificación' : 'Revisar Periodos Creados'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-6 h-6 dark:text-white" />
          </button>
        </div>

        {etapa === 'seleccion' ? (
          <>
            <div className="mb-6">
              {!showPeriodosPlantilla ? (
                <WeekGrid
                  weekDays={getWeekDays(numberOfWeeks)}
                  selectedWeeks={selectedWeeks}
                  onWeekSelect={handleWeekSelect}
                  selectionStart={selectionStart}
                  hoveredWeek={hoveredWeek}
                  onHover={setHoveredWeek}
                  getPreviewRange={getPreviewRange}
                />
              ) : (
                <PeriodosPlantilla
                  selectedWeeks={selectedWeeks}
                  setSelectedWeeks={setSelectedWeeks}
                  selectionStart={selectionStart}
                  setSelectionStart={setSelectionStart}
                  hoveredWeek={hoveredWeek}
                  setHoveredWeek={setHoveredWeek}
                  plan={plan}
                />
              )}
            </div>

            <div className="space-y-4">
              {selectedWeeks.map((period, index) => (
                <SelectedPeriods
                  key={index}
                  period={period}
                  onPeriodChange={(updatedPeriod) => {
                    const newSelectedWeeks = [...selectedWeeks];
                    newSelectedWeeks[index] = updatedPeriod;
                    setSelectedWeeks(newSelectedWeeks);
                  }}
                  onDelete={() => {
                    const newSelectedWeeks = selectedWeeks.filter((_, i) => i !== index);
                    setSelectedWeeks(newSelectedWeeks);
                  }}
                  onAddExercise={() => {
                    setEditingExercise({ periodIndex: index, exerciseId: '' });
                  }}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button onClick={onClose} variant="secondary">
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  setPeriodosGuardados(selectedWeeks);
                  setMostrarPeriodosCreados(true);
                  onSubmit(selectedWeeks, false); // Pasamos false para que no cierre el popup
                  setEtapa('revision');
                }} 
                variant="primary"
                disabled={selectedWeeks.length === 0}
              >
                Guardar Esqueleto
              </Button>
            </div>
          </>
        ) : (
          <>
            <PeriodosCreados 
              periodos={periodosGuardados}
              planificacion={plan}
            />
            
            <div className="mt-6 flex justify-end space-x-4">
              <Button 
                onClick={() => setEtapa('seleccion')} 
                variant="secondary"
              >
                Volver
              </Button>
              <Button 
                onClick={() => {
                  console.log('Avanzando a la siguiente etapa con periodos:', periodosGuardados);
                  onSubmit(periodosGuardados, true); // Pasamos true para cerrar el popup
                  onClose();
                }} 
                variant="primary"
              >
                Siguiente Etapa
              </Button>
            </div>
          </>
        )}

        {editingExercise && (
          <EditExercisePopup
            isOpen={true}
            onClose={() => setEditingExercise(null)}
            onSubmit={(exercise) => {
              if (editingExercise) {
                const newSelectedWeeks = [...selectedWeeks];
                newSelectedWeeks[editingExercise.periodIndex].exercises.push(exercise);
                setSelectedWeeks(newSelectedWeeks);
                setEditingExercise(null);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PopupDeEsqueletoPlanning;
