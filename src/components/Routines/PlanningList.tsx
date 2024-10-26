import React, { useState } from 'react';
import {
  Search,
  X,
  Upload,
  Edit,
  Plus,
  Filter,
  Download,
  Calendar,
  FileText,
  Users,
  Clock,
  Target,
} from 'lucide-react';
import Button from '../common/Button';
import Table from '../common/Table';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FormulasPopup from './FormulasPopup'; // Importación agregada

const PlanningList: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
  const [isFormulasModalOpen, setIsFormulasModalOpen] = useState(false); // Estado agregado
  const [selectedFilter, setSelectedFilter] = useState('todos');

  const routineData = [
    {
      id: '1',
      nombre: 'Rutina de fuerza',
      descripcion: 'Enfocada en ganar masa muscular',
      duracion: '8 semanas',
      fechaInicio: '2023-06-01',
      meta: 'Aumento de fuerza',
      clientesAsociados: 5,
      estado: 'En progreso',
      completado: '65%',
      acciones: 'Editar',
    },
    {
      id: '2',
      nombre: 'Cardio intensivo',
      descripcion: 'Para mejorar resistencia cardiovascular',
      duracion: '4 semanas',
      fechaInicio: '2023-07-01',
      meta: 'Pérdida de peso',
      clientesAsociados: 8,
      estado: 'Pendiente',
      completado: '0%',
      acciones: 'Editar',
    },
    {
      id: '3',
      nombre: 'Flexibilidad y yoga',
      descripcion: 'Mejora de flexibilidad y relajación',
      duracion: '6 semanas',
      fechaInicio: '2023-08-01',
      meta: 'Flexibilidad',
      clientesAsociados: 3,
      estado: 'Completado',
      completado: '100%',
      acciones: 'Editar',
    },
  ];

  const renderCell = (key: string, value: any, item: any) => {
    switch (key) {
      case 'meta':
        return (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              value === 'Aumento de fuerza'
                ? 'bg-purple-100 text-purple-800'
                : value === 'Pérdida de peso'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {value}
          </span>
        );
      case 'estado':
        return (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              value === 'En progreso'
                ? 'bg-blue-100 text-blue-800'
                : value === 'Pendiente'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {value}
          </span>
        );
      case 'completado':
        return (
          <div className="flex items-center space-x-2">
            <div className="flex-grow bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className={`h-2.5 rounded-full ${
                  parseInt(value) === 100
                    ? 'bg-green-600'
                    : parseInt(value) > 50
                    ? 'bg-blue-600'
                    : 'bg-amber-600'
                }`}
                style={{ width: value }}
              ></div>
            </div>
            <span className="text-sm font-medium">{value}</span>
          </div>
        );
      case 'clientesAsociados':
        return (
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span>{value}</span>
          </div>
        );
      case 'duracion':
        return (
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{value}</span>
          </div>
        );
      case 'acciones':
        return (
          <Link to={`/edit-planning/${item.id}`}>
            <Button variant="normal" className="flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>Editar</span>
            </Button>
          </Link>
        );
      default:
        return value;
    }
  };

  const statsCards = [
    {
      icon: Target,
      title: 'Planificaciones Activas',
      value: '12',
      color: 'bg-blue-500',
    },
    {
      icon: Users,
      title: 'Clientes Asignados',
      value: '45',
      color: 'bg-purple-500',
    },
    {
      icon: Clock,
      title: 'Horas Programadas',
      value: '168',
      color: 'bg-green-500',
    },
    {
      icon: Calendar,
      title: 'Completadas este mes',
      value: '8',
      color: 'bg-amber-500',
    },
  ];

  return (
    <div
      className={`p-6 ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
          Planificaciones de Entrenamiento
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Gestiona y monitorea los planes de entrenamiento de tus clientes
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${
              theme === 'dark' ? 'bg-gray-700' : 'bg-white'
            } p-4 rounded-lg shadow-lg`}
          >
            <div className="flex items-center space-x-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500 dark:text-gray-400">
                  {card.title}
                </h3>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="flex space-x-2">
          <Button variant="create" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Crear Planificación
          </Button>
          <Button variant="normal" onClick={() => setIsFormulasModalOpen(true)}>
            {/* Botón agregado */}
            <Plus className="w-5 h-5 mr-2" />
            Crear Fórmula
          </Button>
          <Button variant="normal" onClick={() => setIsFilesModalOpen(true)}>
            <FileText className="w-5 h-5 mr-2" />
            Ver Archivos
          </Button>
          <Button variant="normal">
            <Download className="w-5 h-5 mr-2" />
            Exportar
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 flex space-x-4"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar planificaciones..."
            className={`w-full px-4 py-3 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 text-white'
                : 'bg-gray-100 text-gray-800'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-3 text-gray-400" />
        </div>
        <Button variant="filter">
          <Filter className="w-5 h-5 mr-2" />
          Filtros
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        <Table
          headers={[
            'Nombre',
            'Descripción',
            'Duración',
            'Fecha de Inicio',
            'Meta',
            'Clientes',
            'Estado',
            'Completado',
            'Acciones',
          ]}
          data={routineData.map((item) => ({
            ...item,
            ...Object.fromEntries(
              Object.entries(item).map(([key, value]) => [
                key,
                renderCell(key, value, item),
              ])
            ),
          }))}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      </motion.div>

      {/* Modal para Crear Fórmula */}
      <AnimatePresence>
        {isFormulasModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setIsFormulasModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <FormulasPopup onClose={() => setIsFormulasModalOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Los modales existentes permanecen igual */}
    </div>
  );
};

export default PlanningList;
