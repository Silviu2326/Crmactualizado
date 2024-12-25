import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../Common/Button';

interface EditExercisePopupProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  periodIndex: number;
  rm?: number;
  relativeWeight?: number;
  onRMChange?: (value: number) => void;
  onRelativeWeightChange?: (value: number) => void;
  sets?: Array<{
    weight: number;
    reps: number;
    rest: number;
    _id: string;
  }>;
  onSetsWeightChange?: (weights: number[]) => void;
}

const EditExercisePopup: React.FC<EditExercisePopupProps> = ({
  isOpen,
  onClose,
  exerciseName,
  periodIndex,
  rm,
  relativeWeight,
  onRMChange,
  onRelativeWeightChange,
  sets,
  onSetsWeightChange,
}) => {
  const [localRM, setLocalRM] = useState<string>(rm?.toString() || '');
  const [testRM, setTestRM] = useState<string>('100');
  const [showSetPercentages, setShowSetPercentages] = useState<boolean>(false);
  const [setPercentages, setSetPercentages] = useState<string[]>(sets?.map(() => '') || []);
  
  const handleRMChange = (value: string) => {
    setLocalRM(value);
  };

  const handleTestRMChange = (value: string) => {
    if (value && !isNaN(Number(value))) {
      setTestRM(value);
    }
  };

  const handleSetPercentageChange = (index: number, value: string) => {
    const newPercentages = [...setPercentages];
    newPercentages[index] = value;
    setSetPercentages(newPercentages);
  };

  const applySetPercentages = () => {
    if (sets && onSetsWeightChange) {
      const baseWeight = Number(testRM);
      const weights = setPercentages.map(percentage => {
        const percentValue = Number(percentage) || 0;
        return Math.round((baseWeight * percentValue) / 100);
      });
      onSetsWeightChange(weights);
    }
  };

  if (!isOpen) return null;

  const baseRM = Number(testRM);
  const percentages = [100, 95, 90, 85, 80, 75, 70, 65, 60];

  const calculateWeight = (baseWeight: number, percentage: number) => {
    return Math.round((baseWeight * percentage) / 100);
  };

  // El RM x es el porcentaje que queremos aplicar al RM de prueba
  const percentage = Number(localRM) || 0;
  const calculatedRM = calculateWeight(baseRM, percentage);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[600px] relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold mb-4">Editar Ejercicio: {exerciseName}</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {periodIndex === 0 ? 'RM x (%)' : 'Peso anterior x (%)'}
            </label>
            <input
              type="number"
              value={localRM}
              onChange={(e) => handleRMChange(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={periodIndex === 0 ? "Ingrese porcentaje" : "Ingrese porcentaje del peso anterior"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RM de prueba
            </label>
            <input
              type="number"
              value={testRM}
              onChange={(e) => handleTestRMChange(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="RM de prueba"
            />
          </div>
        </div>

        {sets && sets.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Porcentajes por Set</h3>
              <Button
                onClick={() => setShowSetPercentages(!showSetPercentages)}
                variant="secondary"
              >
                {showSetPercentages ? 'Ocultar porcentajes por set' : 'Mostrar porcentajes por set'}
              </Button>
            </div>
            
            {showSetPercentages && (
              <div className="space-y-4">
                <div className="grid gap-4">
                  {sets.map((set, index) => (
                    <div key={set._id} className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-700">Set {index + 1}</span>
                      <input
                        type="number"
                        value={setPercentages[index]}
                        onChange={(e) => handleSetPercentageChange(index, e.target.value)}
                        className="w-24 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="% del RM"
                      />
                      <span className="text-sm text-gray-500">
                        = {calculateWeight(baseRM, Number(setPercentages[index]) || 0)} kg
                      </span>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={applySetPercentages}
                  className="mt-4"
                >
                  Aplicar porcentajes a los sets
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Tabla de Porcentajes</h3>
          <div className="grid grid-cols-3 gap-4">
            {percentages.map((p) => (
              <div
                key={p}
                className="bg-gray-50 p-3 rounded-lg"
              >
                <div className="text-sm font-medium text-gray-600 mb-1">
                  {p}%
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {calculateWeight(baseRM, p)} kg
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {periodIndex === 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-lg font-medium text-blue-700 text-center uppercase tracking-wide">
                ¡Esto es solo un ejemplo de cómo quedará!
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                {periodIndex === 0 ? `RM Base (${testRM} Kg)` : `Peso Base del Periodo Anterior (${testRM} Kg)`}
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-500">%</th>
                      <th className="text-left text-xs font-medium text-gray-500">Kg</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {percentages.map((p) => (
                      <tr key={p}>
                        <td className="py-1 text-sm text-gray-900">{p}%</td>
                        <td className="py-1 text-sm text-gray-900">{calculateWeight(baseRM, p)} Kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                {periodIndex === 0 
                  ? `Tu RM (${percentage}% = ${calculatedRM} Kg)`
                  : `Tu Peso (${percentage}% = ${calculatedRM} Kg)`}
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-500">%</th>
                      <th className="text-left text-xs font-medium text-gray-500">Kg</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 text-sm text-gray-900">{percentage}%</td>
                      <td className="py-2 text-sm text-gray-900">{calculatedRM} Kg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            {periodIndex === 0 
              ? '* El porcentaje introducido se aplicará al RM de prueba para calcular tu RM'
              : '* El porcentaje introducido se aplicará al peso del periodo anterior para calcular tu nuevo peso'}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Porcentajes por Set</h3>
            <Button
              onClick={() => setShowSetPercentages(!showSetPercentages)}
              variant="secondary"
            >
              {showSetPercentages ? 'Ocultar porcentajes por set' : 'Mostrar porcentajes por set'}
            </Button>
          </div>
          
          {showSetPercentages && sets && sets.length > 0 && (
            <div className="space-y-4">
              <div className="grid gap-4">
                {sets.map((set, index) => (
                  <div key={set._id} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Set {index + 1}</span>
                    <input
                      type="number"
                      value={setPercentages[index]}
                      onChange={(e) => handleSetPercentageChange(index, e.target.value)}
                      className="w-24 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="% del RM"
                    />
                    <span className="text-sm text-gray-500">
                      = {calculateWeight(baseRM, Number(setPercentages[index]) || 0)} kg
                    </span>
                  </div>
                ))}
              </div>
              <Button
                onClick={applySetPercentages}
                className="mt-4"
              >
                Aplicar porcentajes a los sets
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {periodIndex > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Peso relativo al periodo 1
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={relativeWeight || 100}
                  onChange={(e) => onRelativeWeightChange?.(parseInt(e.target.value))}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="%"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
              {rm && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Peso calculado para este periodo
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left text-xs font-medium text-gray-500">% del RM</th>
                          <th className="text-left text-xs font-medium text-gray-500">Kg</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-2 text-sm text-gray-900">{relativeWeight}%</td>
                          <td className="py-2 text-sm text-gray-900">
                            {calculateWeight(rm, relativeWeight || 100)} Kg
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            onClick={onClose}
            variant="secondary"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (calculatedRM) {
                onRMChange?.(calculatedRM);
              }
              onClose();
            }}
          >
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditExercisePopup;
