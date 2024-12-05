import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

interface VistaClientesProps {
  plantilla: any;
}

const VistaClientes: React.FC<VistaClientesProps> = ({ plantilla }) => {
  const { theme } = useTheme();

  return (
    <div className={`bg-gray-50 dark:bg-gray-700 p-6 rounded-lg`}>
      <h2 className="text-xl font-semibold mb-4">Clientes Asignados</h2>
      <div className="space-y-4">
        {plantilla?.clientes?.length > 0 ? (
          <div className="grid gap-4">
            {plantilla.clientes.map((cliente: any) => (
              <div
                key={cliente._id}
                className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{cliente.nombre}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {cliente.email}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Fecha de inicio: {new Date(cliente.fechaInicio).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No hay clientes asignados a esta plantilla
          </p>
        )}
      </div>
    </div>
  );
};

export default VistaClientes;
