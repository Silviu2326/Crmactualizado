import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { TrendingUp, Award, Target, Calendar } from 'lucide-react';

interface VistaProgresoProps {
  semanaActual: number;
}

const VistaProgreso: React.FC<VistaProgresoProps> = ({
  semanaActual,
}) => {
  const { theme } = useTheme();

  const progressData = [
    { label: 'Semana 1', completed: 100 },
    { label: 'Semana 2', completed: 85 },
    { label: 'Semana 3', completed: 70 },
    { label: 'Semana 4', completed: 60 },
    { label: 'Semana 5', completed: 30 },
    { label: 'Semana 6', completed: 0 },
  ];

  const achievements = [
    { icon: Award, title: 'Primera Semana Completada', description: '¡Completaste tu primera semana de entrenamiento!' },
    { icon: Target, title: 'Consistencia', description: '3 días consecutivos de entrenamiento' },
    { icon: Calendar, title: 'Compromiso', description: 'No has perdido ningún día programado' },
  ];

  return (
    <div className="space-y-8">
      <div className={`p-6 rounded-xl shadow-lg
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold">Progreso General</h2>
        </div>

        <div className="space-y-6">
          {progressData.map((week, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{week.label}</span>
                <span className="text-sm text-gray-500">{week.completed}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${week.completed}%` }}
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