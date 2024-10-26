import React, { useState } from 'react';
import { Search, X, Plus, Filter, Download, Dumbbell, Target, Clock, Users, Calendar, TrendingUp } from 'lucide-react';
import Button from '../Common/Button';
import Table from '../common/Table';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const WorkoutList: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateAIModalOpen, setIsCreateAIModalOpen] = useState(false);

  const routinesData = [
    { 
      nombre: 'Rutina de Fuerza', 
      tipo: 'Fuerza', 
      nivel: 'Intermedio', 
      duracion: '60 min', 
      frecuencia: '3x/semana',
      estado: 'Activa',
      progreso: '75%',
      acciones: 'Editar' 
    },
    { 
      nombre: 'Cardio HIIT', 
      tipo: 'Cardio', 
      nivel: 'Avanzado', 
      duracion: '30 min', 
      frecuencia: '4x/semana',
      estado: 'Pendiente',
      progreso: '30%',
      acciones: 'Editar' 
    },
    { 
      nombre: 'Yoga para principiantes', 
      tipo: 'Flexibilidad', 
      nivel: 'Principiante', 
      duracion: '45 min', 
      frecuencia: '2x/semana',
      estado: 'Completada',
      progreso: '100%',
      acciones: 'Editar' 
    },
  ];

  const statsCards = [
    { 
      icon: Dumbbell,
      title: "Rutinas Activas",
      value: "24",
      color: "bg-blue-500"
    },
    {
      icon: Target,
      title: "Objetivos Cumplidos",
      value: "85%",
      color: "bg-purple-500"
    },
    {
      icon: Clock,
      title: "Tiempo Total",
      value: "1,240h",
      color: "bg-green-500"
    },
    {
      icon: Users,
      title: "Clientes Asignados",
      value: "89",
      color: "bg-amber-500"
    }
  ];

  const renderCell = (key: string, value: any) => {
    switch (key) {
      case 'tipo':
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            value === 'Fuerza' ? 'bg-purple-100 text-purple-800' :
            value === 'Cardio' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {value}
          </span>
        );
      case 'nivel':
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            value === 'Principiante' ? 'bg-green-100 text-green-800' :
            value === 'Intermedio' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {value}
          </span>
        );
      case 'estado':
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            value === 'Activa' ? 'bg-emerald-100 text-emerald-800' :
            value === 'Pendiente' ? 'bg-amber-100 text-amber-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {value}
          </span>
        );
      case 'progreso':
        return (
          <div className="flex items-center space-x-2">
            <div className="flex-grow bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className={`h-2.5 rounded-full ${
                  parseInt(value) === 100 ? 'bg-green-600' :
                  parseInt(value) > 50 ? 'bg-blue-600' :
                  'bg-amber-600'
                }`}
                style={{ width: value }}
              ></div>
            </div>
            <span className="text-sm font-medium">{value}</span>
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
          Rutinas de Entrenamiento
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Crea y gestiona rutinas personalizadas para tus clientes
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
          <Button variant="create" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Crear Rutina
          </Button>
          <Button variant="normal" onClick={() => setIsCreateAIModalOpen(true)}>
            <TrendingUp className="w-5 h-5 mr-2" />
            Crear con IA
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
            placeholder="Buscar rutinas..."
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
          headers={['Nombre', 'Tipo', 'Nivel', 'Duración', 'Frecuencia', 'Estado', 'Progreso', 'Acciones']}
          data={routinesData.map(item => ({
            ...item,
            ...Object.fromEntries(
              Object.entries(item).map(([key, value]) => [key, renderCell(key, value)])
            )
          }))}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      </motion.div>
    </div>
  );
};

export default WorkoutList;