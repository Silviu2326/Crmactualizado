import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface Period {
  startWeek: number;
  startDay: number;
  endWeek: number;
  endDay: number;
  exercises: {
    nombre: string;
    series: string;
    repeticiones: string;
    descanso: string;
  }[];
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
    totalSemanas: 4,
    periodos: [] as Period[]
  });

  const [currentPeriod, setCurrentPeriod] = useState({
    startWeek: 1,
    startDay: 1,
    endWeek: 1,
    endDay: 1
  });

  const handleAddPeriod = () => {
    const newPeriod: Period = {
      ...currentPeriod,
      exercises: [{ nombre: '', series: '', repeticiones: '', descanso: '' }]
    };
    setFormData(prev => ({
      ...prev,
      periodos: [...prev.periodos, newPeriod]
    }));
    setCurrentPeriod({
      startWeek: currentPeriod.endWeek,
      startDay: currentPeriod.endDay,
      endWeek: currentPeriod.endWeek,
      endDay: currentPeriod.endDay + 1
    });
  };

  const handleRemovePeriod = (index: number) => {
    setFormData(prev => ({
      ...prev,
      periodos: prev.periodos.filter((_, i) => i !== index)
    }));
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
    onCrear(formData);
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

      <div>
        <label className="block text-sm font-medium mb-1">Número de Semanas</label>
        <select
          value={formData.totalSemanas}
          onChange={(e) => setFormData(prev => ({ ...prev, totalSemanas: parseInt(e.target.value) }))}
          className={`w-full p-2 rounded border ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600'
              : 'bg-white border-gray-300'
          }`}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
            <option key={num} value={num}>{num} semanas</option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderWeekSelector = () => {
    const weeks = Array.from({ length: formData.totalSemanas }, (_, i) => i + 1);
    const days = Array.from({ length: 7 }, (_, i) => i + 1);

    return (
      <div className="mb-6">
        <div className="grid grid-cols-8 gap-2 mb-4">
          <div className="font-medium">Semana</div>
          {days.map(day => (
            <div key={day} className="font-medium text-center">Día {day}</div>
          ))}
        </div>
        {weeks.map(week => (
          <div key={week} className="grid grid-cols-8 gap-2 mb-2">
            <div className="font-medium">Semana {week}</div>
            {days.map(day => (
              <button
                key={`${week}-${day}`}
                type="button"
                onClick={() => {
                  if (currentPeriod.startWeek === week && currentPeriod.startDay === day) {
                    setCurrentPeriod(prev => ({
                      ...prev,
                      endWeek: week,
                      endDay: day
                    }));
                  } else {
                    setCurrentPeriod(prev => ({
                      ...prev,
                      startWeek: week,
                      startDay: day,
                      endWeek: week,
                      endDay: day
                    }));
                  }
                }}
                className={`p-2 rounded ${
                  (week === currentPeriod.startWeek && day === currentPeriod.startDay) ||
                  (week === currentPeriod.endWeek && day === currentPeriod.endDay) ||
                  (week >= currentPeriod.startWeek && week <= currentPeriod.endWeek &&
                   ((week === currentPeriod.startWeek ? day >= currentPeriod.startDay : true) &&
                    (week === currentPeriod.endWeek ? day <= currentPeriod.endDay : true)))
                    ? 'bg-blue-500 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        ))}
        <div className="mt-4">
          <Button
            variant="create"
            onClick={handleAddPeriod}
            type="button"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Periodo
          </Button>
        </div>
      </div>
    );
  };

  const renderPeriodExercises = (period: Period, index: number) => (
    <div key={index} className={`p-4 rounded-lg mb-4 ${
      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">
          Periodo {index + 1}: Semana {period.startWeek} Día {period.startDay} - 
          Semana {period.endWeek} Día {period.endDay}
        </h3>
        <button
          type="button"
          onClick={() => handleRemovePeriod(index)}
          className="text-red-500 hover:text-red-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {period.exercises.map((ejercicio, ejIndex) => (
        <div key={ejIndex} className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ejercicio</label>
            <input
              type="text"
              value={ejercicio.nombre}
              onChange={(e) => {
                const newPeriodos = [...formData.periodos];
                newPeriodos[index].exercises[ejIndex].nombre = e.target.value;
                setFormData(prev => ({ ...prev, periodos: newPeriodos }));
              }}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-600 border-gray-500'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Series</label>
            <input
              type="text"
              value={ejercicio.series}
              onChange={(e) => {
                const newPeriodos = [...formData.periodos];
                newPeriodos[index].exercises[ejIndex].series = e.target.value;
                setFormData(prev => ({ ...prev, periodos: newPeriodos }));
              }}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-600 border-gray-500'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
        </div>
      ))}
      
      <Button
        variant="secondary"
        onClick={() => {
          const newPeriodos = [...formData.periodos];
          newPeriodos[index].exercises.push({ nombre: '', series: '', repeticiones: '', descanso: '' });
          setFormData(prev => ({ ...prev, periodos: newPeriodos }));
        }}
        type="button"
        className="mt-2"
      >
        <Plus className="w-4 h-4 mr-2" />
        Agregar Ejercicio
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div>
      {renderWeekSelector()}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Periodos de Entrenamiento</h3>
        {formData.periodos.map((period, index) => renderPeriodExercises(period, index))}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className={`w-full max-w-4xl p-6 rounded-lg shadow-xl ${
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

        <form onSubmit={handleSubmit}>
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
