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
}) => {
  const [localRM, setLocalRM] = useState<string>(rm?.toString() || '');
  
  const handleRMChange = (value: string) => {
    setLocalRM(value);
    if (value && !isNaN(Number(value))) {
      onRMChange?.(Number(value));
    }
  };

  if (!isOpen) return null;

  const baseRM = 100; // RM base para comparación
  const percentages = [100, 95, 90, 85, 80, 75, 70, 65, 60];

  const calculateWeight = (baseWeight: number, percentage: number) => {
    return Math.round((baseWeight * percentage) / 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[600px] relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Editar {exerciseName}
        </h3>

        <div className="space-y-4">
          {periodIndex === 0 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  RM* (Repetición Máxima)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    value={localRM}
                    onChange={(e) => handleRMChange(e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="RM"
                  />
                  <span className="text-sm text-gray-500">Kg</span>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-lg font-medium text-blue-700 text-center uppercase tracking-wide">
                  ¡Esto es solo un ejemplo de cómo quedará!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">RM Base (100 Kg)</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left text-xs font-medium text-gray-500">%</th>
                          <th className="text-left text-xs font-medium text-gray-500">Kg</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {percentages.map((percentage) => (
                          <tr key={percentage}>
                            <td className="py-1 text-sm text-gray-900">{percentage}%</td>
                            <td className="py-1 text-sm text-gray-900">{calculateWeight(baseRM, percentage)} Kg</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Tu RM ({localRM || 0} Kg)
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
                          <td className="py-2 text-sm text-gray-900">{localRM ? '100%' : '-'}</td>
                          <td className="py-2 text-sm text-gray-900">{localRM || '-'} Kg</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                * El RM introducido será el peso base para calcular los porcentajes en este y otros periodos
              </p>
            </div>
          ) : (
            <div className="space-y-2">
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

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={onClose}
          >
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditExercisePopup;
