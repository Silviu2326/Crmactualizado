import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { PieChart, Activity, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface VistaResumenProps {
  semanaActual: number;
  planSemanal: any;
  updatePlan: (plan: any) => void;
}

const VistaResumen: React.FC<VistaResumenProps> = ({
  semanaActual,
  planSemanal,
}) => {
  const { theme } = useTheme();

  const stats = [
    {
      icon: CalendarIcon,
      title: 'Sesiones Totales',
      value: Object.values(planSemanal).reduce((acc: number, day: any) => 
        acc + day.sessions.length, 0
      ),
      color: 'text-blue-500',
    },
    {
      icon: Activity,
      title: 'Días Activos',
      value: Object.values(planSemanal).filter((day: any) => 
        day.sessions.length > 0
      ).length,
      color: 'text-green-500',
    },
    {
      icon: Clock,
      title: 'Promedio Diario',
      value: (Object.values(planSemanal).reduce((acc: number, day: any) => 
        acc + day.sessions.length, 0
      ) / 7).toFixed(1),
      color: 'text-purple-500',
    },
    {
      icon: PieChart,
      title: 'Completado',
      value: '0%',
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`p-6 rounded-xl shadow-lg transition-all duration-300
                ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'}`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`p-6 rounded-xl shadow-lg
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-xl font-bold mb-6">Distribución Semanal</h3>
        <div className="space-y-4">
          {Object.entries(planSemanal).map(([dia, plan]: [string, any]) => (
            <div key={dia} className="flex items-center space-x-4">
              <div className="w-24 font-medium">{dia}</div>
              <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${(plan.sessions.length / 5) * 100}%` }}
                />
              </div>
              <div className="w-12 text-right">{plan.sessions.length}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VistaResumen;