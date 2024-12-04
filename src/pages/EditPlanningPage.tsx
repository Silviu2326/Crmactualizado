// src/pages/EditPlanningPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Planning, WeekPlan, DayPlan, Session } from '../types/planning';
import { defaultPlanning } from '../data/defaultWorkout';
import { planningService } from '../services/planningService';
import EditPlanningPageCalendario from '../components/Planning/EditPlanningPageCalendario';
import VistaSimplificada from '../components/Planning/VistaSimplificada';
import VistaCompleja from '../components/Planning/VistaCompleja';
import VistaExcel from '../components/Planning/VistaExcel';
import VistaResumen from '../components/Planning/VistaResumen';
import VistaEjerciciosDetallados from '../components/Planning/VistaEjerciciosDetallados';
import VistaProgreso from '../components/Planning/VistaProgreso';
import VistaEstadisticas from '../components/Planning/VistaEstadisticas';
import VistaNotas from '../components/Planning/VistaNotas';
import VistaRutinasPredefinidas from '../components/Planning/VistaRutinasPredefinidas';
import VistaConfiguracion from '../components/Planning/VistaConfiguracion';
import Button from '../components/Common/Button';
import {
  Grid,
  List,
  Save,
  ArrowLeft,
  PieChart,
  Dumbbell,
  TrendingUp,
  BarChart2,
  FileText,
  Library,
  Settings,
  X,
  Layout,
  LineChart,
  ClipboardList,
  Table,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid'; // Importar para generar IDs únicos

const EditPlanningPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [planning, setPlanning] = useState<Planning | null>(null);
  const [semanaActual, setSemanaActual] = useState(1);
  const [planSemanal, setPlanSemanal] = useState<{ [key: string]: DayPlan } | null>(null);
  const [vistaActual, setVistaActual] = useState<
    | 'simplificada'
    | 'compleja'
    | 'excel'
    | 'resumen'
    | 'ejercicios'
    | 'progreso'
    | 'estadisticas'
    | 'notas'
    | 'rutinas'
    | 'configuracion'
  >('simplificada');
  const [showConfig, setShowConfig] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isHomeRoute = location.pathname === '/';

  const fetchPlanning = async () => {
    if (!id) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com//api/plannings/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al obtener la planificación');
      }

      const data: Planning = await response.json();
      console.log('Datos recibidos del backend:', data);

      setPlanning(data);
      setPlanSemanal(data.plan[semanaActual - 1].days);
    } catch (err: any) {
      console.error('Error al obtener la planificación:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanning();
  }, [id, semanaActual]);

  useEffect(() => {
    if (planning) {
      setPlanSemanal(planning.plan[semanaActual - 1].days);
    }
  }, [semanaActual, planning]);

  const handleAddWeek = async () => {
    if (!planning) return;

    try {
      const newWeek = await planningService.addWeekToPlan(planning._id);
      
      // Actualizar el estado local con la nueva semana
      setPlanning(prev => {
        if (!prev) return null;
        return {
          ...prev,
          plan: [...prev.plan, newWeek]
        };
      });

      // Cambiar a la nueva semana
      setSemanaActual(newWeek.weekNumber);

      // Mostrar mensaje de éxito si lo deseas
      console.log('Semana añadida con éxito');
    } catch (error) {
      console.error('Error al añadir nueva semana:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const updatePlan = (updatedDays: { [key: string]: DayPlan }) => {
    if (!planning) return;

    setPlanSemanal(updatedDays);
    setPlanning((prev) => {
      if (!prev) return prev;

      const newPlan = [...prev.plan];
      newPlan[semanaActual - 1].days = updatedDays;
      return {
        ...prev,
        plan: newPlan,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleSaveChanges = async () => {
    if (!planning) return;
  
    try {
      // Obtener el token JWT
      const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado correctamente
  
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
  
      const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com//api/plannings/${planning._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Incluir el token en los headers
        },
        body: JSON.stringify(planning),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Data:', errorData);
        throw new Error(errorData.mensaje || 'Error al actualizar la planificación');
      }
  
      const updatedPlanning: Planning = await response.json();
      console.log('Planificación actualizada:', updatedPlanning);
      setPlanning(updatedPlanning);
      alert('Planificación actualizada exitosamente.');
    } catch (err: any) {
      console.error('Error al actualizar la planificación:', err);
      alert(`Error: ${err.message}`);
    }
  };
  
  const renderVistaActual = () => {
    if (!planSemanal) return null;

    const props = {
      semanaActual,
      planSemanal,
      updatePlan,
    };

    switch (vistaActual) {
      case 'simplificada':
        return <VistaSimplificada {...props} />;
      case 'compleja':
        return (
          <VistaCompleja
            semanaActual={semanaActual}
            planSemanal={planSemanal}
            updatePlan={updatePlan}
            onReload={fetchPlanning}
            planningId={id || ''}
          />
        );
      case 'excel':
        return <VistaExcel {...props} />;
      case 'resumen':
        return <VistaResumen {...props} />;
      case 'ejercicios':
        return <VistaEjerciciosDetallados {...props} />;
      case 'progreso':
        return <VistaProgreso semanaActual={semanaActual} />;
      case 'estadisticas':
        return <VistaEstadisticas {...props} />;
      case 'notas':
        return <VistaNotas {...props} />;
      case 'rutinas':
        return <VistaRutinasPredefinidas {...props} />;
      case 'configuracion':
        return (
          <VistaConfiguracion planning={planning} setPlanning={setPlanning} />
        );
      default:
        return null;
    }
  };

  const buttonSections = [
    {
      title: 'Vistas Principales',
      icon: Layout,
      buttons: [
        { icon: List, label: 'Simplificada', value: 'simplificada' },
        { icon: Grid, label: 'Compleja', value: 'compleja' },
        { icon: Table, label: 'Excel', value: 'excel' },
      ],
    },
    {
      title: 'Análisis y Seguimiento',
      icon: LineChart,
      buttons: [
        { icon: PieChart, label: 'Resumen', value: 'resumen' },
        { icon: TrendingUp, label: 'Progreso', value: 'progreso' },
        { icon: BarChart2, label: 'Estadísticas', value: 'estadisticas' },
      ],
    },
    {
      title: 'Gestión y Recursos',
      icon: ClipboardList,
      buttons: [
        { icon: Dumbbell, label: 'Ejercicios', value: 'ejercicios' },
        { icon: FileText, label: 'Notas', value: 'notas' },
        { icon: Library, label: 'Rutinas', value: 'rutinas' },
      ],
    },
  ];

  if (loading) {
    return (
      <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <div className="flex justify-center items-center h-full">
          <p>Cargando planificación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-full overflow-y-auto ${
        theme === 'dark'
          ? 'bg-gray-900 text-white'
          : 'bg-gray-100 text-gray-800'
      } transition-all duration-300`}
    >
      <div className="container mx-auto px-4 py-8 relative">
        <AnimatePresence>
          {showConfig && planning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 overflow-y-auto"
              style={{ perspective: '1000px' }}
            >
              <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={() => setShowConfig(false)}
              />
              <div className="relative min-h-screen flex items-center justify-center p-4">
                <motion.div
                  initial={{ rotateX: -15 }}
                  animate={{ rotateX: 0 }}
                  exit={{ rotateX: 15, opacity: 0 }}
                  className={`relative w-full max-w-4xl p-6 rounded-2xl shadow-2xl ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <button
                    onClick={() => setShowConfig(false)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <VistaConfiguracion
                    planning={planning}
                    setPlanning={setPlanning}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-xl shadow-lg p-8`}
        >
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="normal"
              className="flex items-center transform hover:scale-105 transition-transform duration-300"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </Button>
            <div className="flex items-center space-x-4">
              <Button
                variant="normal"
                onClick={() => setShowConfig(true)}
                className="flex items-center transform hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
              >
                <Settings className="w-5 h-5 mr-2" />
                Configuración
              </Button>
              <Button
                variant="create"
                className="flex items-center transform hover:scale-105 transition-transform duration-300"
                onClick={handleSaveChanges}
              >
                <Save className="w-5 h-5 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-10"
          >
            {planning && (
              <>
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {planning.nombre}
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400">
                  {planning.descripcion}
                </p>
              </>
            )}
          </motion.div>

          {planning && planSemanal && (
            <>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-12"
              >
                <EditPlanningPageCalendario
                  weeks={planning.plan || []}
                  semanaActual={semanaActual}
                  setSemanaActual={setSemanaActual}
                  onAddWeek={handleAddWeek}
                  totalWeeks={planning.semanas}
                />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {buttonSections.map((section, idx) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-6 rounded-xl ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    } shadow-lg`}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <section.icon className="w-5 h-5 text-blue-500" />
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                    </div>
                    <div className="space-y-3">
                      {section.buttons.map(({ icon: Icon, label, value }) => (
                        <Button
                          key={value}
                          variant={vistaActual === value ? 'create' : 'normal'}
                          onClick={() =>
                            setVistaActual(value as typeof vistaActual)
                          }
                          className={`w-full justify-start transform hover:scale-102 transition-transform duration-300 ${
                            vistaActual === value
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                              : ''
                          }`}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          {label}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={vistaActual}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderVistaActual()}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EditPlanningPage;
