import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { BarChart2, Activity, TrendingUp, Clock, Target, Dumbbell } from 'lucide-react';

interface VistaEstadisticasProps {
  semanaActual: number;
  planSemanal: any;
  updatePlan: (plan: any) => void;
}

const VistaEstadisticas: React.FC<VistaEstadisticasProps> = ({
  semanaActual,
  planSemanal,
}) => {
  const { theme } = useTheme();

  const metricas = [
    {
      categoria: 'Intensidad',
      datos: [
        { label: 'Alta', valor: 30 },
        { label: 'Media', valor: 45 },
        { label: 'Baja', valor: 25 },
      ],
      icon: Activity,
      color: 'bg-red-500',
    },
    {
      categoria: 'Duración',
      datos: [
        { label: '60+ min', valor: 20 },
        { label: '30-60 min', valor: 60 },
        { label: '0-30 min', valor: 20 },
      ],
      icon: Clock,
      color: 'bg-blue-500',
    },
    {
      categoria: 'Tipo de Ejercicio',
      datos: [
        { label: 'Fuerza', valor: 40 },
        { label: 'Cardio', valor: 35 },
        { label: 'Flexibilidad', valor: 25 },
      ],
      icon: Dumbbell,
      color: 'bg-green-500',
    },
  ];

  const tendencias = [
    { dia: 'Lun', valor: 85 },
    { dia: 'Mar', valor: 75 },
    { dia: 'Mie', valor: 90 },
    { dia: 'Jue', valor: 65 },
    { dia: 'Vie', valor: 80 },
    { dia: 'Sab', valor: 70 },
    { dia: 'Dom', valor: 60 },
  ];

  return (
    <div className="space-y-8">
      <div className={`p-6 rounded-xl shadow-lg
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center space-x-3 mb-6">
          <BarChart2 className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold">Estadísticas Detalladas</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metricas.map((metrica, index) => {
            const Icon = metrica.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Icon className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold">{metrica.categoria}</h3>
                </div>
                <div className="space-y-3">
                  {metrica.datos.map((dato, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{dato.label}</span>
                        <span>{dato.valor}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${metrica.color} transition-all duration-300`}
                          style={{ width: `${dato.valor}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`p-6 rounded-xl shadow-lg
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-6 h-6 text-green-500" />
          <h2 className="text-xl font-bold">Tendencias Semanales</h2>
        </div>

        <div className="h-64 flex items-end space-x-4">
          {tendencias.map((dia, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t transition-all duration-300"
                style={{ height: `${dia.valor}%` }}
              />
              <span className="mt-2 text-sm font-medium">{dia.dia}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-6 rounded-xl shadow-lg
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center space-x-3 mb-6">
          <Target className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-bold">Objetivos y Métricas</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className="font-semibold mb-4">Cumplimiento de Objetivos</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Progreso
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    75%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: "75%" }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                />
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className="font-semibold mb-4">Rendimiento General</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Intensidad Promedio</span>
                <span className="font-medium">7.5/10</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Consistencia</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Recuperación</span>
                <span className="font-medium">Óptima</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaEstadisticas;