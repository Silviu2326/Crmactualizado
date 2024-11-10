import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// ... (interfaces permanecen iguales)

const VistaCalendario: React.FC<VistaCalendarioProps> = ({ semanaActual, planSemanal }) => {
  const { theme } = useTheme();
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const getRandomTime = () => {
    const hours = Math.floor(Math.random() * 12) + 7; // 7 AM to 7 PM
    const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, or 45 minutes
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} rounded-xl p-6 shadow-lg transition-all duration-300`}
    >
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        Vista Calendario - Semana {semanaActual}
      </h2>
      <div className="grid grid-cols-7 gap-4">
        {dias.map((dia, index) => (
          <motion.div
            key={dia}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4`}
          >
            <h3 className="font-bold text-lg mb-2 flex items-center justify-center">
              <Calendar className="w-5 h-5 mr-2" />
              {dia}
            </h3>
            <div className="space-y-2">
              {planSemanal[dia].sessions.map((session, sessionIndex) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: sessionIndex * 0.1 }}
                  className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} p-2 rounded-md`}
                >
                  <h4 className="font-semibold text-sm mb-1 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {getRandomTime()} - {session.name}
                  </h4>
                  <ul className="text-xs space-y-1">
                    {session.exercises.map((exercise) => (
                      <li key={exercise.id} className="flex justify-between">
                        <span>{exercise.name}</span>
                        <span>{exercise.sets}x{exercise.reps}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default VistaCalendario;