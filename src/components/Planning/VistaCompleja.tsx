import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Plus, Trash2, Edit, ChevronDown, ChevronUp, Calendar, Dumbbell, Clock } from 'lucide-react';
import Button from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';

// ... (interfaces remain the same)

const VistaCompleja: React.FC<VistaComplejaProps> = ({ semanaActual, planSemanal, updatePlan }) => {
  const { theme } = useTheme();
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const [diaSeleccionado, setDiaSeleccionado] = useState(dias[0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const handleAddSession = (dia: string) => {
    const newSession: Session = {
      id: `session-${Date.now()}`,
      name: `Nueva Sesión`,
      exercises: []
    };
    const updatedPlan = {
      ...planSemanal,
      [dia]: {
        ...planSemanal[dia],
        sessions: [...planSemanal[dia].sessions, newSession]
      }
    };
    updatePlan(updatedPlan);
  };

  const handleDeleteSession = (dia: string, sessionId: string) => {
    const updatedPlan = {
      ...planSemanal,
      [dia]: {
        ...planSemanal[dia],
        sessions: planSemanal[dia].sessions.filter(session => session.id !== sessionId)
      }
    };
    updatePlan(updatedPlan);
  };

  const handleAddExercise = (dia: string, sessionId: string) => {
    // Implementation for adding an exercise
    console.log(`Adding exercise to ${dia}, session ${sessionId}`);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} rounded-xl p-6 shadow-lg transition-all duration-300`}
    >
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        Vista Compleja - Semana {semanaActual}
      </h2>
      
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {dias.map((dia) => (
          <Button
            key={dia}
            variant={diaSeleccionado === dia ? "create" : "normal"}
            onClick={() => setDiaSeleccionado(dia)}
            className="flex-shrink-0"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {dia}
          </Button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={diaSeleccionado}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {planSemanal[diaSeleccionado].sessions.map((session) => (
            <motion.div
              key={session.id}
              variants={itemVariants}
              className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md`}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-lg">{session.name}</h4>
                <div className="space-x-2">
                  <Button variant="normal" onClick={() => handleAddExercise(diaSeleccionado, session.id)} className="p-1">
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteSession(diaSeleccionado, session.id)} className="p-1">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {session.exercises.map((exercise) => (
                <div key={exercise.id} className="ml-4 mb-2 flex items-center justify-between bg-opacity-50 bg-gray-200 dark:bg-gray-700 p-2 rounded">
                  <span className="flex items-center">
                    <Dumbbell className="w-4 h-4 mr-2 text-blue-500" />
                    {exercise.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    {exercise.sets}x{exercise.reps} 
                    {exercise.weight && ` | ${exercise.weight}kg`}
                    {exercise.rest && (
                      <span className="ml-2 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {exercise.rest}s
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </motion.div>
          ))}
          <Button 
            variant="create" 
            onClick={() => handleAddSession(diaSeleccionado)}
            className="w-full justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir Sesión
          </Button>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default VistaCompleja;