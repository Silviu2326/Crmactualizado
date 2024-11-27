import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import PanelCliente from './PanelCliente';
import ClientListHeader from './ClientListHeader';
import ClientListViewSimple from './ClientListViewSimple';
import axios from 'axios';
import CreateClient from './CreateClient'; // Importamos CreateClient

interface Filters {
  estado: string;
  tag: string;
  tipoPlan: string;
  clase: string;
  servicio: string;
}

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  estado: string;
  telefono: string;
  email: string;
  tag: string;
  tipoPlan: string;
  ultimoCheckIn: string;
  clase: string;
  cumplimiento: string;
  alertas: string;
  servicio: string;
  direccion: string;
  fechaInicio: string;
  objetivo: string;
  peso: string;
  altura: string;
  imc: number;
  ultimaVisita: string;
  proximaCita: string;
  planActual: string;
  progreso: number;
  pagosAlDia: boolean;
}

const API_URL = 'https://fitoffice2-f70b52bef77e.herokuapp.com/api';

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
  const [clientesData, setClientesData] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para controlar la visualización del formulario de creación
  const [showCreateClient, setShowCreateClient] = useState<boolean>(false);

  useEffect(() => {
    console.log('🔄 Iniciando la carga de clientes...');
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    setLoading(true);
    console.log('🚀 Realizando petición GET a la API para obtener clientes...');
    try {
      const response = await axios.get(`${API_URL}/clientes`);
      setClientesData(response.data);
      console.log('🎉 Clientes obtenidos exitosamente:', response.data);
    } catch (error) {
      console.error('❗️ Error al obtener los clientes:', error);
      setError('Error al obtener los clientes');
    } finally {
      setLoading(false);
      console.log('⏳ Finalizó la carga de clientes.');
    }
  };

  const handleRowClick = (clientId: string) => {
    console.log(`👆 Fila de cliente con ID ${clientId} clickeada.`);
    setSelectedClient(selectedClient === clientId ? null : clientId);
  };

  const toggleClientSelection = (
    clientId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
    console.log(
      selectedClients.includes(clientId)
        ? `❌ Cliente con ID ${clientId} deseleccionado.`
        : `✅ Cliente con ID ${clientId} seleccionado.`
    );
  };

  const toggleSelectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
      console.log('❌ Todos los clientes han sido deseleccionados.');
    } else {
      const allClientIds = filteredClients.map((c) => c.id);
      setSelectedClients(allClientIds);
      console.log('✅ Todos los clientes han sido seleccionados.');
    }
  };

  const filteredClients = clientesData.filter((client) => {
    const matchesSearch = Object.values(client).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return client[key as keyof Cliente] === value;
    });

    return matchesSearch && matchesFilters;
  });

  useEffect(() => {
    console.log(
      `🔍 Filtrando clientes con término de búsqueda: "${searchTerm}" y filtros:`,
      filters
    );
  }, [searchTerm, filters, clientesData]);

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
            <span className="text-sm font-medium">{value}%</span>
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
                          clienteId={selectedClient}
                          onClose={() => {
                            console.log(
                              `🔒 Cerrar detalles del cliente con ID ${selectedClient}.`
                            );
                            setSelectedClient(null);
                          }}
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
        onCreateClient={() => {
          console.log('🆕 Abriendo formulario para crear un nuevo cliente.');
          setShowCreateClient(true);
        }} // Pasamos la función para abrir el formulario
      />

      {/* Mostrar CreateClient si showCreateClient es true */}
      {showCreateClient && (
        <div className="mt-6">
          <CreateClient
            onClose={() => {
              console.log('❌ Cerrar formulario de creación de cliente.');
              setShowCreateClient(false);
            }}
            onClientCreated={() => {
              console.log('🎉 Cliente creado exitosamente.');
              setShowCreateClient(false);
              fetchClientes(); // Actualizamos la lista de clientes
            }}
          />
        </div>
      )}

      {loading ? (
        <div>⏳ Cargando...</div>
      ) : error ? (
        <div className="text-red-500">❗️ {error}</div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {viewMode === 'table' ? (
            renderTableView()
          ) : (
            <ClientListViewSimple
              clients={filteredClients}
              onClientSelect={(id) => {
                console.log(`👆 Seleccionando cliente con ID ${id}.`);
                handleRowClick(id);
              }}
              selectedClients={selectedClients}
              onClientCheckboxToggle={toggleClientSelection}
            />
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ClientList;
