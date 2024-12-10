import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ClientInfo } from './ClientInfo';
import { WeekSelector } from './WeekSelector';
import { ExercisePeriod } from './ExercisePeriod';
import { NavigationButtons } from './NavigationButtons';

interface WeekRange {
  start: number;
  end: number;
}

interface Exercise {
  id: string;
  name: string;
  conditional?: boolean;
  disabled?: boolean;
}

interface PopupCrearEsqueletoProps {
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

const PopupCrearEsqueleto: React.FC<PopupCrearEsqueletoProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [selectedWeeks, setSelectedWeeks] = useState<WeekRange[]>([]);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);

  // Ejemplo de ejercicios
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: "1", name: "Press de Banca", conditional: false, disabled: false },
    { id: "2", name: "Sentadillas", conditional: false, disabled: false },
    { id: "3", name: "Peso Muerto", conditional: false, disabled: false },
    { id: "4", name: "Pull-ups", conditional: false, disabled: false },
  ]);

  const handleWeekSelect = (weekNumber: number) => {
    if (!selectionStart) {
      setSelectionStart(weekNumber);
    } else {
      const start = Math.min(selectionStart, weekNumber);
      const end = Math.max(selectionStart, weekNumber);
      
      // Verificar si el rango se superpone con alguno existente
      const overlaps = selectedWeeks.some(range => 
        (start <= range.end && end >= range.start)
      );

      if (!overlaps) {
        setSelectedWeeks([...selectedWeeks, { start, end }]);
      }
      
      setSelectionStart(null);
    }
  };

  const getPreviewRange = () => {
    if (!selectionStart || !hoveredWeek) return null;
    return {
      start: Math.min(selectionStart, hoveredWeek),
      end: Math.max(selectionStart, hoveredWeek)
    };
  };

  const handleRemovePeriod = (index: number) => {
    setSelectedWeeks(selectedWeeks.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (step === 3 && onSubmit) {
      // Aquí puedes preparar los datos para enviar
      onSubmit({
        selectedWeeks,
        exercises
      });
      onClose();
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  const handleModifyExercise = (exercise: Exercise) => {
    // Implementar lógica de modificación
    console.log('Modificar ejercicio:', exercise);
  };

  const handleMakeConditional = (exercise: Exercise) => {
    setExercises(exercises.map(e => 
      e.id === exercise.id 
        ? { ...e, conditional: true, disabled: false }
        : e
    ));
  };

  const handleRemoveConditional = (exercise: Exercise) => {
    setExercises(exercises.map(e => 
      e.id === exercise.id 
        ? { ...e, conditional: false, disabled: true }
        : e
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-100 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Crear Esqueleto de Rutina
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {step === 1 && (
            <WeekSelector
              selectedWeeks={selectedWeeks}
              onWeekSelect={handleWeekSelect}
              onNext={handleNext}
              selectionStart={selectionStart}
              hoveredWeek={hoveredWeek}
              setHoveredWeek={setHoveredWeek}
              onRemovePeriod={handleRemovePeriod}
              getPreviewRange={getPreviewRange}
            />
          )}

          {step === 2 && selectedWeeks.map((period, index) => (
            <ExercisePeriod
              key={index}
              period={period}
              exercises={exercises}
              onModify={handleModifyExercise}
              onMakeConditional={handleMakeConditional}
              onRemoveConditional={handleRemoveConditional}
            />
          ))}

          {step === 3 && (
            <ClientInfo onSubmit={handleNext} />
          )}

          {step !== 1 && (
            <NavigationButtons
              onBack={handleBack}
              onNext={handleNext}
              nextLabel={step === 3 ? "Finalizar" : "Siguiente"}
              showNext={true}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PopupCrearEsqueleto;