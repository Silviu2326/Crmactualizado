import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Variant {
  name: string;
  description: string;
  type: 'mantenimiento' | 'intensidad' | 'volumen';
}

interface VariantesEjerciciosPeriodosProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  exerciseId: string;
  onSelectVariant?: (type: string, percentage?: number) => void;
}

const VariantesEjerciciosPeriodos: React.FC<VariantesEjerciciosPeriodosProps> = ({
  isOpen,
  onClose,
  exerciseName,
  exerciseId,
  onSelectVariant
}) => {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [percentage, setPercentage] = useState<number>(5);
  
  const variants: Variant[] = [
    { 
      name: 'Mantenimiento', 
      description: 'Mismo peso y mismas repeticiones - Mantiene la intensidad y volumen actuales',
      type: 'mantenimiento'
    },
    { 
      name: 'Intensidad', 
      description: 'Más peso, menos repeticiones - Enfoque en fuerza y potencia',
      type: 'intensidad'
    },
    { 
      name: 'Volumen', 
      description: 'Menos peso, más repeticiones - Enfoque en resistencia y volumen',
      type: 'volumen'
    },
  ];

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant.type);
  };

  const handleConfirm = () => {
    if (selectedVariant && onSelectVariant) {
      onSelectVariant(selectedVariant, percentage);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Variantes de {exerciseName}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {variants.map((variant) => (
            <div 
              key={variant.type} 
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                selectedVariant === variant.type ? 'border-purple-500 bg-purple-50' : 'hover:border-gray-300'
              }`}
              onClick={() => handleVariantSelect(variant)}
            >
              <h3 className="font-semibold">{variant.name}</h3>
              <p className="text-sm text-gray-600">{variant.description}</p>
              
              {selectedVariant === variant.type && (variant.type === 'intensidad' || variant.type === 'volumen') && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {variant.type === 'intensidad' ? 'Porcentaje de incremento' : 'Porcentaje de reducción'} por serie
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="number"
                      value={percentage}
                      onChange={(e) => setPercentage(Number(e.target.value))}
                      className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      min="1"
                      max="100"
                    />
                    <span className="ml-2">%</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700"
            disabled={!selectedVariant}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantesEjerciciosPeriodos;
