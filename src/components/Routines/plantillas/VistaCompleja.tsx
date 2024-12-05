import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

interface VistaComplejaProps {
  plantilla: any;
}

const VistaCompleja: React.FC<VistaComplejaProps> = ({ plantilla }) => {
  const { theme } = useTheme();

  return (
    <div className={`bg-gray-50 dark:bg-gray-700 p-6 rounded-lg`}>
      <h2 className="text-xl font-semibold mb-4">Vista Detallada</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
            Ejercicios y Rutinas
          </label>
          <div className="mt-2 space-y-2">
            {plantilla?.ejercicios?.map((ejercicio: any, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`}
              >
                <h3 className="font-medium">{ejercicio.nombre}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {ejercicio.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaCompleja;
