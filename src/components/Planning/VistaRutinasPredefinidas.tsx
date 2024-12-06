import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';
import { Library, Clock, Dumbbell, Target, Plus, Star } from 'lucide-react';
import Button from '../Common/Button';
import { motion } from 'framer-motion';

interface VistaRutinasPredefinidasProps {
  planSemanal: any;
  updatePlan: (plan: any) => void;
}

interface Metric {
  type: string;
  value: string;
  _id: string;
}

interface Exercise {
  name: string;
  metrics: Metric[];
  notes: string;
  _id: string;
}

interface Routine {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  notes: string;
  exercises: Exercise[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const getStockImage = (index: number): string => {
  const stockImages = [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1576678927484-cc907957088c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1591258370814-01609b341790?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  ];
  return stockImages[index % stockImages.length];
};

const VistaRutinasPredefinidas: React.FC<VistaRutinasPredefinidasProps> = () => {
  const { theme } = useTheme();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutines = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await axios.get('https://fitoffice2-f70b52bef77e.herokuapp.com/api/routines/routines', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        setRoutines(response.data.data);
      } else {
        throw new Error('Error al obtener las rutinas');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las rutinas');
      console.error('Error fetching routines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Cargando rutinas...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className={`p-6 rounded-xl shadow-lg
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Library className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">Rutinas Predefinidas</h2>
          </div>
          <div className="flex space-x-4">
            <select
              className={`px-4 py-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <option value="">Todas las categorías</option>
              <option value="fuerza">Fuerza</option>
              <option value="hipertrofia">Hipertrofia</option>
              <option value="cardio">Cardio</option>
            </select>
            <select
              className={`px-4 py-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <option value="">Todos los niveles</option>
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routines.map((routine, index) => (
            <motion.div
              key={routine._id}
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl overflow-hidden shadow-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-white'
              }`}
            >
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${getStockImage(index)})` }}
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{routine.name}</h3>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1">4.8</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {routine.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {routine.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Dumbbell className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">{routine.exercises.length} ejercicios</span>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VistaRutinasPredefinidas;