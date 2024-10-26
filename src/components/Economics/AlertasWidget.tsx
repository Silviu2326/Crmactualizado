import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Alerta {
  id: number;
  mensaje: string;
  tipo: 'info' | 'warning' | 'error';
}

interface AlertasWidgetProps {
  alertas: Alerta[];
  isEditMode: boolean;
  onRemove: () => void;
}

const AlertasWidget: React.FC<AlertasWidgetProps> = ({
  alertas,
  isEditMode,
  onRemove,
}) => {
  const { theme } = useTheme();

  const getAlertColor = (tipo: 'info' | 'warning' | 'error') => {
    if (theme === 'dark') {
      switch (tipo) {
        case 'info': return 'bg-blue-900 text-blue-200';
        case 'warning': return 'bg-yellow-900 text-yellow-200';
        case 'error': return 'bg-red-900 text-red-200';
      }
    } else {
      switch (tipo) {
        case 'info': return 'bg-blue-100 text-blue-800';
        case 'warning': return 'bg-yellow-100 text-yellow-800';
        case 'error': return 'bg-red-100 text-red-800';
      }
    }
  };

  return (
    <div className={`p-4 h-full flex flex-col justify-between ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-yellow-50 text-gray-800'} rounded-lg`}>
      {isEditMode && (
        <button
          onClick={onRemove}
          className={`absolute top-2 right-2 ${theme === 'dark' ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-500 hover:text-yellow-700'} bg-white rounded-full p-1 shadow-md`}
        >
          <AlertTriangle className="w-4 h-4" />
        </button>
      )}
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Alertas Económicas</h3>
        <div className={`${theme === 'dark' ? 'bg-yellow-900' : 'bg-yellow-100'} p-2 rounded-full`}>
          <AlertTriangle className={`w-5 h-5 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'}`} />
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        {alertas.map((alerta) => (
          <div
            key={alerta.id}
            className={`mb-2 p-2 rounded ${getAlertColor(alerta.tipo)}`}
          >
            {alerta.mensaje}
          </div>
        ))}
      </div>
      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
        {alertas.length} alertas activas
      </div>
    </div>
  );
};

export default AlertasWidget;