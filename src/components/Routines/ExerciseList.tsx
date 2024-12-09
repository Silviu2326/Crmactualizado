import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, X, Plus, Filter, Download, Dumbbell, Target, Clock, Users, BarChart2, Pencil, Trash2 } from 'lucide-react';
import Button from '../Common/Button';
import Table from '../Common/Table';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import CreateExerciseModal from './CreateExerciseModal';

interface Exercise {
  _id: string;
  nombre: string;
  creador?: string;
  grupoMuscular: string[];
  equipo: string[];
  descripcion: string;
  imgUrl?: string;
  videoUrl?: string;
  fechaCreacion?: string;
  __v?: number;
}

const ExerciseList: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://fitoffice2-f70b52bef77e.herokuapp.com/api/exercises');
      setExercises(response.data.data);
      setError(null);
    } catch (error) {
      console.error('Error al obtener ejercicios:', error);
      setError('Error al cargar los ejercicios. Por favor, intente de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { 
      icon: Dumbbell,
      title: "Ejercicios Totales",
      value: exercises.length.toString(),
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
      case 'grupoMuscular':
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            value === 'Pecho' ? 'bg-blue-100 text-blue-800' :
            value === 'Piernas' ? 'bg-green-100 text-green-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {value}
          </span>
        );
      case 'equipo':
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

  const handleCreateExercise = () => {
    setSelectedExercise(null);
    setIsExerciseModalOpen(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    console.log('Exercise being edited:', exercise);
    setSelectedExercise(exercise);
    setIsExerciseModalOpen(true);
  };

  const handleExerciseCreated = () => {
    console.log('Exercise created/updated');
    fetchExercises();
  };

  const handleDeleteExercise = async (exercise: Exercise) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el ejercicio "${exercise.nombre}"?`)) {
      try {
        setLoading(true);
        await axios.delete(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/exercises/${exercise._id}`);
        console.log('Ejercicio eliminado con éxito');
        fetchExercises(); // Recargar la lista después de eliminar
      } catch (error) {
        console.error('Error al eliminar el ejercicio:', error);
        setError('Error al eliminar el ejercicio. Por favor, intente de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

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
          <Button variant="create" onClick={handleCreateExercise}>
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
          data={exercises.map(exercise => ({
            seleccionar: <input type="checkbox" />,
            nombre: exercise.nombre,
            creador: exercise.creador || "sistema",
            grupoMuscular: renderCell('grupoMuscular', exercise.grupoMuscular),
            equipo: renderCell('equipo', exercise.equipo),
            acciones: (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditExercise(exercise)}
                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteExercise(exercise)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )
          }))}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      </motion.div>
      <CreateExerciseModal
        isOpen={isExerciseModalOpen}
        onClose={() => {
          setIsExerciseModalOpen(false);
          setSelectedExercise(null);
        }}
        onExerciseCreated={handleExerciseCreated}
        initialData={selectedExercise ? {
          _id: selectedExercise._id,
          nombre: selectedExercise.nombre,
          descripcion: selectedExercise.descripcion,
          gruposMusculares: selectedExercise.grupoMuscular,
          equipamiento: selectedExercise.equipo,
          videoUrl: selectedExercise.imgUrl || ''
        } : undefined}
        isEditing={!!selectedExercise}
      />
    </div>
  );
};

export default ExerciseList;