import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Dumbbell, Clock, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  rest?: number;
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

interface VistaEjerciciosDetalladosProps {
  semanaActual: number;
  planSemanal: WeekPlan;
}

const VistaEjerciciosDetallados: React.FC<VistaEjerciciosDetalladosProps> = ({ semanaActual, planSemanal }) => {
  const { theme } = useTheme();
  const [expandedDay, setExpandedDay] = React.useState<string | null>(null);

  const toggleDay = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} rounded-xl p-6 shadow-lg`}
    >
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        Ejercicios Detallados - Semana {semanaActual}
      </h2>
      {Object.entries(planSemanal).map(([day, dayPlan]) => (
        <motion.div
          key={day}
          className={`mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}
        >
          <motion.button
            className={`w-full p-4 flex justify-between items-center ${
              theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            } transition-colors duration-200`}
            onClick={() => toggleDay(day)}
          >
            <span className="text-xl font-semibold">{day}</span>
            {expandedDay === day ? <ChevronUp /> : <ChevronDown />}
          </motion.button>
          <AnimatePresence>
            {expandedDay === day && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {dayPlan.sessions.map((session) => (
                  <div key={session.id} className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold mb-2">{session.name}</h4>
                    {session.exercises.map((exercise) => (
                      <div key={exercise.id} className="ml-4 mb-2 flex items-center">
                        <Dumbbell className="mr-2 w-5 h-5 text-blue-500" />
                        <span className="flex-grow">{exercise.name}</span>
                        <span className="mr-4">{exercise.sets} x {exercise.reps}</span>
                        {exercise.weight && <span className="mr-4">{exercise.weight} kg</span>}
                        {exercise.rest && (
                          <span className="flex items-center">
                            <Clock className="mr-1 w-4 h-4" />
                            {exercise.rest}s
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default VistaEjerciciosDetallados;