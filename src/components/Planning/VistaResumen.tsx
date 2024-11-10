import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { BarChart2, Activity, Target, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
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

interface VistaResumenProps {
  semanaActual: number;
  planSemanal: WeekPlan;
}

const VistaResumen: React.FC<VistaResumenProps> = ({ semanaActual, planSemanal }) => {
  const { theme } = useTheme();

  const calcularEstadisticas = () => {
    let totalSesiones = 0;
    let totalEjercicios = 0;
    let totalSeries = 0;
    let totalRepeticiones = 0;

    Object.values(planSemanal).forEach((dia) => {
      totalSesiones += dia.sessions.length;
      dia.sessions.forEach((session) => {
        totalEjercicios += session.exercises.length;
        session.exercises.forEach((exercise) => {
          totalSeries += exercise.sets;
          totalRepeticiones += exercise.sets * exercise.reps;
        });
      });
    });

    return {
      totalSesiones,
      totalEjercicios,
      totalSeries,
      totalRepeticiones,
    };
  };

  const estadisticas = calcularEstadisticas();

  const StatCard = ({ title, value, icon: Icon, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md flex items-center justify-between transform hover:scale-105 transition-all duration-300`}
    >
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <Icon className={`w-12 h-12 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} rounded-xl p-6 shadow-lg transition-all duration-300`}
    >
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        Resumen Semanal - Semana {semanaActual}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Sesiones" value={estadisticas.totalSesiones} icon={BarChart2} delay={0.1} />
        <StatCard title="Total Ejercicios" value={estadisticas.totalEjercicios} icon={Activity} delay={0.2} />
        <StatCard title="Total Series" value={estadisticas.totalSeries} icon={Target} delay={0.3} />
        <StatCard title="Total Repeticiones" value={estadisticas.totalRepeticiones} icon={Clock} delay={0.4} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className={`mt-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}
      >
        <h3 className="text-2xl font-bold mb-4">Desglose por Día</h3>
        <div className="space-y-4">
          {Object.entries(planSemanal).map(([dia, plan], index) => (
            <motion.div
              key={dia}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-md transform hover:scale-102 transition-all duration-300`}
            >
              <h4 className="font-semibold mb-2">{dia}</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <p>Sesiones: {plan.sessions.length}</p>
                <p>Ejercicios: {plan.sessions.reduce((acc, session) => acc + session.exercises.length, 0)}</p>
                <p>Series: {plan.sessions.reduce((acc, session) => acc + session.exercises.reduce((acc2, exercise) => acc2 + exercise.sets, 0), 0)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VistaResumen;