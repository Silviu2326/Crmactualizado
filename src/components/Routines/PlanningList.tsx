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
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import PopupCrearPlanificacion from './PopupCrearPlanificacion';
import PopupCrearEsqueleto from './PopupCrearEsqueleto';
// Importa otros componentes si es necesario

interface PlanningSchema {
  _id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  meta: string;
  semanas: number;
  tipo: 'Planificacion' | 'Plantilla';
  esqueleto?: string;
  cliente: {
    _id: string;
    nombre: string;
    email: string;
  };
  trainer: {
    _id: string;
    nombre: string;
    email: string;
  };
  plan: any[];
  createdAt: string;
  updatedAt: string;
}

interface EsqueletoDetails {
  _id: string;
  nombre: string;
  descripcion: string;
  semanas: number;
  plan: any[];
}

const PlanningList: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
  const [isFormulasModalOpen, setIsFormulasModalOpen] = useState(false);
  const [isEsqueletoModalOpen, setIsEsqueletoModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    tipo: 'todos',
    estado: 'todos',
    meta: 'todos',
    duracion: 'todos'
  });

  // Estados para planificaciones, carga y errores
  const [planningData, setPlanningData] = useState<PlanningSchema[]>([]);
  const [esqueletoDetails, setEsqueletoDetails] = useState<{ [key: string]: EsqueletoDetails }>({});
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
  const renderCell = (key: string, value: any, item: any) => {
    switch (key) {
      case 'tipo':
        return (
          <span className={`px-2 py-1 rounded-full text-sm ${
            value === 'Planificacion' 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
          }`}>
            {value}
          </span>
        );
      case 'estado':
        return (
          <span className={`px-2 py-1 rounded-full text-sm ${
            value === 'Activo' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
          }`}>
            {value}
          </span>
        );
      case 'completado':
        return (
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: value }}
            ></div>
          </div>
        );
      case 'esqueleto':
        if (!value) {
          return (
            <span className="text-gray-500 dark:text-gray-400">
              Sin esqueleto
            </span>
          );
        }
        const esqueletoDetail = esqueletoDetails[value];
        return (
          <span className="text-blue-600 dark:text-blue-400">
            {esqueletoDetail ? esqueletoDetail.nombre : 'Cargando...'}
          </span>
        );
      case 'acciones':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => {
                if (item.tipo === 'Plantilla') {
                  navigate(`/plantilla/${item._id}`);
                } else {
                  navigate(`/edit-planning/${item._id}`);
                }
              }}
              className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              title="Editar planificación"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setSelectedItemId(item._id);
                setIsEsqueletoModalOpen(true);
              }}
              className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
              title={item.esqueleto ? "Modificar Esqueleto" : "Asignar Esqueleto"}
            >
              <FileText className="w-5 h-5" />
            </button>
          </div>
        );
      default:
        return value;
    }
  };

  // Función para obtener las planificaciones
  const fetchPlannings = async () => {
    console.log('Fetching plannings...');
    setLoading(true);
    setError(null);
    try {
      // Obtener el token JWT
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Realizar ambas peticiones en paralelo
      const [planningsResponse, templatesResponse] = await Promise.all([
        fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/plannings/schemas', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/planningtemplate/templates', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
      ]);

      if (!planningsResponse.ok) {
        const errorData = await planningsResponse.json();
        throw new Error(errorData.mensaje || 'Error al obtener las planificaciones');
      }

      if (!templatesResponse.ok) {
        const errorData = await templatesResponse.json();
        throw new Error(errorData.mensaje || 'Error al obtener las plantillas');
      }

      const planningsData = await planningsResponse.json();
      const templatesData = await templatesResponse.json();

      console.log('Plannings Data:', planningsData);

      // Procesar datos de planificaciones
      const processedPlannings = planningsData.map((planning: any) => ({
        _id: planning._id,
        nombre: planning.nombre,
        descripcion: planning.descripcion,
        duracion: `${planning.semanas} semanas`,
        fechaInicio: new Date(planning.fechaInicio).toLocaleDateString(),
        meta: planning.meta,
        tipo: planning.tipo || 'Planificacion',
        esqueleto: planning.esqueleto,
        clientesAsociados: 1,
        estado: 'En progreso',
        completado: '65%',
        acciones: 'Editar'
      }));

      console.log('Processed Plannings:', processedPlannings);

      // Procesar datos de plantillas
      const processedTemplates = templatesData.map((template: any) => ({
        _id: template._id,
        nombre: template.nombre,
        descripcion: template.descripcion,
        duracion: `${template.totalWeeks} semanas`,
        fechaInicio: new Date(template.createdAt).toLocaleDateString(),
        meta: template.category,
        tipo: 'Plantilla',
        esqueleto: template.esqueleto,
        clientesAsociados: template.assignedClients?.length || 0,
        estado: template.isActive ? 'Activo' : 'Inactivo',
        completado: '100%',
        acciones: 'Editar'
      }));

      // Combinar ambos conjuntos de datos
      setPlanningData([...processedPlannings, ...processedTemplates]);
    } catch (err: any) {
      console.error('Error al obtener las planificaciones:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEsqueletoDetails = async (esqueletoId: string) => {
    console.log('Fetching esqueleto details for ID:', esqueletoId);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/esqueleto/esqueletos/${esqueletoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los detalles del esqueleto');
      }

      const esqueletoData = await response.json();
      console.log('Esqueleto data received:', esqueletoData);
      setEsqueletoDetails(prev => ({
        ...prev,
        [esqueletoId]: esqueletoData
      }));
    } catch (error) {
      console.error('Error al obtener detalles del esqueleto:', error);
    }
  };

  useEffect(() => {
    console.log('Current planningData:', planningData);
    const fetchEsqueletosForPlannings = async () => {
      const esqueletoIds = planningData
        .map(planning => planning.esqueleto)
        .filter((id): id is string => typeof id === 'string');

      console.log('Filtered esqueleto IDs:', esqueletoIds);
      const uniqueEsqueletoIds = [...new Set(esqueletoIds)];
      console.log('Unique esqueleto IDs:', uniqueEsqueletoIds);

      for (const esqueletoId of uniqueEsqueletoIds) {
        if (!esqueletoDetails[esqueletoId]) {
          await fetchEsqueletoDetails(esqueletoId);
        }
      }
    };

    fetchEsqueletosForPlannings();
  }, [planningData]);

  const handleCrearEsqueleto = async (updatedPlanning: any) => {
    console.log('Creating esqueleto for planning:', updatedPlanning);
    try {
      // Actualizar la lista de planificaciones con el esqueleto asignado
      setPlanningData(prevData => 
        prevData.map(item => 
          item._id === updatedPlanning._id 
            ? { ...item, esqueleto: updatedPlanning.esqueleto }
            : item
        )
      );
      setIsEsqueletoModalOpen(false);
    } catch (error) {
      console.error('Error al actualizar la planificación:', error);
    }
  };

  // useEffect para obtener las planificaciones al montar el componente
  useEffect(() => {
    fetchPlannings();
  }, []);

  const [selectedItemId, setSelectedItemId] = useState('');

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
          <Button variant="normal" onClick={() => setIsFilesModalOpen(true)}>
            <FileText className="w-5 h-5 mr-2" />
            Ver Archivos
          </Button>
          <Button variant="normal" onClick={() => setIsEsqueletoModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Crear Fórmula
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
        <div className="relative">
          <Button 
            variant="filter" 
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="relative"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filtros
            {activeFilters.tipo !== 'todos' || activeFilters.estado !== 'todos' || activeFilters.meta !== 'todos' || activeFilters.duracion !== 'todos' ? (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
            ) : null}
          </Button>
          
          {isFilterDropdownOpen && (
            <div className={`absolute right-0 mt-2 w-64 rounded-md shadow-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-white'
            } ring-1 ring-black ring-opacity-5 z-50`}>
              <div className="py-1" role="menu" aria-orientation="vertical">
                {/* Filtro por Tipo */}
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Tipo de Planificación
                </div>
                <button
                  className={`${
                    theme === 'dark' ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                  } group flex items-center w-full px-4 py-2 text-sm ${activeFilters.tipo === 'todos' ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                  onClick={() => {
                    setActiveFilters(prev => ({ ...prev, tipo: 'todos' }));
                  }}
                >
                  Todos
                </button>
                <button
                  className={`${
                    theme === 'dark' ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                  } group flex items-center w-full px-4 py-2 text-sm ${activeFilters.tipo === 'planificacion' ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                  onClick={() => {
                    setActiveFilters(prev => ({ ...prev, tipo: 'planificacion' }));
                  }}
                >
                  Planificación
                </button>
                <button
                  className={`${
                    theme === 'dark' ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                  } group flex items-center w-full px-4 py-2 text-sm ${activeFilters.tipo === 'plantilla' ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                  onClick={() => {
                    setActiveFilters(prev => ({ ...prev, tipo: 'plantilla' }));
                  }}
                >
                  Plantilla
                </button>

                {/* Filtro por Estado */}
                <div className="border-t border-gray-200 dark:border-gray-600 mt-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Estado
                  </div>
                  <button
                    className={`${
                      theme === 'dark' ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                    } group flex items-center w-full px-4 py-2 text-sm ${activeFilters.estado === 'todos' ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                    onClick={() => {
                      setActiveFilters(prev => ({ ...prev, estado: 'todos' }));
                    }}
                  >
                    Todos
                  </button>
                  <button
                    className={`${
                      theme === 'dark' ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                    } group flex items-center w-full px-4 py-2 text-sm ${activeFilters.estado === 'activo' ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                    onClick={() => {
                      setActiveFilters(prev => ({ ...prev, estado: 'activo' }));
                    }}
                  >
                    Activo
                  </button>
                  <button
                    className={`${
                      theme === 'dark' ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                    } group flex items-center w-full px-4 py-2 text-sm ${activeFilters.estado === 'completado' ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                    onClick={() => {
                      setActiveFilters(prev => ({ ...prev, estado: 'completado' }));
                    }}
                  >
                    Completado
                  </button>
                </div>

                {/* Filtro por Meta */}
                <div className="border-t border-gray-200 dark:border-gray-600 mt-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Meta
                  </div>
                  <button
                    className={`${
                      theme === 'dark' ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                    } group flex items-center w-full px-4 py-2 text-sm ${activeFilters.meta === 'todos' ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                    onClick={() => {
                      setActiveFilters(prev => ({ ...prev, meta: 'todos' }));
                    }}
                  >
                    Todas
                  </button>
                  <button
                    className={`${
                      theme === 'dark' ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                    } group flex items-center w-full px-4 py-2 text-sm ${activeFilters.meta === 'fuerza' ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                    onClick={() => {
                      setActiveFilters(prev => ({ ...prev, meta: 'fuerza' }));
                    }}
                  >
                    Aumentar Fuerza
                  </button>
                  <button
                    className={`${
                      theme === 'dark' ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                    } group flex items-center w-full px-4 py-2 text-sm ${activeFilters.meta === 'peso' ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                    onClick={() => {
                      setActiveFilters(prev => ({ ...prev, meta: 'peso' }));
                    }}
                  >
                    Pérdida de Peso
                  </button>
                </div>

                {/* Filtro por Duración */}
                <div className="border-t border-gray-200 dark:border-gray-600 mt-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Duración
                  </div>
                  <button
                    className={`${
                      theme === 'dark' ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                    } group flex items-center w-full px-4 py-2 text-sm ${activeFilters.duracion === 'todos' ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                    onClick={() => {
                      setActiveFilters(prev => ({ ...prev, duracion: 'todos' }));
                    }}
                  >
                    Todas
                  </button>
                  <button
                    className={`${
                      theme === 'dark' ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                    } group flex items-center w-full px-4 py-2 text-sm ${activeFilters.duracion === 'corta' ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                    onClick={() => {
                      setActiveFilters(prev => ({ ...prev, duracion: 'corta' }));
                    }}
                  >
                    1-4 Semanas
                  </button>
                  <button
                    className={`${
                      theme === 'dark' ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                    } group flex items-center w-full px-4 py-2 text-sm ${activeFilters.duracion === 'media' ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                    onClick={() => {
                      setActiveFilters(prev => ({ ...prev, duracion: 'media' }));
                    }}
                  >
                    5-12 Semanas
                  </button>
                  <button
                    className={`${
                      theme === 'dark' ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                    } group flex items-center w-full px-4 py-2 text-sm ${activeFilters.duracion === 'larga' ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                    onClick={() => {
                      setActiveFilters(prev => ({ ...prev, duracion: 'larga' }));
                    }}
                  >
                    +12 Semanas
                  </button>
                </div>

                {/* Botón para limpiar filtros */}
                <div className="border-t border-gray-200 dark:border-gray-600 mt-2 p-2">
                  <button
                    className="w-full px-4 py-2 text-sm text-center text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                    onClick={() => {
                      setActiveFilters({
                        tipo: 'todos',
                        estado: 'todos',
                        meta: 'todos',
                        duracion: 'todos'
                      });
                      setIsFilterDropdownOpen(false);
                    }}
                  >
                    Limpiar Filtros
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
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
              'Tipo',
              'Clientes',
              'Estado',
              'Completado',
              'Esqueleto',
              'Acciones',
            ]}
            data={planningData
              .filter((item) => {
                // Aplicar filtro de búsqueda
                const matchesSearch = searchTerm === '' || 
                  item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.meta.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.estado.toLowerCase().includes(searchTerm.toLowerCase());

                // Aplicar filtros múltiples
                const matchesTipo = activeFilters.tipo === 'todos' || 
                  (activeFilters.tipo === 'planificacion' && item.tipo === 'Planificacion') ||
                  (activeFilters.tipo === 'plantilla' && item.tipo === 'Plantilla');

                const matchesEstado = activeFilters.estado === 'todos' || 
                  item.estado.toLowerCase() === activeFilters.estado;

                const matchesMeta = activeFilters.meta === 'todos' || 
                  (activeFilters.meta === 'fuerza' && item.meta.toLowerCase().includes('fuerza')) ||
                  (activeFilters.meta === 'peso' && item.meta.toLowerCase().includes('peso'));

                const semanas = parseInt(item.duracion);
                const matchesDuracion = activeFilters.duracion === 'todos' || 
                  (activeFilters.duracion === 'corta' && semanas <= 4) ||
                  (activeFilters.duracion === 'media' && semanas > 4 && semanas <= 12) ||
                  (activeFilters.duracion === 'larga' && semanas > 12);

                return matchesSearch && matchesTipo && matchesEstado && matchesMeta && matchesDuracion;
              })
              .map((item) => ({
                nombre: item.nombre,
                descripcion: item.descripcion,
                duracion: item.duracion,
                fechaInicio: item.fechaInicio,
                meta: item.meta,
                tipo: renderCell('tipo', item.tipo, item),
                clientesAsociados: renderCell('clientesAsociados', item.clientesAsociados, item),
                estado: renderCell('estado', item.estado, item),
                completado: renderCell('completado', item.completado, item),
                esqueleto: renderCell('esqueleto', item.esqueleto, item),
                acciones: renderCell('acciones', item.acciones, { ...item, _id: item._id }),
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

      {/* Modal para Crear Esqueleto */}
      <AnimatePresence>
        {isEsqueletoModalOpen && (
          <motion.div
            key="modal-asignar-esqueleto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <PopupCrearEsqueleto
              onClose={() => setIsEsqueletoModalOpen(false)}
              onCrear={handleCrearEsqueleto}
              planningId={selectedItemId}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanningList;
