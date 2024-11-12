import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import PanelCliente from './PanelCliente';
import ClientListHeader from './ClientListHeader';
import ClientListViewSimple from './ClientListViewSimple';

interface Filters {
  estado: string;
  tag: string;
  tipoPlan: string;
  clase: string;
  servicio: string;
}

const ClientList: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'simple'>('table');
  const [filters, setFilters] = useState<Filters>({
    estado: '',
    tag: '',
    tipoPlan: '',
    clase: '',
    servicio: '',
  });

  const clientesData = [
    {
      id: '1',
      nombre: 'Juan',
      apellido: 'Pérez',
      estado: 'Activo',
      telefono: '+34 123 456 789',
      email: 'juan@example.com',
      tag: 'Premium',
      tipoPlan: 'Anual',
      ultimoCheckIn: '2024-03-10',
      clase: 'CrossFit',
      cumplimiento: '85%',
      alertas: '2',
      servicio: 'Personal',
      direccion: 'Calle Principal 123',
      fechaInicio: '2023-01-15',
      objetivo: 'Pérdida de peso',
      peso: '80kg',
      altura: '175cm',
      imc: 26.1,
      ultimaVisita: '2024-03-10',
      proximaCita: '2024-03-17',
      planActual: 'Premium Anual',
      progreso: 75,
      pagosAlDia: true,
    },
  ];

  const handleRowClick = (clientId: string) => {
    setSelectedClient(selectedClient === clientId ? null : clientId);
  };

  const toggleClientSelection = (clientId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedClients((prev) =>
      prev.length === filteredClients.length
        ? []
        : filteredClients.map((c) => c.id)
    );
  };

  const filteredClients = clientesData.filter((client) => {
    const matchesSearch = Object.values(client).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return client[key as keyof typeof client] === value;
    });

    return matchesSearch && matchesFilters;
  });

  const renderCell = (key: string, value: any) => {
    switch (key) {
      case 'estado':
        return (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              value === 'Activo'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {value}
          </span>
        );
      case 'tag':
        return (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              value === 'Premium'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {value}
          </span>
        );
      case 'cumplimiento':
        return (
          <div className="flex items-center space-x-2">
            <div className="flex-grow bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className={`h-2.5 rounded-full ${
                  parseInt(value) > 80
                    ? 'bg-green-600'
                    : parseInt(value) > 50
                    ? 'bg-yellow-600'
                    : 'bg-red-600'
                }`}
                style={{ width: value }}
              ></div>
            </div>
            <span className="text-sm font-medium">{value}</span>
          </div>
        );
      case 'alertas':
        return (
          <div className="flex items-center space-x-1">
            <AlertTriangle
              className={`w-4 h-4 ${
                parseInt(value) > 0 ? 'text-red-500' : 'text-green-500'
              }`}
            />
            <span>{value}</span>
          </div>
        );
      default:
        return value;
    }
  };

  const renderTableView = () => (
    <div
      className={`${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl`}
    >
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={selectedClients.length === filteredClients.length}
                onChange={toggleSelectAll}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </th>
            {[
              'Nombre',
              'Apellido',
              'Estado',
              'Teléfono',
              'Email',
              'Tag',
              'Tipo de Plan',
              'Último Check-in',
              'Clase',
              '% Cumplimiento',
              'Alertas',
              'Servicio',
            ].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={`divide-y divide-gray-200 dark:divide-gray-700 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          {filteredClients.map((cliente, index) => (
            <React.Fragment key={cliente.id}>
              <motion.tr
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => handleRowClick(cliente.id)}
                className={`cursor-pointer group transition-all duration-300 ${
                  selectedClient === cliente.id
                    ? theme === 'dark'
                      ? 'bg-blue-900/30 hover:bg-blue-900/40'
                      : 'bg-blue-50 hover:bg-blue-100'
                    : theme === 'dark'
                    ? 'hover:bg-gray-800'
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(cliente.id)}
                    onChange={(e) =>
                      toggleClientSelection(cliente.id, e as any)
                    }
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </td>
                {Object.entries({
                  Nombre: cliente.nombre,
                  Apellido: cliente.apellido,
                  Estado: cliente.estado,
                  Teléfono: cliente.telefono,
                  Email: cliente.email,
                  Tag: cliente.tag,
                  'Tipo de Plan': cliente.tipoPlan,
                  'Último Check-in': cliente.ultimoCheckIn,
                  Clase: cliente.clase,
                  '% Cumplimiento': cliente.cumplimiento,
                  Alertas: cliente.alertas,
                  Servicio: cliente.servicio,
                }).map(([key, value]) => (
                  <td
                    key={key}
                    className="px-6 py-4 whitespace-nowrap group-hover:transform group-hover:scale-[1.02] transition-all duration-300"
                  >
                    {renderCell(key.toLowerCase().replace(/ /g, ''), value)}
                  </td>
                ))}
              </motion.tr>
              {selectedClient === cliente.id && (
                <tr>
                  <td colSpan={13}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{
                          opacity: 1,
                          height: 'auto',
                          scale: 1,
                          transition: {
                            height: { duration: 0.4 },
                            opacity: { duration: 0.3 },
                            scale: {
                              duration: 0.3,
                              type: 'spring',
                              stiffness: 300,
                              damping: 25,
                            },
                          },
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                          scale: 0.95,
                          transition: {
                            height: { duration: 0.3 },
                            opacity: { duration: 0.2 },
                            scale: { duration: 0.2 },
                          },
                        }}
                        className="overflow-hidden"
                      >
                        <PanelCliente
                          cliente={
                            clientesData.find((c) => c.id === selectedClient)!
                          }
                          onClose={() => setSelectedClient(null)}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div
      className={`relative p-6 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-gray-50 to-gray-100'
      } rounded-xl shadow-sm transition-colors duration-300`}
    >
      <ClientListHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        filters={filters}
        setFilters={setFilters}
        selectedClientsCount={selectedClients.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {viewMode === 'table' ? (
          renderTableView()
        ) : (
          <ClientListViewSimple
            clients={filteredClients}
            onClientSelect={handleRowClick}
            selectedClients={selectedClients}
            onClientCheckboxToggle={toggleClientSelection}
          />
        )}
      </motion.div>
    </div>
  );
};

export default ClientList;
