import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Users, Layout } from 'lucide-react';
import { VistaClientes } from './VistaClientes';
import { VistaCompleja } from './VistaCompleja';
import PlantillaPageCalendario from './PlantillaPageCalendario';

type Vista = 'clientes' | 'compleja';

interface PlantillaPageProps {}

const PlantillaPage: React.FC<PlantillaPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [plantilla, setPlantilla] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vistaActual, setVistaActual] = useState<Vista>('clientes');

  useEffect(() => {
    const fetchPlantilla = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/plannings/${id}`, {
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

  const renderVista = () => {
    switch (vistaActual) {
      case 'clientes':
        return <VistaClientes plantilla={plantilla} />;
      case 'compleja':
        return <VistaCompleja plantilla={plantilla} />;
      default:
        return null;
    }
  };

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
          className="text-center"
        >
          <h1 className={`text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent`}>
            {plantilla?.nombre || 'Cargando plantilla...'}
          </h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {plantilla?.descripcion || 'Gestiona y visualiza tu planificación de entrenamiento'}
          </p>
        </motion.div>

        {/* Calendar Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl ${
              theme === 'dark' 
                ? 'bg-gray-800/50 backdrop-blur-sm' 
                : 'bg-white/50 backdrop-blur-sm'
            } shadow-xl`}
          >
            <PlantillaPageCalendario 
              plantilla={plantilla}
              onDayClick={(semana, dia) => {
                console.log(`Semana ${semana}, Día ${dia}`);
              }}
            />
          </motion.div>
        </div>

        {/* Navigation Tabs - Centered and Styled */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
            {vistas.map((vista, index) => {
              const Icon = vista.icono;
              const isActive = vistaActual === vista.id;

              return (
                <motion.button
                  key={vista.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setVistaActual(vista.id as Vista)}
                  className={`relative flex items-center px-6 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/20'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/20'
                      : theme === 'dark'
                        ? 'hover:bg-gray-800/80'
                        : 'hover:bg-white/80'
                  } mx-1 group`}
                >
                  <Icon size={20} className={`${
                    isActive
                      ? 'text-white'
                      : theme === 'dark'
                        ? 'text-gray-400 group-hover:text-white'
                        : 'text-gray-500 group-hover:text-gray-700'
                  } transition-colors duration-200`} />
                  <span className={`ml-2 font-medium ${
                    isActive
                      ? 'text-white'
                      : theme === 'dark'
                        ? 'text-gray-400 group-hover:text-white'
                        : 'text-gray-700'
                  } transition-colors duration-200`}>
                    {vista.nombre}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <motion.div
          key={vistaActual}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ 
            duration: 0.2,
            scale: {
              type: "spring",
              damping: 30,
              stiffness: 300
            }
          }}
          className={`rounded-xl overflow-hidden ${
            theme === 'dark'
              ? 'bg-gray-800/50 backdrop-blur-sm'
              : 'bg-white/50 backdrop-blur-sm'
          } shadow-xl`}
        >
          {renderVista()}
        </motion.div>
      </div>
    </div>
  );
};

export default PlantillaPage;
