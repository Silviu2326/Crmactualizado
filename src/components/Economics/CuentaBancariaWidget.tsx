import React from 'react';
import { CreditCard } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface CuentaBancariaWidgetProps {
  saldo: number;
  isEditMode: boolean;
  onUpdate: (value: number) => void;
  onRemove: () => void;
}

const CuentaBancariaWidget: React.FC<CuentaBancariaWidgetProps> = ({
  saldo,
  isEditMode,
  onUpdate,
  onRemove,
}) => {
  const { theme } = useTheme();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onUpdate(newValue);
  };

  return (
    <div className={`p-4 h-full flex flex-col justify-between ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-blue-50 text-gray-800'} rounded-lg transition-colors duration-200`}>
      {isEditMode && (
        <button
          onClick={onRemove}
          className={`absolute top-2 right-2 ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-700'} bg-white rounded-full p-1 shadow-md`}
        >
          <CreditCard className="w-4 h-4" />
        </button>
      )}
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Cuenta Bancaria</h3>
        <div className={`${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'} p-2 rounded-full`}>
          <CreditCard className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
        </div>
      </div>
      <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
        {isEditMode ? (
          <input
            type="number"
            value={saldo}
            onChange={handleChange}
            className={`w-full text-2xl font-bold ${
              theme === 'dark'
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-blue-100 text-gray-900 border-blue-300'
            } border rounded p-1`}
          />
        ) : (
          saldo.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
        )}
      </div>
      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
        Saldo Actual
      </div>
    </div>
  );
};

export default CuentaBancariaWidget;