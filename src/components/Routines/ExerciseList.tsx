import React, { useState } from 'react';
import { Search, X, Plus, Filter, Download, Dumbbell, Target, Clock, Users, BarChart2 } from 'lucide-react';
import Button from '../common/Button';
import Table from '../common/Table';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const ExerciseList: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');

  const exerciseData = [
    { seleccionar: <input type="checkbox" />, nombre: 'Press de banca', creador: 'Admin', musculo: 'Pecho', equipamiento: 'Barra', acciones: 'Editar' },
    { seleccionar: <input type="checkbox" />, nombre: 'Sentadillas', creador: 'Admin', musculo: 'Piernas', equipamiento: 'Peso corporal', acciones: 'Editar' },
    { seleccionar: <input type="checkbox" />, nombre: 'Dominadas', creador: 'Admin', musculo: 'Espalda', equipamiento: 'Barra de dominadas', acciones: 'Editar' },
  ];

  const statsCards = [
    { 
      icon: Dumbbell,
      title: "Ejercicios Totales",
      value: "48",
      color: "bg-blue-500"
    },
    {
      icon: Target,
      title: "Grupos Musculares",
      value: "12",
      color: "bg-purple-500"
    },
    {
      icon: Clock,
      title: "Tiempo Promedio",
      value: "45min",
      color: "bg-green-500"
    },
    {
      icon: Users,
      title: "Usuarios Activos",
      value: "156",
      color: "bg-amber-500"
    }
  ];

  const renderCell = (key: string, value: any) => {
    switch (key) {
      case 'musculo':
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            value === 'Pecho' ? 'bg-blue-100 text-blue-800' :
            value === 'Piernas' ? 'bg-green-100 text-green-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {value}
          </span>
        );
      case 'equipamiento':
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            value === 'Barra' ? 'bg-amber-100 text-amber-800' :
            value === 'Peso corporal' ? 'bg-emerald-100 text-emerald-800' :
            'bg-indigo-100 text-indigo-800'
          }`}>
            {value}
          </span>
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
          Catálogo de Ejercicios
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Gestiona y organiza tu biblioteca de ejercicios
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
          <Button variant="create" onClick={() => setIsExerciseModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Crear Ejercicio
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
            placeholder="Buscar ejercicios..."
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
          headers={['Seleccionar', 'Nombre', 'Creador', 'Músculo', 'Equipamiento', 'Acciones']}
          data={exerciseData.map(item => ({
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

export default ExerciseList;