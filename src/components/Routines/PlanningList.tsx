// src/components/PlanningList.tsx

import React, { useState, useEffect } from 'react';
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
import Button from '../Common/Button';
import Table from '../Common/Table';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import PopupCrearPlanificacion from './PopupCrearPlanificacion';
// Importa otros componentes si es necesario

interface PlanningSchema {
  _id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  meta: string;
  semanas: number;
  cliente: {
    _id: string;
    nombre: string;
    email: string;
  };
  trainer: string;
  createdAt: string;
  updatedAt: string;
}

const PlanningList: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
  const [isFormulasModalOpen, setIsFormulasModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('todos');

  // Estados para planificaciones, carga y errores
  const [planningData, setPlanningData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Datos estáticos para estadísticas (puedes actualizar estos valores dinámicamente si lo deseas)
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

  // Función para renderizar las celdas de la tabla
  const renderCell = (key: string, value: any, item?: any) => {
    switch (key) {
      case 'meta':
        return (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              value === 'Aumentar la fuerza en 6 semanas'
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
          <Link to={`/edit-planning/${item?._id}`}>
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

  // Función para obtener las planificaciones
  const fetchPlannings = async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtener el token JWT
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('http://localhost:3000/api/plannings/schemas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al obtener las planificaciones');
      }

      const data: PlanningSchema[] = await response.json();

      // Procesa los datos según necesites
      const filteredData = data.map((planning) => {
        return {
          nombre: planning.nombre,
          descripcion: planning.descripcion,
          duracion: `${planning.semanas} semana${planning.semanas > 1 ? 's' : ''}`,
          fechaInicio: new Date(planning.fechaInicio).toLocaleDateString('es-ES'),
          meta: planning.meta,
          clientesAsociados: 1, // Ajusta según tus datos
          estado: 'En progreso', // Ajusta según tus datos
          completado: '65%', // Ajusta según tus datos
          acciones: 'Editar',
          _id: planning._id,
        };
      });

      setPlanningData(filteredData);
    } catch (err: any) {
      console.error('Error al obtener las planificaciones:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para obtener las planificaciones al montar el componente
  useEffect(() => {
    fetchPlannings();
  }, []);

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

      {/* Manejo de estados de carga y error */}
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <p>Cargando planificaciones...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">Error: {error}</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-lg shadow-lg overflow-hidden`}
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
            data={planningData
              .filter((item) => {
                if (searchTerm === '') return true;
                // Filtrar por los campos relevantes
                return (
                  item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.meta.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.estado.toLowerCase().includes(searchTerm.toLowerCase())
                );
              })
              .map((item) => ({
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
      )}

      {/* Modal para Crear Fórmula */}
      <AnimatePresence>
        {isFormulasModalOpen && (
          <motion.div
            key="modal-crear-formula"
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
              {/* Aquí iría el contenido para crear fórmula */}
              <h3 className="text-2xl font-bold mb-4">Crear Fórmula</h3>
              {/* Formularios y otros componentes */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para Crear Planificación */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            key="modal-crear-planificacion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <PopupCrearPlanificacion
              onClose={() => setIsCreateModalOpen(false)}
              onPlanningCreated={() => {
                fetchPlannings();
                setIsCreateModalOpen(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para Ver Archivos */}
      <AnimatePresence>
        {isFilesModalOpen && (
          <motion.div
            key="modal-ver-archivos"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setIsFilesModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
              {/* Aquí iría el contenido para ver archivos */}
              <h3 className="text-2xl font-bold mb-4">Archivos Asociados</h3>
              {/* Lista de archivos o componentes relacionados */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanningList;
