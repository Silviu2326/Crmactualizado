import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
  Apple,
  Utensils,
  Calendar as CalendarIcon,
  Plus,
  FileText,
  TrendingUp,
  Scale,
  Heart,
  AlertCircle,
  Clock,
  Salad,
  Coffee,
} from 'lucide-react';
import Button from '../Common/Button';

interface PanelDietasProps {
  clienteId: string;
}

interface Comida {
  nombre: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  horario: string;
}

interface DiaComidas {
  fecha: string;
  comidas: Comida[];
  totales: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  };
}

const PanelDietas: React.FC<PanelDietasProps> = ({ clienteId }) => {
  const { theme } = useTheme();
  const [showNewMealForm, setShowNewMealForm] = useState(false);
  
  // Datos de ejemplo
  const [planActual] = useState({
    nombre: 'Plan de Definición',
    objetivo: 'Pérdida de grasa',
    caloriasDiarias: 2200,
    distribucion: {
      proteinas: 30,
      carbohidratos: 40,
      grasas: 30
    },
    fechaInicio: '2024-01-01',
    duracion: '12 semanas'
  });

  const [diaActual] = useState<DiaComidas>({
    fecha: new Date().toISOString(),
    comidas: [
      {
        nombre: 'Desayuno',
        calorias: 450,
        proteinas: 30,
        carbohidratos: 45,
        grasas: 15,
        horario: '08:00'
      },
      {
        nombre: 'Almuerzo',
        calorias: 650,
        proteinas: 40,
        carbohidratos: 65,
        grasas: 25,
        horario: '13:00'
      },
      {
        nombre: 'Merienda',
        calorias: 300,
        proteinas: 20,
        carbohidratos: 35,
        grasas: 10,
        horario: '16:00'
      }
    ],
    totales: {
      calorias: 1400,
      proteinas: 90,
      carbohidratos: 145,
      grasas: 50
    }
  });

  const handleNewMeal = () => {
    setShowNewMealForm(true);
  };

  return (
    <div className="flex flex-col w-full h-full gap-6">
      {/* Encabezado y Botón de Nueva Comida */}
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} flex justify-between items-center`}>
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Plan Nutricional
          </h2>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {planActual.nombre} - {planActual.objetivo}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleNewMeal}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Comida</span>
        </Button>
      </div>

      {/* Resumen Nutricional */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Utensils className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Calorías
            </h3>
          </div>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            {diaActual.totales.calorias} / {planActual.caloriasDiarias}
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            kcal consumidas
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Apple className={theme === 'dark' ? 'text-red-400' : 'text-red-600'} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Proteínas
            </h3>
          </div>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            {diaActual.totales.proteinas}g
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {planActual.distribucion.proteinas}% del total
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Coffee className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Carbohidratos
            </h3>
          </div>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            {diaActual.totales.carbohidratos}g
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {planActual.distribucion.carbohidratos}% del total
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Salad className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Grasas
            </h3>
          </div>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            {diaActual.totales.grasas}g
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {planActual.distribucion.grasas}% del total
          </p>
        </motion.div>
      </div>

      {/* Detalles del Plan */}
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Detalles del Plan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Inicio: {new Date(planActual.fechaInicio).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} />
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Duración: {planActual.duracion}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Objetivo: {planActual.objetivo}
            </span>
          </div>
        </div>
      </div>

      {/* Comidas del Día */}
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Comidas del Día
        </h3>
        <div className="space-y-4">
          {diaActual.comidas.map((comida, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              } hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {comida.nombre} - {comida.horario}
                  </span>
                </div>
                <span className={`font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                  {comida.calorias} kcal
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Apple className="w-4 h-4" />
                  <span>P: {comida.proteinas}g</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4" />
                  <span>C: {comida.carbohidratos}g</span>
                </div>
                <div className="flex items-center gap-2">
                  <Salad className="w-4 h-4" />
                  <span>G: {comida.grasas}g</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal de Nueva Comida */}
      {showNewMealForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-full max-w-md`}
          >
            <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Añadir Nueva Comida
            </h3>
            {/* Aquí iría el formulario de nueva comida */}
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="secondary"
                onClick={() => setShowNewMealForm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // Aquí iría la lógica para guardar la comida
                  setShowNewMealForm(false);
                }}
              >
                Guardar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PanelDietas;
