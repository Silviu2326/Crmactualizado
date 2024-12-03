import React, { useState } from 'react';
import { Search, X, Plus, Filter, Download, Dumbbell, Target, Clock, Users, Calendar, TrendingUp, Pencil, Trash2, BarChart } from 'lucide-react';
import Button from '../Common/Button';
import Table from '../Common/Table';
import CreateRoutineModal from './CreateRoutineModal';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const WorkoutList: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateAIModalOpen, setIsCreateAIModalOpen] = useState(false);

  const handleCreateRoutine = (routineData: any) => {
    // Aquí implementaremos la lógica para guardar la nueva rutina
    console.log('Nueva rutina:', routineData);
    // TODO: Agregar la rutina a la lista y enviar al backend
  };

  const routinesData = [
    { 
      nombre: 'Rutina de Fuerza', 
      descripcion: 'Esta es una rutina de fuerza', 
      tags: ['Fuerza', 'Intermedio'], 
      notas: 'Esta rutina es para principiantes', 
      acciones: 'Editar' 
    },
    { 
      nombre: 'Cardio HIIT', 
      descripcion: 'Esta es una rutina de cardio', 
      tags: ['Cardio', 'Avanzado'], 
      notas: 'Esta rutina es para avanzados', 
      acciones: 'Editar' 
    },
    { 
      nombre: 'Yoga para principiantes', 
      descripcion: 'Esta es una rutina de yoga', 
      tags: ['Yoga', 'Principiante'], 
      notas: 'Esta rutina es para principiantes', 
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
      case 'tags':
        return (
          <div className="flex flex-wrap gap-1">
            {value?.map((tag, index) => (
              <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium ${
                tag === 'Fuerza' ? 'bg-purple-100 text-purple-800' :
                tag === 'Cardio' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {tag}
              </span>
            ))}
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
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Tags/Categorías</th>
                <th>Notas Adicionales</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {routinesData.map((rutina) => (
                <tr key={rutina.nombre}>
                  <td>{rutina.nombre}</td>
                  <td>{rutina.descripcion}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {rutina.tags?.map((tag, index) => (
                        <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium ${
                          tag === 'Fuerza' ? 'bg-purple-100 text-purple-800' :
                          tag === 'Cardio' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{rutina.notas}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => console.log('Editar rutina')}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        className="btn btn-sm btn-ghost text-error"
                        onClick={() => console.log('Eliminar rutina')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <CreateRoutineModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateRoutine}
      />
    </div>
  );
};

export default WorkoutList;