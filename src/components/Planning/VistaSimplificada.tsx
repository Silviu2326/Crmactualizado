import React, { useState } from 'react';
import { ChevronDown, Plus, Trash2, Edit, Sun, Moon, ChevronUp } from 'lucide-react';
import Button from '../common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import ExerciseBar from './ExerciseBar';
import { motion, AnimatePresence } from 'framer-motion';

// ... (interfaces remain the same)

const VistaSimplificada: React.FC<VistaSimplificadaProps> = ({ semanaActual, planSemanal, updatePlan }) => {
  const { theme } = useTheme();
  const [diaExpandido, setDiaExpandido] = useState<string | null>(null);
  const [sesionEditando, setSesionEditando] = useState<string | null>(null);
  const [showExerciseBar, setShowExerciseBar] = useState(false);
  const [currentDay, setCurrentDay] = useState<string>('');
  const [currentSessionId, setCurrentSessionId] = useState<string>('');

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

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

  const handleEditSession = (dia: string, sessionId: string) => {
    setSesionEditando(sessionId);
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

  const handleExerciseAdd = (exercise: Exercise) => {
    if (currentDay && currentSessionId) {
      const updatedPlan = {
        ...planSemanal,
        [currentDay]: {
          ...planSemanal[currentDay],
          sessions: planSemanal[currentDay].sessions.map(session =>
            session.id === currentSessionId
              ? { ...session, exercises: [...session.exercises, exercise] }
              : session
          )
        }
      };
      updatePlan(updatedPlan);
      setShowExerciseBar(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} rounded-xl p-6 shadow-lg transition-all duration-300`}
    >
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        Rutina Semanal - Semana {semanaActual}
      </h2>
      <AnimatePresence>
        {dias.map((dia) => (
          <motion.div
            key={dia}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Button
              variant="normal"
              className={`w-full flex justify-between items-center p-4 rounded-lg transition-all duration-300 ${
                diaExpandido === dia 
                  ? (theme === 'dark' ? 'bg-blue-900 text-white' : 'bg-blue-200 text-gray-900') 
                  : (theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-50')
              }`}
              onClick={() => setDiaExpandido(prev => prev === dia ? null : dia)}
            >
              <div className="flex items-center">
                {theme === 'dark' ? <Moon className="w-5 h-5 mr-2" /> : <Sun className="w-5 h-5 mr-2" />}
                <span className="text-lg font-semibold">{dia}</span>
              </div>
              <motion.div
                animate={{ rotate: diaExpandido === dia ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </Button>
            <AnimatePresence>
              {diaExpandido === dia && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mt-4 p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md transition-all duration-300 ease-in-out`}
                >
                  {planSemanal[dia].sessions.map((session) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`mb-4 p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold">{session.name}</h4>
                        <div className="space-x-2">
                          <Button variant="normal" onClick={() => handleEditSession(dia, session.id)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="danger" onClick={() => handleDeleteSession(dia, session.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {session.exercises.map((exercise) => (
                        <div key={exercise.id} className="ml-4 mb-2">
                          <span>{exercise.name} - {exercise.sets}x{exercise.reps}</span>
                        </div>
                      ))}
                      <Button
                        variant="normal"
                        className="mt-2"
                        onClick={() => {
                          setCurrentDay(dia);
                          setCurrentSessionId(session.id);
                          setShowExerciseBar(true);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Añadir Ejercicio
                      </Button>
                    </motion.div>
                  ))}
                  <Button variant="create" className="w-full mt-4 justify-center" onClick={() => handleAddSession(dia)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Añadir Sesión
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
      {showExerciseBar && (
        <ExerciseBar
          onAddExercise={handleExerciseAdd}
          onClose={() => setShowExerciseBar(false)}
        />
      )}
    </motion.div>
  );
};

export default VistaSimplificada;