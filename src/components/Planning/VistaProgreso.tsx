import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { TrendingUp, Award, Target, Calendar } from 'lucide-react';

interface WeekPlan {
  [key: string]: {
    id: string;
    sessions: Array<{
      _id?: string;
      name: string;
      tipo: 'Normal' | 'Superset';
      rondas?: number;
      exercises: Array<{
        _id: string;
        name: string;
        sets: Array<{
          id: string;
          reps: number;
          weight: number;
          rest: number;
        }>;
      }>;
    }>;
  };
}

interface VistaProgresoProps {
  semanaActual: number;
  planSemanal: WeekPlan;
}

const VistaProgreso: React.FC<VistaProgresoProps> = ({
  semanaActual,
  planSemanal,
}) => {
  const { theme } = useTheme();

  // Calcular el progreso por día
  const calcularProgresoDia = (dia: string) => {
    if (!planSemanal) return 0;
    const dayPlan = planSemanal[dia];
    if (!dayPlan?.sessions?.length) return 0;

    let totalExercises = 0;
    let completedExercises = 0;

    dayPlan.sessions.forEach(session => {
      if (!session?.exercises) return;
      session.exercises.forEach(exercise => {
        if (!exercise?.sets) return;
        totalExercises++;
        const isCompleted = exercise.sets.every(set => set && set.reps > 0 && set.weight > 0);
        if (isCompleted) completedExercises++;
      });
    });

    return totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
  };

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const progressData = dias.map(dia => ({
    label: dia,
    completed: Math.round(calcularProgresoDia(dia)),
  }));

  // Calcular logros basados en el progreso real
  const calcularLogros = () => {
    if (!planSemanal) return [];
    
    const logros = [];
    const diasConSesiones = dias.filter(dia => 
      planSemanal[dia]?.sessions?.length > 0
    ).length;

    if (diasConSesiones >= 1) {
      logros.push({
        icon: Award,
        title: 'Planificación Iniciada',
        description: '¡Has comenzado tu planificación de entrenamiento!'
      });
    }

    const diasCompletados = dias.filter(dia => 
      calcularProgresoDia(dia) === 100
    ).length;

    if (diasCompletados >= 3) {
      logros.push({
        icon: Target,
        title: 'Consistencia',
        description: `${diasCompletados} días completados`
      });
    }

    const totalProgress = dias.reduce((acc, dia) => acc + calcularProgresoDia(dia), 0) / 7;
    if (totalProgress >= 50) {
      logros.push({
        icon: Calendar,
        title: 'Compromiso',
        description: 'Más del 50% del plan completado'
      });
    }

    return logros;
  };

  const achievements = calcularLogros();

  return (
    <div className="space-y-8">
      <div className={`p-6 rounded-xl shadow-lg
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold">Progreso General - Semana {semanaActual}</h2>
        </div>

        <div className="space-y-6">
          {progressData.map((day, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{day.label}</span>
                <span className="text-sm text-gray-500">{day.completed}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${day.completed}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-6 rounded-xl shadow-lg
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-bold mb-6">Logros</h2>
        <div className="grid gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg flex items-start space-x-4
                  ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <Icon className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{achievement.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VistaProgreso;