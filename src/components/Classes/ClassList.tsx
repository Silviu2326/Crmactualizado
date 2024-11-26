// src/components/ClassList/ClassList.tsx

import React, { useState, useEffect } from 'react';  
import { Search, X, Plus, Filter, Download, Users, Calendar, Clock, Target, Edit, Trash } from 'lucide-react';
import Button from '../Common/Button';
import Table from '../Common/Table';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CrearClasePopup from './CrearClasePopup'; // Asegúrate de la ruta correcta

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
  const [classData, setClassData] = useState<ClaseGrupal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener el token del localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ClaseGrupal[]>(
          'http://localhost:3000/api/servicios/services/tipo/ClaseGrupal',
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
  }, [token]);

  // Función para actualizar la lista después de crear una nueva clase
  const refreshClassData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ClaseGrupal[]>(
        'http://localhost:3000/api/servicios/services/tipo/ClaseGrupal',
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
    clientes: item.clientes.length, // Asumiendo que 'clientes' es un array
    maxParticipantes: 15, // Puedes ajustar esto según tus datos
    sesiones: item.sesiones.length > 0 ? `${item.sesiones.length}/semana` : 'N/A', // Ajusta según la estructura de 'sesiones'
    acciones: 'Editar'
  }));

  const filteredClassData = transformedClassData.filter(item =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statsCards = [
    {
      icon: Users,
      title: "Clientes Activos",
      value: "156",
      color: "bg-blue-500"
    },
    {
      icon: Calendar,
      title: "Clases Semanales",
      value: "24",
      color: "bg-purple-500"
    },
    {
      icon: Clock,
      title: "Horas Impartidas",
      value: "96h",
      color: "bg-green-500"
    },
    {
      icon: Target,
      title: "Ocupación Media",
      value: "85%",
      color: "bg-amber-500"
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
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${porcentaje}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
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
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`${
                theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
              } transition-colors duration-150`}
              onClick={() => handleEdit(row.id)} // Define esta función según tus necesidades
            >
              <Edit className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`${
                theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
              } transition-colors duration-150`}
              onClick={() => handleDelete(row.id)} // Define esta función según tus necesidades
            >
              <Trash className="w-5 h-5" />
            </motion.button>
          </div>
        );
      default:
        return value;
    }
  };

  // Funciones de manejo para acciones (editar y eliminar)
  const handleEdit = (id: string) => {
    // Implementa la lógica para editar la clase con el id proporcionado
    console.log(`Editar clase con id: ${id}`);
    // Por ejemplo, abrir el modal y cargar los datos de la clase
  };

  const handleDelete = async (id: string) => {
    // Implementa la lógica para eliminar la clase con el id proporcionado
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta clase?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/servicios/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
          Lista de Clases Grupales
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Administra y organiza las clases grupales de tu centro
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
            className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} p-4 rounded-lg shadow-lg`}
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
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="flex space-x-2">
          <Button variant="create" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Crear Clase
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
            placeholder="Buscar clases..."
            className={`w-full px-4 py-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
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

      {loading ? (
        <div className="text-center py-10">
          <p>Cargando clases...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg shadow-lg overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
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
        </motion.div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <CrearClasePopup 
            onClose={() => setIsModalOpen(false)} 
            onCreate={refreshClassData} // Actualizar la lista después de crear
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassList;
