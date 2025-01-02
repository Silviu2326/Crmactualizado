// ServiciosLista.tsx
import React, { useState, useEffect } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserCircle, Ticket, Calendar, Plus, BookOpen, Target, Activity, Clock } from 'lucide-react';
import TablaClasesGrupales from './TablaClasesGrupales';
import TablaAsesoriaSubscripcion from './TablaAsesoriaSubscripcion';
import TablaCitas from './TablaCitas';
import { useTheme } from '../../contexts/ThemeContext';

// Importar los popups
import NuevoClaseGrupalPopup from './NuevoClaseGrupalPopup';
import NuevaAsesoriaPopup from './NuevaAsesoriaPopup';
import NuevaSuscripcionPopup from './NuevaSuscripcionPopup';
import NuevoPackCitasPopup from './NuevoPackCitasPopup';

// Estilos base
const styles = {
  container: {
    position: 'relative' as const,
    minHeight: '100vh',
    background: 'linear-gradient(135deg, rgba(245,245,245,0.9) 0%, rgba(242,242,255,0.9) 100%)',
  },
  darkContainer: {
    background: 'linear-gradient(135deg, rgba(30,30,40,0.95) 0%, rgba(20,20,30,0.95) 100%)',
  },
  categoryCard: (isActive: boolean, isDarkMode: boolean) => ({
    background: isActive
      ? isDarkMode
        ? 'linear-gradient(45deg, #2c3440, #1a2030)'
        : 'linear-gradient(45deg, #ffffff, #f0f4f8)'
      : 'transparent',
    border: `2px solid ${isActive ? '#4a90e2' : isDarkMode ? '#ffffff20' : '#00000020'}`,
    borderRadius: '12px',
    padding: '15px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
  }),
};

const categoriasServicios = [
  {
    id: 'suscripciones',
    titulo: 'Suscripción',
    tipo: 'Suscripción',
    icono: <BookOpen style={{ color: '#4a90e2' }} />,
  },
  {
    id: 'asesorias',
    titulo: 'Asesoría Individual',
    tipo: 'Asesoría Individual',
    icono: <Target style={{ color: '#4a90e2' }} />,
  },
  {
    id: 'clases-grupales',
    titulo: 'Clase Grupal',
    tipo: 'ClaseGrupal',
    icono: <Users style={{ color: '#4a90e2' }} />,
  },
  {
    id: 'citas',
    titulo: 'Pack de Citas',
    tipo: 'Pack de Citas',
    icono: <Clock style={{ color: '#4a90e2' }} />,
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
    <div style={{
      ...styles.container,
      ...(isDarkMode && styles.darkContainer)
    }}>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ 
            color: isDarkMode ? '#ffffff' : '#333333',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Activity style={{ color: '#4a90e2' }} />
            Servicios Disponibles
          </h2>
        </div>
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {categoriasServicios.map((categoria, index) => (
            <motion.button
              key={categoria.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setCategoriaActiva(categoria.id)}
              style={styles.categoryCard(categoriaActiva === categoria.id, isDarkMode)}
            >
              <span
                style={{
                  color: categoriaActiva === categoria.id
                    ? '#4a90e2'
                    : isDarkMode
                    ? '#ffffff80'
                    : '#00000080'
                }}
              >
                {categoria.icono}
              </span>
              <span style={{ fontWeight: 'bold' }}>{categoria.titulo}</span>
            </motion.button>
          ))}
        </div>

        <motion.div
          layout
          style={{
            ...styles.container,
            ...(isDarkMode && styles.darkContainer),
            padding: '20px',
            borderRadius: '20px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={categoriaActiva}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ padding: '20px' }}
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
    </div>
  );
};

export default ServiciosLista;
