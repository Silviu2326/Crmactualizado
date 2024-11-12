import React from 'react';
import { AlertTriangle, Calendar, CheckCircle, Info, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Alerta {
  id: number;
  mensaje: string;
  fechaExpiracion: string;
  tipo: 'info' | 'warning' | 'error';
}

interface AlertasWidgetProps {
  alertas: Alerta[];
  isEditMode: boolean;
  onRemove: (id: number) => void;
}

const AlertasWidget: React.FC<AlertasWidgetProps> = ({
  alertas,
  isEditMode,
  onRemove,
}) => {
  const { theme } = useTheme();

  const getAlertStyles = (tipo: 'info' | 'warning' | 'error') => {
    switch (tipo) {
      case 'info':
        return 'bg-blue-50 border-blue-400 text-blue-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-400 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-400 text-red-800';
      default:
        return '';
    }
  };

  const getIcon = (tipo: 'info' | 'warning' | 'error') => {
    switch (tipo) {
      case 'info':
        return <Info className="text-blue-500 w-6 h-6" />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500 w-6 h-6" />;
      case 'error':
        return <AlertTriangle className="text-red-500 w-6 h-6 animate-pulse" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative p-6 rounded-lg shadow-lg transition-all ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'
      }`}
    >
      <div className="flex items-center mb-5">
        <AlertTriangle className="text-yellow-500 w-7 h-7 animate-pulse mr-3" />
        <h3 className="text-xl font-bold text-yellow-600">
          Alertas Económicas
        </h3>
      </div>

      <div className="space-y-4">
        {alertas.map((alerta) => (
          <div
            key={alerta.id}
            className={`p-5 rounded-lg border-l-4 shadow-sm hover:shadow-lg transform hover:scale-102 transition-transform duration-500 ${getAlertStyles(
              alerta.tipo
            )}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getIcon(alerta.tipo)}
                <p className="text-lg font-medium">{alerta.mensaje}</p>
              </div>
              {isEditMode && (
                <button
                  onClick={() => onRemove(alerta.id)}
                  className="ml-3 p-1 rounded-full bg-red-50 hover:bg-red-200 transition"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Total de alertas: {alertas.length}
      </div>

      {isEditMode && (
        <button
          onClick={() => alertas.forEach((alerta) => onRemove(alerta.id))}
          className={`absolute top-2 right-2 p-3 rounded-full shadow-md bg-red-50 hover:bg-red-100 transition ${
            theme === 'dark'
              ? 'text-red-400 hover:text-red-300'
              : 'text-red-500 hover:text-red-700'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default AlertasWidget;
