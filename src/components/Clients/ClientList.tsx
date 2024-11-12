import React, { useState } from 'react';
<<<<<<< HEAD
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
=======
import { 
  Users, Filter, Calendar, Briefcase, 
  ChevronDown, Plus, Search, Moon, Sun,
  UserPlus, Download, Trash2, Edit2, Bell, Tag, CheckCircle,
  AlertTriangle, FileText, Upload, List, ArrowUpRight
} from 'lucide-react';
import Button from '../Common/Button';
import Table from '../Common/Table';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import PanelCliente from './PanelCliente';
>>>>>>> ea50e6cc3bfa4afdba7f06d7ae8a47da1ad3df70

const ClientList: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
<<<<<<< HEAD
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
=======
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'simplified' | 'commands'>('simplified');

  const statsCards = [
    { 
      icon: Users,
      title: "Clientes Activos",
      value: "156",
      change: "+12",
      color: "bg-blue-500"
    },
    {
      icon: Calendar,
      title: "Nuevas Inscripciones",
      value: "28",
      change: "+3",
      color: "bg-purple-500"
    },
    {
      icon: Briefcase,
      title: "Renovaciones",
      value: "45",
      change: "+8",
      color: "bg-green-500"
    },
    {
      icon: AlertTriangle,
      title: "Alertas",
      value: "5",
      change: "-2",
      color: "bg-amber-500"
    }
  ];
>>>>>>> ea50e6cc3bfa4afdba7f06d7ae8a47da1ad3df70

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
<<<<<<< HEAD
      pagosAlDia: true,
    },
=======
      pagosAlDia: true
    },
    {
      id: '2',
      nombre: 'María',
      apellido: 'García',
      estado: 'Activo',
      telefono: '+34 987 654 321',
      email: 'maria@example.com',
      tag: 'Standard',
      tipoPlan: 'Mensual',
      ultimoCheckIn: '2024-03-11',
      clase: 'Yoga',
      cumplimiento: '92%',
      alertas: '0',
      servicio: 'Grupal',
      direccion: 'Avenida Central 456',
      fechaInicio: '2023-06-20',
      objetivo: 'Flexibilidad',
      peso: '65kg',
      altura: '165cm',
      imc: 23.9,
      ultimaVisita: '2024-03-11',
      proximaCita: '2024-03-18',
      planActual: 'Standard Mensual',
      progreso: 90,
      pagosAlDia: true
    }
>>>>>>> ea50e6cc3bfa4afdba7f06d7ae8a47da1ad3df70
  ];

  const handleRowClick = (clientId: string) => {
    setSelectedClient(selectedClient === clientId ? null : clientId);
  };

<<<<<<< HEAD
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
=======
  const renderCell = (key: string, value: any, cliente: any) => {
    switch (key) {
      case 'estado':
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            value === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
>>>>>>> ea50e6cc3bfa4afdba7f06d7ae8a47da1ad3df70
            {value}
          </span>
        );
      case 'tag':
        return (
<<<<<<< HEAD
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              value === 'Premium'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
=======
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            value === 'Premium' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
          }`}>
>>>>>>> ea50e6cc3bfa4afdba7f06d7ae8a47da1ad3df70
            {value}
          </span>
        );
      case 'cumplimiento':
        return (
          <div className="flex items-center space-x-2">
            <div className="flex-grow bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
<<<<<<< HEAD
              <div
                className={`h-2.5 rounded-full ${
                  parseInt(value) > 80
                    ? 'bg-green-600'
                    : parseInt(value) > 50
                    ? 'bg-yellow-600'
                    : 'bg-red-600'
=======
              <div 
                className={`h-2.5 rounded-full ${
                  parseInt(value) > 80 ? 'bg-green-600' :
                  parseInt(value) > 50 ? 'bg-yellow-600' :
                  'bg-red-600'
>>>>>>> ea50e6cc3bfa4afdba7f06d7ae8a47da1ad3df70
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
<<<<<<< HEAD
            <AlertTriangle
              className={`w-4 h-4 ${
                parseInt(value) > 0 ? 'text-red-500' : 'text-green-500'
              }`}
            />
=======
            <AlertTriangle className={`w-4 h-4 ${
              parseInt(value) > 0 ? 'text-red-500' : 'text-green-500'
            }`} />
>>>>>>> ea50e6cc3bfa4afdba7f06d7ae8a47da1ad3df70
            <span>{value}</span>
          </div>
        );
      default:
        return value;
    }
  };

<<<<<<< HEAD
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
=======
  const renderTableRow = (item: any, index: number) => (
    <React.Fragment key={item.id}>
      <motion.tr 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        onClick={() => handleRowClick(item.id)}
        className={`cursor-pointer group transition-all duration-300 ${
          selectedClient === item.id 
            ? theme === 'dark' 
              ? 'bg-blue-900/30 hover:bg-blue-900/40' 
              : 'bg-blue-50 hover:bg-blue-100'
            : theme === 'dark'
              ? 'hover:bg-gray-800'
              : 'hover:bg-gray-50'
        }`}
      >
        {Object.entries(item).map(([key, value]) => (
          <td key={key} className="px-6 py-4 whitespace-nowrap group-hover:transform group-hover:scale-[1.02] transition-all duration-300">
            {renderCell(key.toLowerCase().replace(/ /g, ''), value, item)}
          </td>
        ))}
      </motion.tr>
      {selectedClient === item.id && (
        <tr>
          <td colSpan={12}>
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
                    scale: { duration: 0.3, type: "spring", stiffness: 300, damping: 25 }
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  height: 0, 
                  scale: 0.95,
                  transition: {
                    height: { duration: 0.3 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 }
                  }
                }}
                className="overflow-hidden"
              >
                <PanelCliente
                  cliente={clientesData.find(c => c.id === selectedClient)!}
                  onClose={() => setSelectedClient(null)}
                />
              </motion.div>
            </AnimatePresence>
          </td>
        </tr>
      )}
    </React.Fragment>
  );

  return (
    <div className={`relative p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'} rounded-xl shadow-sm transition-colors duration-300`}>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              ¡OPTIMIZA TU GESTIÓN DE CLIENTES!
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Explora y gestiona a tus clientes de manera fácil y rápida
            </p>
          </div>
          <Button 
            variant="create" 
            className="flex items-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Cliente
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-3 pl-10 pr-[100px] rounded-xl ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-white border-gray-700 focus:border-blue-500' 
                  : 'bg-white text-gray-900 border-gray-200 focus:border-blue-400'
              } border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-sm`}
            />
            <Search className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
            <Button
              variant="filter"
              className="absolute right-2 top-2 transform transition-transform duration-300 hover:scale-105"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button 
              variant={viewMode === 'simplified' ? 'create' : 'normal'}
              onClick={() => setViewMode('simplified')}
              className="flex items-center transform hover:scale-105 transition-all duration-300"
            >
              <List className="w-4 h-4 mr-2" />
              Vista Simplificada
            </Button>
            <Button 
              variant={viewMode === 'commands' ? 'create' : 'normal'}
              onClick={() => setViewMode('commands')}
              className="flex items-center transform hover:scale-105 transition-all duration-300"
            >
              <FileText className="w-4 h-4 mr-2" />
              Comandos
            </Button>
            <Button 
              variant="normal" 
              className="flex items-center transform hover:scale-105 transition-all duration-300"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importar
            </Button>
            <Button 
              variant="danger" 
              className="flex items-center transform hover:scale-105 transition-all duration-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer`}
            >
              <div className="flex items-center space-x-4">
                <div className={`${card.color} p-3 rounded-xl shadow-lg`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">{card.title}</h3>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <span className={`text-sm ${
                    card.change.includes('+') ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {card.change} este mes
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl`}
      >
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              {['Nombre', 'Apellido', 'Estado', 'Teléfono', 'Email', 'Tag', 'Tipo de Plan', 'Último Check-in', 'Clase', '% Cumplimiento', 'Alertas', 'Servicio'].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            {clientesData.map((cliente, index) => renderTableRow({
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
              id: cliente.id
            }, index))}
          </tbody>
        </table>
>>>>>>> ea50e6cc3bfa4afdba7f06d7ae8a47da1ad3df70
      </motion.div>
    </div>
  );
};

<<<<<<< HEAD
export default ClientList;
=======
export default ClientList;
>>>>>>> ea50e6cc3bfa4afdba7f06d7ae8a47da1ad3df70
