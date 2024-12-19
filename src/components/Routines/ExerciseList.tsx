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

const gruposMusculares = [
  'Soleo',
  'Gemelo',
  'Tríceps femoral',
  'Abductor',
  'Glúteo',
  'Abdominales',
  'Lumbar',
  'Dorsales',
  'Trapecio',
  'Hombro anterior',
  'Hombro lateral',
  'Hombro posterior',
  'Pecho',
  'Tríceps',
  'Bíceps',
  'Cuello',
  'Antebrazo'
];

const equipamientoDisponible = [
  'Pesas',
  'Mancuernas',
  'Barra',
  'Kettlebell',
  'Banda de resistencia',
  'Esterilla',
  'Banco',
  'Máquina de cable',
  'TRX',
  'Rueda de abdominales',
  'Cuerda para saltar',
  'Balón medicinal',
  'Plataforma de step'
];

const ExerciseList: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, searchTerm, selectedMuscleGroups, selectedEquipment]);

  const filterExercises = () => {
    let filtered = [...exercises];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por grupos musculares
    if (selectedMuscleGroups.length > 0) {
      filtered = filtered.filter(exercise =>
        exercise.grupoMuscular.some(muscle => selectedMuscleGroups.includes(muscle))
      );
    }

    // Filtrar por equipamiento
    if (selectedEquipment.length > 0) {
      filtered = filtered.filter(exercise =>
        exercise.equipo.some(equip => selectedEquipment.includes(equip))
      );
    }

    setFilteredExercises(filtered);
  };

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/exercises');
      setExercises(response.data.data);
      setFilteredExercises(response.data.data);
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
      value: filteredExercises.length.toString(),
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
        return value.map((muscle: string, index: number) => (
          <span key={index} className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mr-1 mb-1">
            {muscle}
          </span>
        ));
      case 'equipo':
        return value.map((equip: string, index: number) => (
          <span key={index} className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 mr-1 mb-1">
            {equip}
          </span>
        ));
      default:
        return value;
    }
  };

  const handleCreateExercise = () => {
    setSelectedExercise(null);
    setIsExerciseModalOpen(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsExerciseModalOpen(true);
  };

  const handleExerciseCreated = () => {
    fetchExercises();
  };

  const handleDeleteExercise = async (exercise: Exercise) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el ejercicio "${exercise.nombre}"?`)) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:3000/api/exercises/${exercise._id}`);
        fetchExercises();
      } catch (error) {
        console.error('Error al eliminar el ejercicio:', error);
        setError('Error al eliminar el ejercicio. Por favor, intente de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleMuscleGroup = (muscle: string) => {
    setSelectedMuscleGroups(prev =>
      prev.includes(muscle)
        ? prev.filter(m => m !== muscle)
        : [...prev, muscle]
    );
  };

  const toggleEquipment = (equipment: string) => {
    setSelectedEquipment(prev =>
      prev.includes(equipment)
        ? prev.filter(e => e !== equipment)
        : [...prev, equipment]
    );
  };

  const clearFilters = () => {
    setSelectedMuscleGroups([]);
    setSelectedEquipment([]);
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
        <Button 
          variant="filter"
          onClick={() => setIsFilterModalOpen(true)}
          className={selectedMuscleGroups.length > 0 || selectedEquipment.length > 0 ? 'ring-2 ring-blue-500' : ''}
        >
          <Filter className="w-5 h-5 mr-2" />
          Filtros {(selectedMuscleGroups.length > 0 || selectedEquipment.length > 0) && `(${selectedMuscleGroups.length + selectedEquipment.length})`}
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        <Table
          headers={['Seleccionar', 'Nombre', 'Creador', 'Músculo', 'Equipamiento', 'Acciones']}
          data={filteredExercises.map(exercise => ({
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

      {/* Modal de Filtros */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${
                theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
              } p-8 rounded-lg shadow-lg relative w-[800px] max-h-[90vh] overflow-y-auto`}
            >
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-bold mb-6">Filtros</h3>

              <div className="grid grid-cols-2 gap-6">
                {/* Grupos Musculares */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Grupos Musculares</h4>
                  <div className={`space-y-2 max-h-60 overflow-y-auto p-4 rounded border ${
                    theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                  }`}>
                    {gruposMusculares.map((muscle) => (
                      <label key={muscle} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedMuscleGroups.includes(muscle)}
                          onChange={() => toggleMuscleGroup(muscle)}
                          className={`form-checkbox h-4 w-4 ${
                            theme === 'dark'
                              ? 'text-blue-500 border-gray-600'
                              : 'text-blue-600 border-gray-300'
                          }`}
                        />
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {muscle}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Equipamiento */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Equipamiento</h4>
                  <div className={`space-y-2 max-h-60 overflow-y-auto p-4 rounded border ${
                    theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                  }`}>
                    {equipamientoDisponible.map((equip) => (
                      <label key={equip} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedEquipment.includes(equip)}
                          onChange={() => toggleEquipment(equip)}
                          className={`form-checkbox h-4 w-4 ${
                            theme === 'dark'
                              ? 'text-blue-500 border-gray-600'
                              : 'text-blue-600 border-gray-300'
                          }`}
                        />
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {equip}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={clearFilters}
                  className={`px-4 py-2 rounded ${
                    theme === 'dark'
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  Limpiar Filtros
                </button>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Aplicar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
          videoUrl: selectedExercise.videoUrl || ''
        } : undefined}
        isEditing={!!selectedExercise}
      />
    </div>
  );
};

export default ExerciseList;