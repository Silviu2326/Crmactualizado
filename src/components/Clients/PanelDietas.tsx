import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Calendar,
  Target,
  Clock,
  FileText,
  ChevronRight,
  Plus,
  Edit2,
  Activity
} from 'lucide-react';
import Button from '../Common/Button';

interface Comida {
  nombre: string;
  horario: string;
  alimentos: {
    nombre: string;
    cantidad: string;
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  }[];
}

interface DietaHoy {
  fecha: string;
  comidas: Comida[];
  totalCalorias: number;
  totalProteinas: number;
  totalCarbohidratos: number;
  totalGrasas: number;
}

interface PlanDieta {
  nombre: string;
  meta: string;
  fechaInicio: string;
  fechaFin: string;
  duracionSemanas: number;
  semanasCompletadas: number;
  dietaHoy: DietaHoy;
  notas: string[];
}

interface PanelDietasProps {
  clienteId: string;
  dietDetails: {
    nombre: string;
    objetivo: string;
    restricciones: string;
    estado: string;
    fechaInicio: string;
    semanas: any[];
  };
}

const PanelDietas: React.FC<PanelDietasProps> = ({ clienteId, dietDetails }) => {
  const { theme } = useTheme();
  
  const calcularProgreso = () => {
    // Calcula el progreso basado en las semanas completadas
    const semanasCompletadas = dietDetails.semanas.filter(semana => {
      // Aquí puedes implementar tu lógica para determinar si una semana está completada
      return true; // Por ahora retornamos true como ejemplo
    }).length;
    return (semanasCompletadas / dietDetails.semanas.length) * 100;
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      {/* Encabezado del Plan */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {dietDetails.nombre}
            </h2>
            <div className="flex items-center mt-2">
              <Target className="w-5 h-5 mr-2 text-blue-500" />
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {dietDetails.objetivo}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log('Editar plan')}
          >
            <Edit2 size={16} className="mr-2" />
            Editar Plan
          </Button>
        </div>

        {/* Barra de Progreso */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Progreso del Plan
            </span>
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {dietDetails.semanas.length} semanas
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${calcularProgreso()}%` }}
            ></div>
          </div>
        </div>

        {/* Duración */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-500" />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Fecha de inicio
              </p>
              <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                {formatearFecha(dietDetails.fechaInicio)}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-red-500" />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Estado
              </p>
              <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                {dietDetails.estado}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Restricciones */}
      <div className="p-6">
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Restricciones
        </h3>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {dietDetails.restricciones}
        </p>
      </div>
    </div>
  );
};

export default PanelDietas;
