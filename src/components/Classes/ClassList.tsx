// src/components/ClassList/ClassList.tsx

import React, { useState, useEffect } from 'react';  
import { Search, X, Plus, Filter, Download, Users, Calendar, Clock, Target, Edit, Trash } from 'lucide-react';
import Button from '../Common/Button';
import Table from '../Common/Table';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CrearClasePopup from './CrearClasePopup';
import EditarClasePopup from './EditarClasePopup';

interface Entrenador {
  _id: string;
  nombre: string;
  email: string;
  // otros campos que necesites
}

interface PlanDePago {
  _id: string;
  precio: number;
  moneda: string;
  frecuencia: string;
  detalles: string;
  stripeProductId: string;
  stripePriceId: string;
  servicio: string;
  clientes: string[];
  fechaCreacion: string;
  __v: number;
}

interface ClaseGrupal {
  _id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  entrenador: Entrenador;
  clientes: any[]; // Ajusta el tipo según tus necesidades
  serviciosAdicionales: any[]; // Ajusta el tipo según tus necesidades
  sesiones: any[]; // Ajusta el tipo según tus necesidades
  fechaCreacion: string;
  __v: number;
  planDePago: PlanDePago[];
}

const ClassList: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [classData, setClassData] = useState<ClaseGrupal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    capacity: 'all',
    sessions: 'all',
    trainer: 'all'
  });

  // Estilos base
  const styles = {
    container: `p-6 relative ${
      theme === 'dark'
        ? 'bg-gray-900 text-white'
        : 'bg-white text-gray-800'
    }`,
    title: 'text-3xl font-bold mb-2 flex items-center gap-3',
    statsCard: `${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg 
      transform transition-all duration-300 hover:scale-105 hover:shadow-xl`,
  };

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ClaseGrupal[]>(
          'https://fitoffice2-f70b52bef77e.herokuapp.com/api/servicios/services/tipo/ClaseGrupal',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setClassData(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error al obtener las clases:', err);
        setError('No se pudieron cargar las clases. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchClassData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isFilterOpen && !target.closest('.filter-dropdown')) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]);

  // Función para actualizar la lista después de crear una nueva clase
  const refreshClassData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ClaseGrupal[]>(
        'https://fitoffice2-f70b52bef77e.herokuapp.com/api/servicios/services/tipo/ClaseGrupal',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setClassData(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error al actualizar las clases:', err);
      setError('No se pudieron actualizar las clases. Por favor, intenta de nuevo más tarde.');
      setLoading(false);
    }
  };

  // Transformar los datos recibidos para adaptarlos al formato esperado por la tabla
  const transformedClassData = classData.map(item => ({
    id: item._id,
    nombre: item.nombre,
    descripcion: item.descripcion,
    clientes: item.clientes.length,
    maxParticipantes: 15,
    sesiones: item.sesiones.length > 0 ? `${item.sesiones.length}/semana` : 'N/A',
    acciones: 'Editar'
  }));

  const filteredClassData = transformedClassData.filter(item => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCapacity = filters.capacity === 'all' ? true :
      filters.capacity === 'available' ? item.clientes < item.maxParticipantes :
      item.clientes >= item.maxParticipantes;

    const matchesSessions = filters.sessions === 'all' ? true :
      filters.sessions === '1-2' ? parseInt(item.sesiones) <= 2 :
      filters.sessions === '3-4' ? (parseInt(item.sesiones) >= 3 && parseInt(item.sesiones) <= 4) :
      parseInt(item.sesiones) >= 5;

    const matchesTrainer = filters.trainer === 'all' ? true : true; // TODO: Implementar filtro de entrenador cuando tengamos los datos

    return matchesSearch && matchesCapacity && matchesSessions && matchesTrainer;
  });

  const statsCards = [
    {
      icon: Users,
      title: "Clases Activas",
      value: "156",
      color: "bg-red-500"
    },
    {
      icon: Calendar,
      title: "Clases Semanales",
      value: "24",
      color: "bg-green-500"
    },
    {
      icon: Clock,
      title: "Horas Impartidas",
      value: "96h",
      color: "bg-yellow-500"
    },
    {
      icon: Target,
      title: "Ocupación Media",
      value: "85%",
      color: "bg-green-600"
    }
  ];

  const renderCell = (key: string, value: any, row: any) => {
    switch (key) {
      case 'clientes':
        return (
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{value}</span>
          </div>
        );
      case 'capacidad':
        const porcentaje = (row.clientes / row.maxParticipantes) * 100;
        return (
          <div className="flex flex-col space-y-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {row.clientes}/{row.maxParticipantes} participantes
            </div>
            <div className="w-48">
              <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>
          </div>
        );
      case 'sesiones':
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-green-500" />
            <span className="font-medium">{value}</span>
          </div>
        );
      case 'acciones':
        return (
          <div className="flex space-x-2">
            <button
              className={`${
                theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
              } transition-colors duration-150`}
              onClick={() => handleEdit(row.id)} // Define esta función según tus necesidades
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              className={`${
                theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
              } transition-colors duration-150`}
              onClick={() => handleDelete(row.id)} // Define esta función según tus necesidades
            >
              <Trash className="w-5 h-5" />
            </button>
          </div>
        );
      default:
        return value;
    }
  };

  // Funciones de manejo para acciones (editar y eliminar)
  const handleEdit = (id: string) => {
    setSelectedClassId(id);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    // Implementa la lógica para eliminar la clase con el id proporcionado
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta clase?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/servicios/services/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(`✅ Clase con id ${id} eliminada.`);
      refreshClassData(); // Actualizar la lista después de eliminar
    } catch (err: any) {
      console.error('❌ Error al eliminar la clase:', err);
      setError('No se pudo eliminar la clase. Por favor, intenta de nuevo más tarde.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Lista de Clases Grupales
      </h2>
      <div className="flex items-center justify-between">
        <p className="text-gray-500 dark:text-gray-400">
          Administra y organiza las clases grupales de tu negocio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((card, index) => (
          <div
            key={card.title}
            className={styles.statsCard}
          >
            <div className="flex items-center space-x-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500 dark:text-gray-400">{card.title}</h3>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <Button variant="create" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Nueva Clase
          </Button>
          <Button variant="normal">
            <Download className="w-5 h-5 mr-2" />
            Exportar
          </Button>
        </div>
        <div className="relative">
          <Button 
            variant="filter" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="w-5 h-5 mr-2" />
            Filtros
          </Button>
          {isFilterOpen && (
            <div className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-white'
            } z-50 filter-dropdown`}>
              <div className="p-4">
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Capacidad
                  </label>
                  <select
                    value={filters.capacity}
                    onChange={(e) => setFilters(prev => ({ ...prev, capacity: e.target.value }))}
                    className={`w-full p-2 rounded ${
                      theme === 'dark' ? 'bg-gray-600 text-white border-gray-600' : 'bg-gray-100 border-gray-300'
                    } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="all">Todas</option>
                    <option value="available">Con cupo</option>
                    <option value="full">Llenas</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Sesiones
                  </label>
                  <select
                    value={filters.sessions}
                    onChange={(e) => setFilters(prev => ({ ...prev, sessions: e.target.value }))}
                    className={`w-full p-2 rounded ${
                      theme === 'dark' ? 'bg-gray-600 text-white border-gray-600' : 'bg-gray-100 border-gray-300'
                    } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="all">Todas</option>
                    <option value="1-2">1-2 por semana</option>
                    <option value="3-4">3-4 por semana</option>
                    <option value="5+">5+ por semana</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Entrenador
                  </label>
                  <select
                    value={filters.trainer}
                    onChange={(e) => setFilters(prev => ({ ...prev, trainer: e.target.value }))}
                    className={`w-full p-2 rounded ${
                      theme === 'dark' ? 'bg-gray-600 text-white border-gray-600' : 'bg-gray-100 border-gray-300'
                    } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="all">Todos</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6 flex space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar clases..."
            className={`w-full px-4 py-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-3 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p>Cargando clases...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <div className={`rounded-lg shadow-lg overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Table
            headers={['Nombre', 'Descripción', 'Clientes', 'Capacidad', 'Sesiones', 'Acciones']}
            data={filteredClassData.map(item => ({
              nombre: item.nombre,
              descripcion: item.descripcion,
              clientes: renderCell('clientes', item.clientes, item),
              capacidad: renderCell('capacidad', null, item),
              sesiones: renderCell('sesiones', item.sesiones, item),
              acciones: renderCell('acciones', null, item)
            }))}
            variant={theme === 'dark' ? 'dark' : 'white'}
          />
        </div>
      )}

      {/* Popups */}
      {isModalOpen && (
        <CrearClasePopup
          onClose={() => setIsModalOpen(false)}
          onCreate={refreshClassData}
        />
      )}
      
      {isEditModalOpen && selectedClassId && (
        <EditarClasePopup
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedClassId(null);
          }}
          onEdit={refreshClassData}
          claseId={selectedClassId}
        />
      )}
    </div>
  );
};

export default ClassList;
