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
  _id: string;
  nombre: string;
  email: string;
  fechaRegistro: string;
  trainer: string;
  planesDePago: any[];
  servicios: any[];
  transacciones: any[];
  __v: number;
}

const API_URL = 'https://fitoffice2-f70b52bef77e.herokuapp.com/api';

const ClientList: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [openPanels, setOpenPanels] = useState<string[]>([]); // Nuevo estado para paneles abiertos
  const [filterOpen, setFilterOpen] = useState(false);
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
    setOpenPanels(prevOpenPanels => {
      if (prevOpenPanels.includes(clientId)) {
        return prevOpenPanels.filter(id => id !== clientId);
      } else {
        return [...prevOpenPanels, clientId];
      }
    });
  };

  const handlePanelClose = (clientId: string) => {
    setOpenPanels(prevOpenPanels => 
      prevOpenPanels.filter(id => id !== clientId)
    );
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
    if (selectedClients.length === clientesData.length) {
      setSelectedClients([]);
      console.log('❌ Todos los clientes han sido deseleccionados.');
    } else {
      const allClientIds = clientesData.map((c) => c._id);
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
      case 'nombre':
        return value;
      case 'email':
        return value;
      case 'fecharegistro':
        return new Date(value).toLocaleDateString();
      default:
        return value || '-';
    }
  };

  const columns = [
    'Nombre',
    'Email',
    'Fecha Registro'
  ];

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
            <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <tr>
                    <th scope="col" className="relative px-6 py-3">
                      <input
                        type="checkbox"
                        className="absolute h-4 w-4 left-4 top-1/2 transform -translate-y-1/2"
                        onChange={toggleSelectAll}
                        checked={selectedClients.length === clientesData.length}
                      />
                    </th>
                    {columns.map((column) => (
                      <th
                        key={column}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClients.map((cliente) => (
                    <React.Fragment key={cliente._id}>
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => handleRowClick(cliente._id)}
                        className={`${
                          openPanels.includes(cliente._id)
                            ? theme === 'dark'
                              ? 'bg-gray-700'
                              : 'bg-blue-50'
                            : theme === 'dark'
                            ? 'bg-gray-800'
                            : 'bg-white'
                        } cursor-pointer hover:${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedClients.includes(cliente._id)}
                            onChange={(e) => toggleClientSelection(cliente._id, e)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4"
                          />
                        </td>
                        {Object.entries({
                          nombre: cliente.nombre,
                          email: cliente.email,
                          fechaRegistro: cliente.fechaRegistro
                        }).map(([key, value]) => (
                          <td
                            key={key}
                            className="px-6 py-4 whitespace-nowrap text-sm"
                          >
                            {renderCell(key, value)}
                          </td>
                        ))}
                      </motion.tr>
                      <AnimatePresence mode="wait">
                        {openPanels.includes(cliente._id) && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ 
                              opacity: 1, 
                              height: "auto",
                              transition: {
                                height: {
                                  duration: 0.3
                                },
                                opacity: {
                                  duration: 0.3,
                                  delay: 0.1
                                }
                              }
                            }}
                            exit={{ 
                              opacity: 0, 
                              height: 0,
                              transition: {
                                height: {
                                  duration: 0.3
                                },
                                opacity: {
                                  duration: 0.2
                                }
                              }
                            }}
                          >
                            <td colSpan={columns.length + 1} className="p-0">
                              <div className="overflow-hidden">
                                <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-t ${
                                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                                }`}>
                                  <PanelCliente
                                    clienteId={cliente._id}
                                    onClose={() => handlePanelClose(cliente._id)}
                                  />
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
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
