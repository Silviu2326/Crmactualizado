import React, { useState } from 'react';

interface MacrosEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  dietId: string;
  date: string;
  initialMacros: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  };
  onMacrosUpdated: (updatedMacros: any) => void;
}

export default function MacrosEditModal({ 
  isOpen, 
  onClose, 
  dietId,
  date,
  initialMacros,
  onMacrosUpdated 
}: MacrosEditModalProps) {
  const [macros, setMacros] = useState(initialMacros);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('\n🎯 ACTUALIZANDO MACROS:');
      console.log('URL:', `https://fitoffice2-f70b52bef77e.herokuapp.com/api/dietas/${dietId}/dias/${date}/macros`);
      console.log('Macros a enviar:', {
        calorias: `${macros.calorias} kcal (${typeof macros.calorias})`,
        proteinas: `${macros.proteinas} g (${typeof macros.proteinas})`,
        carbohidratos: `${macros.carbohidratos} g (${typeof macros.carbohidratos})`,
        grasas: `${macros.grasas} g (${typeof macros.grasas})`
      });

      // Validar que no hay valores NaN
      if (Object.values(macros).some(value => isNaN(value))) {
        throw new Error('❌ Error: Algunos valores de macros son NaN');
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/dietas/${dietId}/dias/${date}/macros`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          calories: Math.round(Number(macros.calorias)),
          proteins: Math.round(Number(macros.proteinas)),
          carbohydrates: Math.round(Number(macros.carbohidratos)),
          fats: Math.round(Number(macros.grasas))
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('\n❌ Error al actualizar macros:', errorText);
        throw new Error(`Error al actualizar macros: ${errorText}`);
      }

      const updatedMacros = await response.json();
      console.log('\n✅ Macros actualizados correctamente:', updatedMacros);

      onMacrosUpdated(updatedMacros);
      onClose();
    } catch (error) {
      console.error('\n❌ Error en el proceso:', error);
      setError(error instanceof Error ? error.message : 'Error al actualizar los macros');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof macros) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setMacros(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Editar Macros para {date}</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Calorías
              <input
                type="number"
                value={macros.calorias}
                onChange={handleInputChange('calorias')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                disabled={isLoading}
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Proteínas (g)
              <input
                type="number"
                value={macros.proteinas}
                onChange={handleInputChange('proteinas')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                disabled={isLoading}
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Carbohidratos (g)
              <input
                type="number"
                value={macros.carbohidratos}
                onChange={handleInputChange('carbohidratos')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                disabled={isLoading}
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Grasas (g)
              <input
                type="number"
                value={macros.grasas}
                onChange={handleInputChange('grasas')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                disabled={isLoading}
              />
            </label>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
