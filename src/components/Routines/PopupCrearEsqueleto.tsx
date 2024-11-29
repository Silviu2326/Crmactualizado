import React, { useState } from 'react'; 
import { motion } from 'framer-motion';
import { X, Plus, ChevronRight, ChevronLeft, Edit2 } from 'lucide-react';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { DateRange, Range } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { addDays, format, eachWeekOfInterval, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

interface Exercise {
  id: string;
  nombre: string;
  series: string;
  repeticiones: string;
  descanso: string;
  isEditing: boolean;
}

interface Day {
  date: Date;
  exercises: Exercise[];
}

interface Period {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  days: Day[];
}

interface PopupCrearEsqueletoProps {
  onClose: () => void;
  onCrear: (esqueleto: any) => void;
}

const PopupCrearEsqueleto: React.FC<PopupCrearEsqueletoProps> = ({ onClose, onCrear }) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'fuerza',
    periodos: [] as Period[]
  });

  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    key: 'selection'
  });

  const handleAddPeriod = () => {
    if (dateRange.startDate && dateRange.endDate) {
      const weeks = eachWeekOfInterval(
        { start: dateRange.startDate, end: dateRange.endDate },
        { locale: es, weekStartsOn: 1 } // Semana empieza el lunes
      );

      const newPeriodos: Period[] = weeks.map((weekStartDate, index) => {
        const weekEndDate = endOfWeek(weekStartDate, { locale: es, weekStartsOn: 1 });
        const days = eachDayOfInterval({
          start: weekStartDate,
          end: weekEndDate > dateRange.endDate ? dateRange.endDate : weekEndDate
        }).map(date => ({
          date,
          exercises: [] as Exercise[]
        }));

        return {
          weekNumber: index + 1,
          startDate: weekStartDate,
          endDate: weekEndDate > dateRange.endDate ? dateRange.endDate : weekEndDate,
          days
        };
      });

      setFormData(prev => ({
        ...prev,
        periodos: newPeriodos
      }));
    }
  };

  const handleAddExercise = (periodIndex: number, dayIndex: number) => {
    const newPeriodos = [...formData.periodos];
    newPeriodos[periodIndex].days[dayIndex].exercises.push({
      id: `exercise_${Date.now()}`,
      nombre: '',
      series: '',
      repeticiones: '',
      descanso: '',
      isEditing: true
    });
    setFormData({ ...formData, periodos: newPeriodos });
  };

  const handleExerciseChange = (periodIndex: number, dayIndex: number, exerciseIndex: number, field: string, value: string) => {
    const newPeriodos = [...formData.periodos];
    newPeriodos[periodIndex].days[dayIndex].exercises[exerciseIndex] = {
      ...newPeriodos[periodIndex].days[dayIndex].exercises[exerciseIndex],
      [field]: value
    };
    setFormData({ ...formData, periodos: newPeriodos });
  };

  const toggleExerciseEdit = (periodIndex: number, dayIndex: number, exerciseIndex: number) => {
    const newPeriodos = [...formData.periodos];
    const exercise = newPeriodos[periodIndex].days[dayIndex].exercises[exerciseIndex];
    exercise.isEditing = !exercise.isEditing;
    setFormData({ ...formData, periodos: newPeriodos });
  };

  const handleNextStep = () => {
    if (currentStep === 1 && formData.nombre && formData.tipo) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 2 && formData.periodos.length > 0) {
      onCrear(formData);
      onClose();
    } else {
      // Mostrar un mensaje de error o feedback al usuario
      alert('Por favor, genera el calendario y agrega ejercicios antes de enviar.');
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre del Esqueleto</label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
          className={`w-full p-2 rounded border ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600'
              : 'bg-white border-gray-300'
          }`}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          value={formData.descripcion}
          onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
          className={`w-full p-2 rounded border ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600'
              : 'bg-white border-gray-300'
          }`}
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tipo de Rutina</label>
        <select
          value={formData.tipo}
          onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
          className={`w-full p-2 rounded border ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600'
              : 'bg-white border-gray-300'
          }`}
        >
          <option value="fuerza">Fuerza</option>
          <option value="hipertrofia">Hipertrofia</option>
          <option value="resistencia">Resistencia</option>
          <option value="cardio">Cardio</option>
        </select>
      </div>
    </div>
  );

  const renderExercise = (exercise: Exercise, periodIndex: number, dayIndex: number, exerciseIndex: number) => (
    <div key={exercise.id} className={`p-4 rounded-lg mb-4 ${
      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
    }`}>
      {exercise.isEditing ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre del Ejercicio</label>
            <input
              type="text"
              value={exercise.nombre}
              onChange={(e) => handleExerciseChange(periodIndex, dayIndex, exerciseIndex, 'nombre', e.target.value)}
              className={`w-full p-2 rounded border ${
                theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Series</label>
            <input
              type="text"
              value={exercise.series}
              onChange={(e) => handleExerciseChange(periodIndex, dayIndex, exerciseIndex, 'series', e.target.value)}
              className={`w-full p-2 rounded border ${
                theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Repeticiones</label>
            <input
              type="text"
              value={exercise.repeticiones}
              onChange={(e) => handleExerciseChange(periodIndex, dayIndex, exerciseIndex, 'repeticiones', e.target.value)}
              className={`w-full p-2 rounded border ${
                theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descanso (seg)</label>
            <input
              type="text"
              value={exercise.descanso}
              onChange={(e) => handleExerciseChange(periodIndex, dayIndex, exerciseIndex, 'descanso', e.target.value)}
              className={`w-full p-2 rounded border ${
                theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          <div className="col-span-2 flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => toggleExerciseEdit(periodIndex, dayIndex, exerciseIndex)}
              type="button"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={() => toggleExerciseEdit(periodIndex, dayIndex, exerciseIndex)}
              type="button"
            >
              Guardar
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium">{exercise.nombre}</h4>
            <p className="text-sm text-gray-500">
              {exercise.series} series × {exercise.repeticiones} reps | Descanso: {exercise.descanso}s
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => toggleExerciseEdit(periodIndex, dayIndex, exerciseIndex)}
            type="button"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );

  const renderDayCell = (periodIndex: number, dayIndex: number) => {
    const day = formData.periodos[periodIndex].days[dayIndex];
    return (
      <td key={dayIndex} className="border px-2 py-2 align-top">
        <div className="text-sm mb-2 font-medium">
          {day ? format(day.date, 'dd/MM/yyyy') : ''}
        </div>
        {day ? (
          <div className="space-y-2">
            {day.exercises.map((exercise, exerciseIndex) =>
              renderExercise(exercise, periodIndex, dayIndex, exerciseIndex)
            )}
            <Button
              variant="secondary"
              onClick={() => handleAddExercise(periodIndex, dayIndex)}
              type="button"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Ejercicio
            </Button>
          </div>
        ) : null}
      </td>
    );
  };

  const renderPeriod = (period: Period, index: number) => (
    <tr key={period.weekNumber} className="border">
      <td className="border px-2 py-2 font-medium align-top">
        Semana {period.weekNumber}<br/>
        {format(period.startDate, 'dd/MM/yyyy')} - {format(period.endDate, 'dd/MM/yyyy')}
      </td>
      {Array.from({ length: 7 }).map((_, dayIndex) => renderDayCell(index, dayIndex))}
    </tr>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
        <h3 className="text-lg font-medium mb-4">Seleccionar Período</h3>
        <DateRange
          ranges={[dateRange]}
          onChange={item => setDateRange(item.selection)}
          months={2}
          direction="horizontal"
          locale={es}
          minDate={new Date()}
          className={theme === 'dark' ? 'dark-theme' : ''}
        />
        <Button
          variant="create"
          onClick={handleAddPeriod}
          type="button"
          className="mt-4 w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Generar Calendario
        </Button>
      </div>

      {formData.periodos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Periodos de Entrenamiento</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-2">Semana</th>
                  <th className="border px-2 py-2">Lunes</th>
                  <th className="border px-2 py-2">Martes</th>
                  <th className="border px-2 py-2">Miércoles</th>
                  <th className="border px-2 py-2">Jueves</th>
                  <th className="border px-2 py-2">Viernes</th>
                  <th className="border px-2 py-2">Sábado</th>
                  <th className="border px-2 py-2">Domingo</th>
                </tr>
              </thead>
              <tbody>
                {formData.periodos.map((period, index) => renderPeriod(period, index))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-8"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className={`w-full max-w-7xl mx-auto p-6 rounded-lg shadow-xl ${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {currentStep === 1 ? 'Información Básica' : 'Definir Periodos'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 ? renderStep1() : renderStep2()}

          <div className="flex justify-between mt-6">
            {currentStep === 2 && (
              <Button variant="secondary" onClick={handlePrevStep} type="button">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
            )}
            <div className="ml-auto flex space-x-4">
              <Button variant="secondary" onClick={onClose} type="button">
                Cancelar
              </Button>
              {currentStep === 1 ? (
                <Button variant="primary" onClick={handleNextStep} type="button">
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button variant="primary" type="submit">
                  Crear Esqueleto
                </Button>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PopupCrearEsqueleto;
