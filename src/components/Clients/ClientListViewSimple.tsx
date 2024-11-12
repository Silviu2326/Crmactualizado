import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Mail, Phone, AlertTriangle } from 'lucide-react';

interface Client {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  estado: string;
  tag: string;
  alertas: string;
  cumplimiento: string;
}

interface ClientListViewSimpleProps {
  clients: Client[];
  onClientSelect: (clientId: string) => void;
  selectedClients: string[];
  onClientCheckboxToggle: (clientId: string, event: React.MouseEvent) => void;
}

const ClientListViewSimple: React.FC<ClientListViewSimpleProps> = ({
  clients,
  onClientSelect,
  selectedClients,
  onClientCheckboxToggle,
}) => {
  const { theme } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client, index) => (
        <motion.div
          key={client.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedClients.includes(client.id)}
                  onChange={(e) => onClientCheckboxToggle(client.id, e as any)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-semibold ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  {client.nombre.charAt(0)}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    client.estado === 'Activo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {client.estado}
                </span>
                {parseInt(client.alertas) > 0 && (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {client.nombre} {client.apellido}
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{client.telefono}</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Cumplimiento</span>
                <span className="font-medium">{client.cumplimiento}</span>
              </div>
              <div className="mt-2 flex-grow bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className={`h-2.5 rounded-full ${
                    parseInt(client.cumplimiento) > 80
                      ? 'bg-green-600'
                      : parseInt(client.cumplimiento) > 50
                      ? 'bg-yellow-600'
                      : 'bg-red-600'
                  }`}
                  style={{ width: client.cumplimiento }}
                ></div>
              </div>
            </div>

            <button
              onClick={() => onClientSelect(client.id)}
              className={`mt-4 w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Ver Detalles
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ClientListViewSimple;
