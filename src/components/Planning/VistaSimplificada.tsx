import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Plus, Calendar, AlertCircle, XCircle, Dumbbell, Clock, Target, ChevronRight, BarChart2 } from 'lucide-react';
import Button from '../Common/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface Exercise {
  id: string;
  name: string;
  sets: Array<{
    id: string;
    reps: number;
    weight?: number;
    rest?: number;
  }>;
}

interface Session {
  id: string;
  name: string;
  exercises: Exercise[];
}

interface DayPlan {
  id: string;
  sessions: Session[];
}

interface WeekPlan {
  [key: string]: DayPlan;
}

interface VistaSimplificadaProps {
  semanaActual: number;
  planSemanal: WeekPlan;
  updatePlan: (plan: WeekPlan) => void;
}

const trainingStatus = {
  'Lunes': 'regular',
  'Jueves': 'regular',
  'Sábado': 'bad',
  'Martes': 'good',
  'Miércoles': 'good',
  'Viernes': 'good',
  'Domingo': 'good'
} as const;

const VistaSimplificada: React.FC<VistaSimplificadaProps> = ({
  planSemanal,
  updatePlan,
}) => {
  const { theme } = useTheme();
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const getStatusIcon = (dia: string) => {
    const status = trainingStatus[dia as keyof typeof trainingStatus];
    if (!status || status === 'good') return null;

    return status === 'regular' ? (
      <AlertCircle className="w-5 h-5 text-yellow-500" />
    ) : status === 'bad' ? (
      <XCircle className="w-5 h-5 text-red-500" />
    ) : null;
  };

  const getStatusBackground = (dia: string) => {
    const status = trainingStatus[dia as keyof typeof trainingStatus];
    if (!status) return '';

    if (theme === 'dark') {
      if (status === 'good') {
        return 'bg-gradient-to-br from-green-900/30 to-green-800/30';
      } else if (status === 'regular') {
        return 'bg-gradient-to-br from-yellow-900/30 to-yellow-800/30';
      } else if (status === 'bad') {
        return 'bg-gradient-to-br from-red-900/30 to-red-800/30';
      }
    } else {
      if (status === 'good') {
        return 'bg-gradient-to-br from-green-50 to-green-100/50';
      } else if (status === 'regular') {
        return 'bg-gradient-to-br from-yellow-50 to-yellow-100/50';
      } else if (status === 'bad') {
        return 'bg-gradient-to-br from-red-50 to-red-100/50';
      }
    }
    return '';
  };

  const addSession = (dia: string) => {
    const newSession: Session = {
      id: `session-${Date.now()}`,
      name: 'Nueva Sesión',
      exercises: [],
    };
    const updatedPlan = {
      ...planSemanal,
      [dia]: {
        ...planSemanal[dia],
        sessions: [...planSemanal[dia].sessions, newSession],
      },
    };
    updatePlan(updatedPlan);
  };

  const getSessionSummary = (session: Session) => {
    const totalSets = session.exercises.reduce((acc, exercise) => acc + exercise.sets.length, 0);
    const totalExercises = session.exercises.length;
    const totalTime = session.exercises.reduce((acc, exercise) => {
      return acc + exercise.sets.reduce((setAcc, set) => setAcc + (set.rest || 0), 0);
    }, 0);

    return {
      totalSets,
      totalExercises,
      estimatedDuration: Math.round(totalTime / 60),
    };
  };

  return (
    <div className="grid gap-6">
      {dias.map((dia) => (
        <motion.div
          key={dia}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl shadow-lg transition-all duration-300
            ${theme === 'dark' 
              ? 'bg-gray-800' 
              : 'bg-white'}
            ${getStatusBackground(dia)}`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {dia}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {planSemanal[dia].sessions.length} sesiones programadas
                </span>
              </div>
              {getStatusIcon(dia)}
            </div>
            <Button
              variant="create"
              onClick={() => addSession(dia)}
              className="flex items-center space-x-2 transform hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-blue-500 to-purple-500"
            >
              <Plus className="w-5 h-5" />
              <span>Añadir Sesión</span>
            </Button>
          </div>
          
          <AnimatePresence>
            <div className="space-y-4">
              {planSemanal[dia].sessions.map((session) => {
                const summary = getSessionSummary(session);
                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-6 rounded-xl transition-all duration-300 border
                      ${theme === 'dark' 
                        ? 'bg-gray-700 border-gray-700' 
                        : 'bg-gray-50 border-gray-200'} 
                      backdrop-blur-sm shadow-lg hover:shadow-xl`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                          {session.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Sesión de entrenamiento
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className={`px-4 py-2 rounded-lg text-sm flex items-center space-x-2
                          ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>{summary.estimatedDuration} min</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className={`p-4 rounded-lg flex items-center space-x-3
                        ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                        <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                          <Dumbbell className="w-4 h-4 text-purple-500" />
                        </div>
                        <div>
                          <span className="text-sm font-medium">{summary.totalExercises}</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Ejercicios</p>
                        </div>
                      </div>
                      <div className={`p-4 rounded-lg flex items-center space-x-3
                        ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                        <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'}`}>
                          <Target className="w-4 h-4 text-green-500" />
                        </div>
                        <div>
                          <span className="text-sm font-medium">{summary.totalSets}</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Series</p>
                        </div>
                      </div>
                      <div className={`p-4 rounded-lg flex items-center space-x-3
                        ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                        <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                          <BarChart2 className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <span className="text-sm font-medium">Alto</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Intensidad</p>
                        </div>
                      </div>
                    </div>

                    {session.exercises.length > 0 ? (
                      <div className="space-y-3">
                        {session.exercises.map((exercise, index) => (
                          <div
                            key={exercise.id}
                            className={`p-4 rounded-lg flex items-center justify-between
                              ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'}`}
                          >
                            <div className="flex items-center space-x-3">
                              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium
                                ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                {index + 1}
                              </span>
                              <span className="font-medium">{exercise.name}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className={`px-3 py-1 rounded-lg text-sm
                                ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                {exercise.sets.length} × {exercise.sets[0]?.reps || 0}
                              </div>
                              {exercise.sets[0]?.weight && (
                                <div className={`px-3 py-1 rounded-lg text-sm
                                  ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                  {exercise.sets[0].weight}kg
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`text-center py-6 rounded-lg border-2 border-dashed
                        ${theme === 'dark' 
                          ? 'border-gray-700 text-gray-500' 
                          : 'border-gray-200 text-gray-400'}`}>
                        <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="font-medium">No hay ejercicios asignados</p>
                        <p className="text-sm mt-1">Añade ejercicios para comenzar</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
              {planSemanal[dia].sessions.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-center py-12 rounded-xl border-2 border-dashed
                    ${theme === 'dark' 
                      ? 'border-gray-700 bg-gray-800/30' 
                      : 'border-gray-200 bg-gray-50/50'}`}
                >
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                    No hay sesiones programadas
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Añade una sesión para comenzar tu planificación
                  </p>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default VistaSimplificada;