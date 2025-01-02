import React, { useState, useEffect } from 'react';
import { AlertTriangle, Users, CheckCircle } from 'lucide-react';
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
  apellido: string;
  email: string;
  telefono: string;
  estado: string;
  tag: string;
  fechaRegistro: string;
  trainer: string;
  planesDePago: {
    nombre: string;
    estado: string;
  }[];
  servicios: {
    nombre: string;
    estado: string;
  }[];
  ultimoCheckin: string;
  alertas: {
    tipo: string;
    mensaje: string;
    fecha: string;
  }[];
  transacciones: any[];
  __v: number;
}

const API_URL = 'https://fitoffice2-f70b52bef77e.herokuapp.com/api';

const ClientList: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [openPanels, setOpenPanels] = useState<string[]>([]);
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
  const [showCreateClient, setShowCreateClient] = useState<boolean>(false);

  // Estilos base
  const styles = {
    container: `${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen p-4`,
    header: `${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} text-2xl font-bold mb-4 flex items-center`,
  };

  useEffect(() => {
    console.log(' Iniciando la carga de clientes...');
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    setLoading(true);
    console.log(' Realizando petición GET a la API para obtener clientes...');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await axios.get(`${API_URL}/clientes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setClientesData(response.data);
      console.log(' Clientes obtenidos exitosamente:', response.data);
    } catch (error) {
      console.error(' Error al obtener los clientes:', error);
      setError('Error al obtener los clientes');
    } finally {
      setLoading(false);
      console.log(' Finalizó la carga de clientes.');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRowClick = (clientId: string) => {
    console.log(` Fila de cliente con ID ${clientId} clickeada.`);
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
    event: React.MouseEvent | null
  ) => {
    if (event) {
      event.stopPropagation();
    }
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
    console.log(
      selectedClients.includes(clientId)
        ? ` Cliente con ID ${clientId} deseleccionado.`
        : ` Cliente con ID ${clientId} seleccionado.`
    );
  };

  const toggleSelectAll = () => {
    if (selectedClients.length === clientesData.length) {
      setSelectedClients([]);
      console.log(' Todos los clientes han sido deseleccionados.');
    } else {
      const allClientIds = clientesData.map((c) => c._id);
      setSelectedClients(allClientIds);
      console.log(' Todos los clientes han sido seleccionados.');
    }
  };

  const filteredClients = clientesData.filter((client) => {
    const matchesSearch = Object.values(client).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      
      if (key === 'tag') {
        if (value === 'Sin etiqueta') {
          return !client.tag || client.tag === '' || client.tag === 'Sin etiqueta';
        }
        return client.tag === value;
      }
      
      return client[key as keyof Cliente] === value;
    });

    return matchesSearch && matchesFilters;
  });

  useEffect(() => {
    console.log(
      ` Filtrando clientes con término de búsqueda: "${searchTerm}" y filtros:`,
      filters
    );
  }, [searchTerm, filters, clientesData]);

  const renderCell = (key: string, value: any, client: Cliente) => {
    switch (key) {
      case 'nombre':
        return (
          <div className="flex items-center">
            {value === 'Activo' && <CheckCircle size={16} className="mr-2 text-green-500" />}
            {`${client.nombre} ${client.apellido}`}
          </div>
        );
      case 'email':
        return value;
      case 'telefono':
        return value || '-';
      case 'estado':
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${
            value === 'Activo' ? 'bg-green-500 text-white' :
            value === 'Pendiente' ? 'bg-red-500 text-white' :
            'bg-gray-500 text-white'
          } flex items-center justify-center`}>
            {value}
          </span>
        );
      case 'tag':
        return !value || value === 'Sin etiqueta' ? (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            Sin etiqueta
          </span>
        ) : (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {value}
          </span>
        );
      case 'planDePago':
        return client.planesDePago[0]?.nombre || '-';
      case 'servicio':
        return client.servicios[0]?.nombre || '-';
      case 'ultimoCheckin':
        return formatDate(client.ultimoCheckin);
      case 'alertas':
        return client.alertas && client.alertas.length > 0 ? (
          <div className="flex items-center text-yellow-500">
            <AlertTriangle size={16} className="mr-1" />
            {client.alertas.length}
          </div>
        ) : '-';

      case 'fechaRegistro':
        return formatDate(value);
      default:
        return value || '-';
    }
  };

  const columns = [
    'Nombre',
    'Email',
    'Teléfono',
    'Estado',
    'Tag',
    'Plan de Pago',
    'Servicio',
    'Último Checkin',
    'Alertas',
    'Fecha Registro'
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Users className="mr-2" /> Lista de Clientes
      </div>

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
          console.log(' Abriendo formulario para crear un nuevo cliente.');
          setShowCreateClient(true);
        }}
      />

      {showCreateClient && (
        <div className="mt-6">
          <CreateClient
            onClose={() => {
              console.log(' Cerrar formulario de creación de cliente.');
              setShowCreateClient(false);
            }}
            onClientCreated={() => {
              console.log(' Cliente creado exitosamente.');
              setShowCreateClient(false);
              fetchClientes();
            }}
          />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4">{error}</div>
      ) : viewMode === 'table' ? (
        <div className="mt-6 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className={`overflow-hidden border border-opacity-20 ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            } rounded-lg shadow-sm`}>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <tr>
                    <th scope="col" className="relative px-6 py-3">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedClients.length === clientesData.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    {columns.map((column) => (
                      <th
                        key={column}
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
                }`}>
                  {filteredClients.map((cliente) => (
                    <React.Fragment key={cliente._id}>
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => handleRowClick(cliente._id)}
                        className={`cursor-pointer transition-colors duration-150 ${
                          theme === 'dark'
                            ? 'hover:bg-gray-700/50'
                            : 'hover:bg-gray-50'
                        } ${
                          selectedClients.includes(cliente._id)
                            ? theme === 'dark'
                              ? 'bg-gray-700/30'
                              : 'bg-blue-50'
                            : ''
                        }`}
                      >
                        <td className="relative px-6 py-4">
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={selectedClients.includes(cliente._id)}
                            onChange={(e) =>
                              toggleClientSelection(cliente._id, e)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        {Object.entries({
                          nombre: cliente.nombre,
                          email: cliente.email,
                          telefono: cliente.telefono,
                          estado: cliente.estado,
                          tag: cliente.tag,
                          planDePago: cliente.planesDePago[0]?.nombre,
                          servicio: cliente.servicios[0]?.nombre,
                          ultimoCheckin: cliente.ultimoCheckin,
                          alertas: cliente.alertas,
                          fechaRegistro: cliente.fechaRegistro
                        }).map(([key, value]) => (
                          <td
                            key={key}
                            className={`px-6 py-4 whitespace-nowrap ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                            } ${
                              key === 'nombre' ? 'font-medium' : 'text-sm'
                            }`}
                          >
                            {renderCell(key, value, cliente)}
                          </td>
                        ))}
                      </motion.tr>
                      <AnimatePresence mode="wait">
                        {openPanels.includes(cliente._id) && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                            }`}
                          >
                            <td colSpan={columns.length + 1}>
                              <PanelCliente
                                clienteId={cliente._id}
                                onClose={() => handlePanelClose(cliente._id)}
                              />
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <ClientListViewSimple
          clientes={filteredClients}
          selectedClients={selectedClients}
          toggleClientSelection={toggleClientSelection}
        />
      )}
    </div>
  );
};

export default ClientList;
