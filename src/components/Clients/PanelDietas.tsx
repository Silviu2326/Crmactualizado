import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Calendar,
  Target,
  Clock,
  FileText,
  ChevronRight,
  Plus,
  Edit2
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
}

const PanelDietas: React.FC<PanelDietasProps> = ({ clienteId }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Datos de ejemplo
  const planDieta: PlanDieta = {
    nombre: "Plan de Nutrición Personalizado",
    meta: "Pérdida de grasa y mantenimiento de masa muscular",
    fechaInicio: "2024-01-01",
    fechaFin: "2024-03-31",
    duracionSemanas: 12,
    semanasCompletadas: 6,
    dietaHoy: {
      fecha: new Date().toISOString(),
      comidas: [
        {
          nombre: "Desayuno",
          horario: "08:00",
          alimentos: [
            {
              nombre: "Avena",
              cantidad: "50g",
              calorias: 180,
              proteinas: 6,
              carbohidratos: 30,
              grasas: 3
            },
            {
              nombre: "Plátano",
              cantidad: "1 unidad",
              calorias: 105,
              proteinas: 1,
              carbohidratos: 27,
              grasas: 0
            }
          ]
        },
        {
          nombre: "Almuerzo",
          horario: "13:00",
          alimentos: [
            {
              nombre: "Pechuga de pollo",
              cantidad: "150g",
              calorias: 165,
              proteinas: 31,
              carbohidratos: 0,
              grasas: 3.6
            },
            {
              nombre: "Arroz integral",
              cantidad: "100g",
              calorias: 111,
              proteinas: 2.6,
              carbohidratos: 23,
              grasas: 0.9
            }
          ]
        }
      ],
      totalCalorias: 561,
      totalProteinas: 40.6,
      totalCarbohidratos: 80,
      totalGrasas: 7.5
    },
    notas: [
      "Cliente muestra buena adherencia al plan",
      "Ajustar macros según evolución de peso la próxima semana",
      "Considerar aumentar la ingesta de proteínas"
    ]
  };

  const calcularProgreso = () => {
    return (planDieta.semanasCompletadas / planDieta.duracionSemanas) * 100;
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      {/* Encabezado del Plan */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {planDieta.nombre}
            </h2>
            <div className="flex items-center mt-2">
              <Target className="w-5 h-5 mr-2 text-blue-500" />
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {planDieta.meta}
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
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Progreso del Plan
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {planDieta.semanasCompletadas} de {planDieta.duracionSemanas} semanas
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
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Fecha de inicio
              </p>
              <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {formatearFecha(planDieta.fechaInicio)}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-red-500" />
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Fecha de finalización
              </p>
              <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {formatearFecha(planDieta.fechaFin)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dieta de Hoy */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Plan de Hoy
        </h3>
        <div className="space-y-6">
          {planDieta.dietaHoy.comidas.map((comida, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {comida.nombre}
                </h4>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {comida.horario}
                </span>
              </div>
              <div className="space-y-2">
                {comida.alimentos.map((alimento, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className={`${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        {alimento.nombre}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {alimento.cantidad}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        {alimento.calorias} kcal
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        P: {alimento.proteinas}g | C: {alimento.carbohidratos}g | G: {alimento.grasas}g
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Totales del día */}
        <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Totales del día
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Calorías</p>
              <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {planDieta.dietaHoy.totalCalorias} kcal
              </p>
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Proteínas</p>
              <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {planDieta.dietaHoy.totalProteinas}g
              </p>
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Carbohidratos</p>
              <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {planDieta.dietaHoy.totalCarbohidratos}g
              </p>
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Grasas</p>
              <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {planDieta.dietaHoy.totalGrasas}g
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notas */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Notas
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log('Agregar nota')}
          >
            <Plus size={16} className="mr-2" />
            Agregar Nota
          </Button>
        </div>
        <div className="space-y-3">
          {planDieta.notas.map((nota, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}
            >
              <div className="flex items-start">
                <FileText className="w-5 h-5 mr-2 mt-0.5" />
                <p className={`${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {nota}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PanelDietas;
