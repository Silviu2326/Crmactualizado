import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Users, Layout } from 'lucide-react';
import { VistaClientes } from './VistaClientes';
import { VistaCompleja } from './VistaCompleja';
import PlantillaPageCalendario from './PlantillaPageCalendario';

type Vista = 'clientes' | 'compleja';

interface Exercise {
  _id: string;
  nombre: string;
  tipo: string;
  grupoMuscular: string[];
  descripcion: string;
  equipo: string[];
  imgUrl: string;
}

interface Set {
  reps: number;
  weight: number;
  rest: number;
  tempo: string;
  rpe: number;
  renderConfig: {
    campo1: string;
    campo2: string;
    campo3: string;
    _id: string;
  };
  _id: string;
}

interface ExerciseWithSets {
  exercise: Exercise;
  sets: Set[];
  _id: string;
}

interface Session {
  name: string;
  tipo: string;
  rondas: number;
  exercises: ExerciseWithSets[];
  _id: string;
}

interface Day {
  dayNumber: number;
  sessions: Session[];
  _id: string;
}

interface Week {
  weekNumber: number;
  days: Day[];
  _id: string;
}

interface Trainer {
  _id: string;
  nombre: string;
  email: string;
}

interface Client {
  _id: string;
  nombre: string;
  email: string;
}

interface AssignedClient {
  client: Client;
  currentWeek: number;
  currentDay: number;
  status: string;
  _id: string;
  assignedDate: string;
  modifications: any[];
}

interface Template {
  _id: string;
  nombre: string;
  descripcion: string;
  trainer: Trainer;
  totalWeeks: number;
  plan: Week[];
  isActive: boolean;
  tags: string[];
  difficulty: string;
  category: string;
  assignedClients: AssignedClient[];
  createdAt: string;
  updatedAt: string;
}

const PlantillaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [plantilla, setPlantilla] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vistaActual, setVistaActual] = useState<Vista>('clientes');
  const [selectedWeek, setSelectedWeek] = useState(1);

  useEffect(() => {
    const fetchPlantilla = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch(`http://localhost:3000/api/planningtemplate/templates/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar la plantilla');
        }

        const data = await response.json();
        setPlantilla(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantilla();
  }, [id]);

  const handleWeekSelect = (weekNumber: number) => {
    console.log('Semana seleccionada:', weekNumber);
    if (!plantilla?._id) {
      console.error('No hay ID de plantilla disponible');
      return;
    }
    console.log('Template ID:', plantilla._id);
    setSelectedWeek(weekNumber);
    setVistaActual('compleja');
  };

  const vistas = [
    {
      id: 'clientes',
      nombre: 'Clientes',
      icono: Users,
      descripcion: 'Gestiona los clientes asignados a esta plantilla'
    },
    {
      id: 'compleja',
      nombre: 'Vista Compleja',
      icono: Layout,
      descripcion: 'Vista detallada de la plantilla'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {plantilla?.nombre}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {plantilla?.descripcion}
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {plantilla?.category}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              {plantilla?.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {plantilla?.totalWeeks} semanas
            </span>
          </div>
        </motion.div>

        {/* Vista Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vistas.map((vista) => (
            <motion.button
              key={vista.id}
              onClick={() => setVistaActual(vista.id as Vista)}
              className={`p-4 rounded-xl shadow-md transition-colors duration-200 ${
                vistaActual === vista.id
                  ? theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <vista.icono className="w-6 h-6" />
                <div className="text-left">
                  <h3 className="font-semibold">{vista.nombre}</h3>
                  <p className={`text-sm ${
                    vistaActual === vista.id
                      ? 'text-blue-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {vista.descripcion}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Calendar Section - Siempre visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        >
          <PlantillaPageCalendario
            plantilla={plantilla}
            onWeekSelect={handleWeekSelect}
          />
        </motion.div>

        {/* Vista Content Section */}
        {(vistaActual === 'clientes' || vistaActual === 'compleja') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            {vistaActual === 'clientes' && plantilla && (
              <VistaClientes 
                assignedClients={plantilla.assignedClients}
                templateId={plantilla._id}
                onClientAssigned={() => {
                  const fetchPlantilla = async () => {
                    try {
                      const token = localStorage.getItem('token');
                      if (!token) {
                        throw new Error('No se encontró el token de autenticación');
                      }

                      const response = await fetch(`http://localhost:3000/api/planningtemplate/templates/${id}`, {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      });

                      if (!response.ok) {
                        throw new Error('Error al cargar la plantilla');
                      }

                      const data = await response.json();
                      setPlantilla(data);
                    } catch (err: any) {
                      setError(err.message);
                    } finally {
                      setLoading(false);
                    }
                  };
                  fetchPlantilla();
                }}
              />
            )}
            {vistaActual === 'compleja' && plantilla && (
              <VistaCompleja 
                plantilla={plantilla} 
                semana={selectedWeek}
                dia={1}
              />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PlantillaPage;
