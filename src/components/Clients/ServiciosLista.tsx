// ServiciosLista.tsx
import React, { useState, useEffect } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserCircle, Ticket, Calendar, Plus } from 'lucide-react';
import TablaClasesGrupales from './TablaClasesGrupales';
import TablaAsesoriaSubscripcion from './TablaAsesoriaSubscripcion';
import TablaCitas from './TablaCitas';
import { useTheme } from '../../contexts/ThemeContext';

// Importar los popups
import NuevoClaseGrupalPopup from './NuevoClaseGrupalPopup';
import NuevaAsesoriaPopup from './NuevaAsesoriaPopup';
import NuevaSuscripcionPopup from './NuevaSuscripcionPopup';
import NuevoPackCitasPopup from './NuevoPackCitasPopup';

const categoriasServicios = [
  {
    id: 'suscripciones',
    titulo: 'Suscripción',
    tipo: 'Suscripción',
    icono: <Ticket />,
  },
  {
    id: 'asesorias',
    titulo: 'Asesoría Individual',
    tipo: 'Asesoría Individual',
    icono: <UserCircle />,
  },
  {
    id: 'clases-grupales',
    titulo: 'Clase Grupal',
    tipo: 'ClaseGrupal', // Sin espacio para coincidir con la URL
    icono: <Users />,
  },
  {
    id: 'citas',
    titulo: 'Pack de Citas',
    tipo: 'Pack de Citas',
    icono: <Calendar />,
  },
];

const ServiciosLista = () => {
  const [categoriaActiva, setCategoriaActiva] = useState('asesorias');
  const [servicios, setServicios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [isNuevoClaseGrupalOpen, setIsNuevoClaseGrupalOpen] = useState(false);
  const [isNuevaAsesoriaOpen, setIsNuevaAsesoriaOpen] = useState(false);
  const [isNuevaSuscripcionOpen, setIsNuevaSuscripcionOpen] = useState(false);
  const [isNuevoPackCitasOpen, setIsNuevoPackCitasOpen] = useState(false);

  const getActionButtonText = () => {
    switch (categoriaActiva) {
      case 'clases-grupales':
        return 'Nueva Clase';
      case 'asesorias':
        return 'Nueva Asesoría';
      case 'suscripciones':
        return 'Nueva Suscripción';
      case 'citas':
        return 'Nuevo Pack de Citas';
      default:
        return 'Nuevo';
    }
  };

  const handleActionButtonClick = () => {
    switch (categoriaActiva) {
      case 'clases-grupales':
        setIsNuevoClaseGrupalOpen(true);
        break;
      case 'asesorias':
        setIsNuevaAsesoriaOpen(true);
        break;
      case 'suscripciones':
        setIsNuevaSuscripcionOpen(true);
        break;
      case 'citas':
        setIsNuevoPackCitasOpen(true);
        break;
      default:
        break;
    }
  };

  const fetchServiciosPorTipo = async (tipo: string) => {
    setLoading(true);
    setError(null);
    console.log('Iniciando fetchServiciosPorTipo para tipo:', tipo);
    try {
      const token = localStorage.getItem('token'); // Obtener el token
      console.log('Token obtenido:', token ? 'Token presente' : 'Token no encontrado');

      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const encodedTipo = encodeURIComponent(tipo);
      const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/servicios/services/tipo/${encodedTipo}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error en la respuesta:', errorData);
        throw new Error(errorData.mensaje || `Error al obtener servicios de tipo ${tipo}`);
      }

      const data = await response.json();
      console.log('Datos de servicios recibidos:', data);
      setServicios(data);
    } catch (err: any) {
      console.error('Error en fetchServiciosPorTipo:', err);
      setError(err instanceof Error ? err.message : 'Error al obtener los servicios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const categoriaSeleccionada = categoriasServicios.find(c => c.id === categoriaActiva);
    if (categoriaSeleccionada) {
      fetchServiciosPorTipo(categoriaSeleccionada.tipo);
    }
  }, [categoriaActiva]);

  const handleAddServicio = (nuevoServicio: any) => {
    console.log('Añadiendo nuevo servicio:', nuevoServicio);
    setServicios(serviciosActuales => {
      const nuevosServicios = [...serviciosActuales, nuevoServicio];
      console.log('Lista actualizada de servicios:', nuevosServicios);
      return nuevosServicios;
    });
  };

  const renderTabla = () => {
    const categoria = categoriasServicios.find(c => c.id === categoriaActiva);
    if (!categoria) return null;

    if (loading) {
      return <div className="text-center py-4">Cargando servicios...</div>;
    }

    if (error) {
      return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    if (!servicios || servicios.length === 0) {
      return (
        <div className="p-8 text-center">
          <span>No hay {categoria.titulo.toLowerCase()}</span>
        </div>
      );
    }

    switch (categoria.id) {
      case 'clases-grupales':
        return <TablaClasesGrupales datos={servicios} isDarkMode={isDarkMode} />;
      case 'asesorias':
      case 'suscripciones':
        return (
          <TablaAsesoriaSubscripcion
            datos={servicios}
            isDarkMode={isDarkMode}
            onServiceUpdated={(servicioActualizado) => {
              console.log('Servicio actualizado:', servicioActualizado);
              setServicios(serviciosActuales =>
                serviciosActuales.map(servicio =>
                  servicio._id === servicioActualizado._id ? servicioActualizado : servicio
                )
              );
            }}
            onAddPaymentPlan={(servicioId, nuevoPlan) => {
              console.log('Nuevo plan de pago añadido:', { servicioId, nuevoPlan });
              setServicios(serviciosActuales =>
                serviciosActuales.map(servicio =>
                  servicio._id === servicioId
                    ? {
                        ...servicio,
                        planDePago: [...(servicio.planDePago || []), nuevoPlan]
                      }
                    : servicio
                )
              );
            }}
          />
        );
      case 'citas':
        return <TablaCitas datos={servicios} isDarkMode={isDarkMode} />;
      default:
        return null;
    }
  };

  const categoriaSeleccionada = categoriasServicios.find(c => c.id === categoriaActiva);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50'
      } py-12 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1
              className={`text-5xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gradient'
              }`}
            >
              Gestión de Servicios
            </h1>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleActionButtonClick} // Usar la nueva función
              className={`px-6 py-3 rounded-xl flex items-center space-x-2 font-medium shadow-lg transition-all duration-300 ${
                isDarkMode
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/30'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>{getActionButtonText()}</span>
            </motion.button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {categoriasServicios.map((categoria, index) => (
            <motion.button
              key={categoria.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setCategoriaActiva(categoria.id)}
              className={`flex items-center space-x-3 px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 
                ${
                  categoriaActiva === categoria.id
                    ? isDarkMode
                      ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                      : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/50'
                    : isDarkMode
                    ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 shadow-lg hover:shadow-xl'
                    : 'glass hover:bg-white/90 text-gray-700 shadow-lg hover:shadow-xl'
                }`}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span
                className={`${
                  categoriaActiva === categoria.id
                    ? 'text-white'
                    : isDarkMode
                    ? 'text-purple-400'
                    : 'text-indigo-600'
                }`}
              >
                {categoria.icono}
              </span>
              <span className="font-medium text-lg">{categoria.titulo}</span>
            </motion.button>
          ))}
        </div>

        <motion.div
          layout
          className={`${
            isDarkMode ? 'bg-gray-800/50 shadow-xl' : 'glass'
          } rounded-3xl shadow-xl overflow-hidden`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={categoriaActiva}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={isDarkMode ? 'text-gray-200' : ''}
            >
              {renderTabla()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Renderizar los popups */}
      {categoriaSeleccionada && (
        <>
          <NuevoClaseGrupalPopup
            isOpen={isNuevoClaseGrupalOpen}
            onClose={() => setIsNuevoClaseGrupalOpen(false)}
            onAdd={() => categoriaSeleccionada && fetchServiciosPorTipo(categoriaSeleccionada.tipo)}
            isDarkMode={isDarkMode}
          />

          <NuevaAsesoriaPopup
            isOpen={isNuevaAsesoriaOpen}
            onClose={() => setIsNuevaAsesoriaOpen(false)}
            onAdd={() => categoriaSeleccionada && fetchServiciosPorTipo(categoriaSeleccionada.tipo)}
            isDarkMode={isDarkMode}
          />

          <NuevaSuscripcionPopup
            isOpen={isNuevaSuscripcionOpen}
            onClose={() => setIsNuevaSuscripcionOpen(false)}
            onAdd={() => categoriaSeleccionada && fetchServiciosPorTipo(categoriaSeleccionada.tipo)}
            isDarkMode={isDarkMode}
          />

          <NuevoPackCitasPopup
            isOpen={isNuevoPackCitasOpen}
            onClose={() => setIsNuevoPackCitasOpen(false)}
            onAdd={() => categoriaSeleccionada && fetchServiciosPorTipo(categoriaSeleccionada.tipo)}
            isDarkMode={isDarkMode}
          />
        </>
      )}
    </motion.div>
  );
};

export default ServiciosLista;
