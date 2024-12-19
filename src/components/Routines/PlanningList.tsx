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
  Trash2,
  Check,
} from 'lucide-react';
import Button from '../Common/Button';
import Table from '../Common/Table';
import { useTheme } from '../../contexts/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import PopupCrearPlanificacion from './PopupCrearPlanificacion';
import PopupCrearEsqueleto from './PopupCrearEsqueleto';
import ArchivosplanificacionesComponent from './ArchivosplanificacionesComponent'; // Importar el nuevo componente
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
  const [selectedPlannings, setSelectedPlannings] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
  const [isFormulasModalOpen, setIsFormulasModalOpen] = useState(false);
  const [isEsqueletoModalOpen, setIsEsqueletoModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('todos');
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
            <button
              onClick={() => {
                if (window.confirm('¿Estás seguro de que deseas eliminar esta planificación?')) {
                  deletePlanning(item._id);
                }
              }}
              className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
              title="Eliminar planificación"
            >
              <Trash2 className="w-5 h-5" />
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
        fetch('http://localhost:3000/api/plannings/schemas', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch('http://localhost:3000/api/planningtemplate/templates', {
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

      console.log('Raw Planning Data:', planningsData.map((p: any) => ({ id: p._id, semanas: p.semanas })));
      console.log('Plannings Data:', planningsData);

      // Procesar datos de planificaciones
      const processedPlannings = planningsData.map((planning: any) => {
        // Normalizar la meta para que coincida con nuestros filtros
        const normalizeMeta = (meta: string) => {
          if (!meta) return 'No especificada';
          const metaLower = meta.toLowerCase();
          if (metaLower.includes('fuerza')) return 'Fuerza';
          if (metaLower.includes('peso') || metaLower.includes('adelgazar')) return 'Pérdida de Peso';
          return meta;
        };

        // Asegurarse de que semanas sea un número
        const semanas = typeof planning.semanas === 'number' ? planning.semanas : 
                       typeof planning.semanas === 'string' ? parseInt(planning.semanas) : 0;

        return {
          _id: planning._id,
          nombre: planning.nombre,
          descripcion: planning.descripcion,
          duracion: `${semanas} semanas`,
          fechaInicio: new Date(planning.fechaInicio).toLocaleDateString(),
          meta: normalizeMeta(planning.meta),
          tipo: planning.tipo || 'Planificacion',
          esqueleto: planning.esqueleto,
          clientesAsociados: 1,
          estado: 'En progreso',
          completado: '65%',
          acciones: 'Editar',
          semanas: semanas // Añadimos el campo semanas al objeto procesado
        };
      });

      // Procesar datos de plantillas
      const processedTemplates = templatesData.map((template: any) => {
        // Usar la misma función de normalización para las plantillas
        const normalizeMeta = (meta: string) => {
          if (!meta) return 'No especificada';
          const metaLower = meta.toLowerCase();
          if (metaLower.includes('fuerza')) return 'Fuerza';
          if (metaLower.includes('peso') || metaLower.includes('adelgazar')) return 'Pérdida de Peso';
          return meta;
        };

        return {
          _id: template._id,
          nombre: template.nombre,
          descripcion: template.descripcion,
          duracion: `${template.totalWeeks} semanas`,
          fechaInicio: new Date(template.createdAt).toLocaleDateString(),
          meta: normalizeMeta(template.category),
          tipo: 'Plantilla',
          esqueleto: template.esqueleto,
          clientesAsociados: template.assignedClients?.length || 0,
          estado: template.isActive ? 'Activo' : 'Inactivo',
          completado: '100%',
          acciones: 'Editar'
        };
      });

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

      const response = await fetch(`http://localhost:3000/api/esqueleto/${esqueletoId}`, {
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

  // Mock API para eliminar planificación
  const deletePlanning = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Simular llamada a API
      const response = await fetch(`https://api.ejemplo.com/plannings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la planificación');
      }

      // Actualizar la lista después de eliminar
      fetchPlannings();
    } catch (error) {
      console.error('Error:', error);
      setError('Error al eliminar la planificación');
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

  const handleExportClick = () => {
    setSelectMode(true);
  };

  const handleCheckboxChange = (planningId: string) => {
    setSelectedPlannings(prev => {
      if (prev.includes(planningId)) {
        return prev.filter(id => id !== planningId);
      } else {
        return [...prev, planningId];
      }
    });
  };

  const handleExportSelected = () => {
    // Aquí implementar la lógica de exportación
    console.log('Planificaciones seleccionadas:', selectedPlannings);
    setSelectMode(false);
    setSelectedPlannings([]);
  };

  // useEffect para obtener las planificaciones al montar el componente
  useEffect(() => {
    fetchPlannings();
  }, []);

  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedPlanningId, setSelectedPlanningId] = useState<string | null>(null);

  const handleOpenFiles = (planningId: string) => {
    setSelectedPlanningId(planningId);
    setIsFilesModalOpen(true);
  };

  const filteredPlannings = planningData
    .filter((item) => {
      const searchString = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm
        || item.nombre.toLowerCase().includes(searchString)
        || item.descripcion.toLowerCase().includes(searchString)
        || item.meta.toLowerCase().includes(searchString);

      const matchesTipo = activeFilters.tipo === 'todos' || item.tipo === activeFilters.tipo;
      const matchesEstado = activeFilters.estado === 'todos' || item.estado === activeFilters.estado;
      const matchesMeta = activeFilters.meta === 'todos' || item.meta === activeFilters.meta;
      const matchesDuracion = activeFilters.duracion === 'todos' || item.semanas.toString() === activeFilters.duracion;

      return matchesSearch && matchesTipo && matchesEstado && matchesMeta && matchesDuracion;
    }) || [];

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
          <Button variant="normal" onClick={() => handleOpenFiles(selectedItemId)}>
            <FileText className="w-5 h-5 mr-2" />
            Ver Archivos
          </Button>
          <Button variant="normal" onClick={() => setIsEsqueletoModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Crear Fórmula
          </Button>
          {!selectMode ? (
            <Button variant="normal" onClick={handleExportClick}>
              <Download className="w-5 h-5 mr-2" />
              Exportar
            </Button>
          ) : (
            <>
              <Button 
                variant="primary" 
                onClick={handleExportSelected}
                disabled={selectedPlannings.length === 0}
              >
                <Download className="w-5 h-5 mr-2" />
                Exportar Seleccionados ({selectedPlannings.length})
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => {
                  setSelectMode(false);
                  setSelectedPlannings([]);
                }}
              >
                <X className="w-5 h-5 mr-2" />
                Cancelar
              </Button>
            </>
          )}
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
            onClick={() => setIsFilterModalOpen(true)}
            className={`relative flex items-center px-4 py-2 rounded-lg ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-white hover:bg-gray-50 text-gray-700'
            } border border-gray-200 dark:border-gray-600 shadow-sm transition-all duration-200`}
          >
            <Filter className="w-5 h-5 mr-2" />
            Filtros
            {activeFilters.tipo !== 'todos' || activeFilters.estado !== 'todos' || activeFilters.meta !== 'todos' || activeFilters.duracion !== 'todos' ? (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-700" />
            ) : null}
          </Button>
        </div>
      </motion.div>

      {/* Modal de Filtros */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-lg max-h-[90vh] rounded-xl shadow-xl overflow-hidden ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Filtros de Búsqueda
                </h2>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className={`p-2 rounded-full transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              <div className="p-6 space-y-6">
                {/* Tipo de Planificación */}
                <div className="space-y-3">
                  <h3 className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Tipo de Planificación
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {['todos', 'planificacion', 'plantilla'].map((tipo) => (
                      <button
                        key={tipo}
                        onClick={() => setActiveFilters(prev => ({ ...prev, tipo }))}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          activeFilters.tipo === tipo
                            ? theme === 'dark'
                              ? 'bg-blue-900/50 text-blue-200 border border-blue-700'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                            : theme === 'dark'
                            ? 'text-white hover:bg-gray-700 border border-gray-700'
                            : 'text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {tipo === 'todos' ? 'Todos' : 
                         tipo === 'planificacion' ? 'Planificación' : 'Plantilla'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Estado */}
                <div className="space-y-3">
                  <h3 className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Estado
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {['todos', 'activo', 'completado'].map((estado) => (
                      <button
                        key={estado}
                        onClick={() => setActiveFilters(prev => ({ ...prev, estado }))}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          activeFilters.estado === estado
                            ? theme === 'dark'
                              ? 'bg-blue-900/50 text-blue-200 border border-blue-700'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                            : theme === 'dark'
                            ? 'text-white hover:bg-gray-700 border border-gray-700'
                            : 'text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {estado.charAt(0).toUpperCase() + estado.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meta */}
                <div className="space-y-3">
                  <h3 className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Meta
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {['todos', 'fuerza', 'peso'].map((meta) => (
                      <button
                        key={meta}
                        onClick={() => setActiveFilters(prev => ({ ...prev, meta }))}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          activeFilters.meta === meta
                            ? theme === 'dark'
                              ? 'bg-blue-900/50 text-blue-200 border border-blue-700'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                            : theme === 'dark'
                            ? 'text-white hover:bg-gray-700 border border-gray-700'
                            : 'text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {meta === 'todos' ? 'Todas' : 
                         meta === 'fuerza' ? 'Aumentar Fuerza' : 'Pérdida de Peso'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duración */}
                <div className="space-y-3">
                  <h3 className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Duración
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {['todos', 'corta', 'media', 'larga'].map((duracion) => (
                      <button
                        key={duracion}
                        onClick={() => setActiveFilters(prev => ({ ...prev, duracion }))}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          activeFilters.duracion === duracion
                            ? theme === 'dark'
                              ? 'bg-blue-900/50 text-blue-200 border border-blue-700'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                            : theme === 'dark'
                            ? 'text-white hover:bg-gray-700 border border-gray-700'
                            : 'text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {duracion === 'todos' ? 'Todas' : 
                         duracion === 'corta' ? '1-4 Semanas' :
                         duracion === 'media' ? '5-12 Semanas' : 'Más de 12 Semanas'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-6 border-t ${
              theme === 'dark' 
                ? 'border-gray-700 bg-gray-800' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setActiveFilters({
                      tipo: 'todos',
                      estado: 'todos',
                      meta: 'todos',
                      duracion: 'todos'
                    });
                    setIsFilterModalOpen(false);
                  }}
                  className={`px-6 py-2 ${
                    theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-white hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Limpiar Filtros
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

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
              ...(selectMode ? [''] : []),
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
              'Esqueleto',
            ]}
            data={filteredPlannings
              .map((item) => ({
                ...(selectMode ? {
                  checkbox: (
                    <input
                      type="checkbox"
                      checked={selectedPlannings.includes(item._id)}
                      onChange={() => handleCheckboxChange(item._id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  )
                } : {}),
                nombre: item.nombre,
                descripcion: item.descripcion,
                duracion: `${item.semanas} semanas`,
                fechaInicio: new Date(item.fechaInicio).toLocaleDateString(),
                meta: item.meta,
                tipo: renderCell('tipo', item.tipo, item),
                clientes: item.cliente?.nombre || 'Sin cliente',
                estado: renderCell('estado', item.estado, item),
                completado: renderCell('completado', item.completado, item),
                esqueleto: renderCell('esqueleto', item.esqueleto, item),
                acciones: (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenFiles(item._id)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
                      >
                        <path d="M12 3v18" />
                        <path d="M8 4.75a8 8 0 0 0 8 0" />
                        <path d="m7 3 1.5 1.5M17 3l-1.5 1.5" />
                        <path d="M8 8.75a8 8 0 0 0 8 0" />
                        <path d="m7 7 1.5 1.5M17 7l-1.5 1.5" />
                        <path d="M8 12.75a8 8 0 0 0 8 0" />
                        <path d="m7 11 1.5 1.5M17 11l-1.5 1.5" />
                        <path d="M8 16.75a8 8 0 0 0 8 0" />
                        <path d="m7 15 1.5 1.5M17 15l-1.5 1.5" />
                      </svg>
                    </button>
                  </div>
                ),
                esqueleto: (
                  <button
                    onClick={() => {
                      setSelectedItemId(item._id);
                      setIsEsqueletoModalOpen(true);
                    }}
                    className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                    title={item.esqueleto ? "Modificar Esqueleto" : "Asignar Esqueleto"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
                    >
                      <path d="M12 3v18" />
                      <path d="M8 4.75a8 8 0 0 0 8 0" />
                      <path d="m7 3 1.5 1.5M17 3l-1.5 1.5" />
                      <path d="M8 8.75a8 8 0 0 0 8 0" />
                      <path d="m7 7 1.5 1.5M17 7l-1.5 1.5" />
                      <path d="M8 12.75a8 8 0 0 0 8 0" />
                      <path d="m7 11 1.5 1.5M17 11l-1.5 1.5" />
                      <path d="M8 16.75a8 8 0 0 0 8 0" />
                      <path d="m7 15 1.5 1.5M17 15l-1.5 1.5" />
                    </svg>
                  </button>
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
          <ArchivosplanificacionesComponent
            onClose={() => setIsFilesModalOpen(false)}
            planningId={selectedPlanningId || undefined}
          />
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
