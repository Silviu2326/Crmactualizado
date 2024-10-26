import React, { useState } from 'react';
import { Search, X, Plus, Filter, Download, Users, Calendar, Clock, Target } from 'lucide-react';
import Button from '../Common/Button';
import Table from '../Common/Table';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const ClassList: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const classData = [
    {
      nombre: 'Yoga Matutino',
      descripcion: 'Clase de yoga para comenzar el día con energía',
      clientes: 12,
      maxParticipantes: 15,
      sesiones: '3/semana',
      acciones: 'Editar'
    },
    {
      nombre: 'CrossFit Intensivo',
      descripcion: 'Entrenamiento funcional de alta intensidad',
      clientes: 8,
      maxParticipantes: 10,
      sesiones: '5/semana',
      acciones: 'Editar'
    },
    {
      nombre: 'Pilates Terapéutico',
      descripcion: 'Pilates enfocado en rehabilitación y postura',
      clientes: 6,
      maxParticipantes: 8,
      sesiones: '2/semana',
      acciones: 'Editar'
    }
  ];

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

  const renderCell = (key: string, value: any) => {
    switch (key) {
      case 'clientes':
        return (
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{value}</span>
          </div>
        );
      case 'maxParticipantes':
        return (
          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
            Máx. {value}
          </span>
        );
      case 'sesiones':
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-green-500" />
            <span className="font-medium">{value}</span>
          </div>
        );
      default:
        return value;
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
          Gestión de Clases
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

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        <Table
          headers={['Nombre', 'Descripción', 'Clientes', 'Máx. Participantes', 'Sesiones', 'Acciones']}
          data={classData.map(item => ({
            ...item,
            ...Object.fromEntries(
              Object.entries(item).map(([key, value]) => [key, renderCell(key, value)])
            )
          }))}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-2xl`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Crear Nueva Clase</h3>
                <Button variant="normal" onClick={() => setIsModalOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              {/* Aquí iría el formulario */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassList;