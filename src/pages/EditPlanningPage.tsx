import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import EditPlanningPageCalendario from '../components/Planning/EditPlanningPageCalendario';
import VistaSimplificada from '../components/Planning/VistaSimplificada';
import VistaCompleja from '../components/Planning/VistaCompleja';
import VistaCalendario from '../components/Planning/VistaCalendario';
import VistaResumen from '../components/Planning/VistaResumen';
import VistaEjerciciosDetallados from '../components/Planning/VistaEjerciciosDetallados';
import VistaProgreso from '../components/Planning/VistaProgreso';
import Button from '../components/common/Button';
import { Grid, List, Save, ArrowLeft, Calendar, PieChart, Dumbbell, TrendingUp, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ... (interfaces y tipos permanecen iguales)

const EditPlanningPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [planning, setPlanning] = useState<Planning>({
    id: '',
    nombre: '',
    descripcion: '',
    semanas: 6,
    plan: [],
  });
  const [semanaActual, setSemanaActual] = useState(1);
  const [vistaActual, setVistaActual] = useState<'simplificada' | 'compleja' | 'calendario' | 'resumen' | 'ejercicios' | 'progreso'>('simplificada');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlanning = async () => {
      setIsLoading(true);
      // Simulación de carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPlanning({
        id: id || '',
        nombre: 'Semana de Entrenamiento Intensivo',
        descripcion: 'Transforma tu cuerpo, forja tu mente, alcanza tus metas',
        semanas: 6,
        plan: Array(6).fill(null).map(() => ({
          Lunes: { id: 'lunes', sessions: [] },
          Martes: { id: 'martes', sessions: [] },
          Miércoles: { id: 'miercoles', sessions: [] },
          Jueves: { id: 'jueves', sessions: [] },
          Viernes: { id: 'viernes', sessions: [] },
          Sábado: { id: 'sabado', sessions: [] },
          Domingo: { id: 'domingo', sessions: [] },
        })),
      });
      setIsLoading(false);
    };
    fetchPlanning();
  }, [id]);

  const handleAddWeek = () => {
    setPlanning(prev => ({
      ...prev,
      semanas: prev.semanas + 1,
      plan: [
        ...prev.plan,
        {
          Lunes: { id: 'lunes', sessions: [] },
          Martes: { id: 'martes', sessions: [] },
          Miércoles: { id: 'miercoles', sessions: [] },
          Jueves: { id: 'jueves', sessions: [] },
          Viernes: { id: 'viernes', sessions: [] },
          Sábado: { id: 'sabado', sessions: [] },
          Domingo: { id: 'domingo', sessions: [] },
        }
      ]
    }));
  };

  const updatePlan = (updatedPlan: WeekPlan) => {
    setPlanning(prev => {
      const newPlan = [...prev.plan];
      newPlan[semanaActual - 1] = updatedPlan;
      return { ...prev, plan: newPlan };
    });
  };

  const renderVistaActual = () => {
    const props = {
      semanaActual,
      planSemanal: planning.plan[semanaActual - 1],
      updatePlan,
    };

    switch (vistaActual) {
      case 'simplificada':
        return <VistaSimplificada {...props} />;
      case 'compleja':
        return <VistaCompleja {...props} />;
      case 'calendario':
        return <VistaCalendario {...props} />;
      case 'resumen':
        return <VistaResumen {...props} />;
      case 'ejercicios':
        return <VistaEjerciciosDetallados {...props} />;
      case 'progreso':
        return <VistaProgreso semanaActual={semanaActual} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`max-w-6xl mx-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 transition-all duration-300`}
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
            <Button
              variant="create"
              className="flex items-center transform hover:scale-105 transition-transform duration-300"
            >
              <Save className="w-5 h-5 mr-2" />
              Guardar Cambios
            </Button>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              {planning.nombre}
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400">{planning.descripcion}</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col space-y-4 mb-8"
          >
            <EditPlanningPageCalendario
              semanas={planning.semanas}
              semanaActual={semanaActual}
              setSemanaActual={setSemanaActual}
              onAddWeek={handleAddWeek}
            />
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: List, label: 'Simplificada', value: 'simplificada' },
                { icon: Grid, label: 'Compleja', value: 'compleja' },
                { icon: Calendar, label: 'Calendario', value: 'calendario' },
                { icon: PieChart, label: 'Resumen', value: 'resumen' },
                { icon: Dumbbell, label: 'Ejercicios', value: 'ejercicios' },
                { icon: TrendingUp, label: 'Progreso', value: 'progreso' },
              ].map(({ icon: Icon, label, value }) => (
                <Button
                  key={value}
                  variant={vistaActual === value ? 'create' : 'normal'}
                  onClick={() => setVistaActual(value as any)}
                  className="transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={vistaActual}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="transition-all duration-300 ease-in-out"
            >
              {renderVistaActual()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EditPlanningPage;