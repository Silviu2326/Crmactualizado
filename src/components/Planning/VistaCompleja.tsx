// src/components/VistaCompleja.tsx

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Plus, Calendar, AlertCircle, XCircle, Search } from 'lucide-react';
import Button from '../Common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import ExerciseSelector from './ExerciseSelector';
import SesionEntrenamiento from './SesionEntrenamiento';
import { trainingVariants, Set } from './trainingVariants'; // Importar desde archivo común
import {
  predefinedExercises,
  Exercise as PredefinedExercise,
} from './predefinedExercises'; // Importar ejercicios predefinidos

// Simulated external data for training status
const trainingStatus = {
  Lunes: 'regular',
  Martes: 'good',
  Miércoles: 'good',
  Jueves: 'regular',
  Viernes: 'good',
  Sábado: 'bad',
  Domingo: 'good',
} as const;

// Definición de interfaces
interface Exercise {
  id: string;
  name: string;
  sets: Set[];
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

interface VistaComplejaProps {
  semanaActual: number;
  planSemanal: WeekPlan;
  updatePlan: (plan: WeekPlan) => void;
}

const VistaCompleja: React.FC<VistaComplejaProps> = ({
  semanaActual,
  planSemanal,
  updatePlan,
}) => {
  const { theme } = useTheme();
  const [diaSeleccionado, setDiaSeleccionado] = useState('Lunes');
  const [filtro, setFiltro] = useState('');
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [selectedSessionInfo, setSelectedSessionInfo] = useState<{
    dia: string;
    sessionId: string;
  } | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<0 | 1 | 2 | 3>(0);

  const dias = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  // Función para obtener el estado del día anterior
  const getPreviousDayStatus = (
    currentDay: string
  ): 'good' | 'regular' | 'bad' | undefined => {
    const diasOrdenados = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ];
    const currentIndex = diasOrdenados.indexOf(currentDay);

    if (currentIndex <= 0) return undefined; // Lunes o día inválido

    const previousDay = diasOrdenados[currentIndex - 1];
    const status = trainingStatus[previousDay as keyof typeof trainingStatus];

    return status;
  };

  // Función para determinar la variante basada en el estado del día anterior
  const determineVariant = (currentDay: string): 0 | 1 | 2 | 3 => {
    const previousStatus = getPreviousDayStatus(currentDay);

    switch (previousStatus) {
      case 'good':
        return 1; // Verde
      case 'regular':
        return 2; // Amarillo
      case 'bad':
        return 3; // Rojo
      default:
        return 0; // Normal
    }
  };

  // Función para manejar el cambio de variante
  const handleVariantChange = (variant: 0 | 1 | 2 | 3) => {
    if (variant === selectedVariant) return; // Evita actualizaciones innecesarias

    const variantInfo = trainingVariants[variant];
    const requiredSetCount = variantInfo.setCount;

    // Seleccionar el día actual
    const updatedPlan: WeekPlan = {
      ...planSemanal,
      [diaSeleccionado]: {
        ...planSemanal[diaSeleccionado],
        sessions: planSemanal[diaSeleccionado].sessions.map((session) => ({
          ...session,
          exercises: session.exercises.map((exercise) => ({
            ...exercise,
            sets: trainingVariants[variant]
              .setModifier(
                // Asegurar que haya suficientes sets
                [...exercise.sets],
                exercise.name
              )
              .slice(0, requiredSetCount), // Limitar al setCount requerido
          })),
        })),
      },
    };

    // Debug para ver los sets antes y después
    console.log('Antes:', planSemanal[diaSeleccionado].sessions);
    console.log('Después:', updatedPlan[diaSeleccionado].sessions);

    setSelectedVariant(variant);
    updatePlan(updatedPlan); // Actualiza el plan sin causar bucles
  };

  // Actualizar la variante cuando cambia el día seleccionado
  useEffect(() => {
    const newVariant = determineVariant(diaSeleccionado);
    if (newVariant !== selectedVariant) {
      handleVariantChange(newVariant);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diaSeleccionado]);

  // Función para obtener el icono de estado
  const getStatusIcon = (dia: string) => {
    const status = trainingStatus[dia as keyof typeof trainingStatus];
    if (!status || status === 'good') return null;

    return status === 'regular' ? (
      <div className="absolute top-2 right-2">
        <AlertCircle className="w-6 h-6 text-yellow-500" />
      </div>
    ) : status === 'bad' ? (
      <div className="absolute top-2 right-2">
        <XCircle className="w-6 h-6 text-red-500" />
      </div>
    ) : null;
  };

  // Función para obtener el fondo basado en el estado
  const getStatusBackground = (dia: string, isSelected: boolean = false) => {
    const status = trainingStatus[dia as keyof typeof trainingStatus];
    if (!status) {
      return isSelected
        ? theme === 'dark'
          ? 'bg-blue-600 text-white'
          : 'bg-blue-500 text-white'
        : '';
    }

    if (theme === 'dark') {
      if (status === 'good') {
        return isSelected
          ? 'bg-gradient-to-br from-green-800 to-green-700 text-white'
          : 'bg-gradient-to-br from-green-900/30 to-green-800/30';
      } else if (status === 'regular') {
        return isSelected
          ? 'bg-gradient-to-br from-yellow-800 to-yellow-700 text-white'
          : 'bg-gradient-to-br from-yellow-900/30 to-yellow-800/30';
      } else if (status === 'bad') {
        return isSelected
          ? 'bg-gradient-to-br from-red-800 to-red-700 text-white'
          : 'bg-gradient-to-br from-red-900/30 to-red-800/30';
      }
    } else {
      if (status === 'good') {
        return isSelected
          ? 'bg-gradient-to-br from-green-200 to-green-300 text-green-900'
          : 'bg-gradient-to-br from-green-50 to-green-100/50';
      } else if (status === 'regular') {
        return isSelected
          ? 'bg-gradient-to-br from-yellow-200 to-yellow-300 text-yellow-900'
          : 'bg-gradient-to-br from-yellow-50 to-yellow-100/50';
      } else if (status === 'bad') {
        return isSelected
          ? 'bg-gradient-to-br from-red-200 to-red-300 text-red-900'
          : 'bg-gradient-to-br from-red-50 to-red-100/50';
      }
    }
    return '';
  };

  // Función para obtener el color de la variante
  const getVariantColor = (variant: 0 | 1 | 2 | 3) => {
    switch (variant) {
      case 0:
        return theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200';
      case 1:
        return 'bg-gradient-to-r from-green-500 to-green-600';
      case 2:
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 3:
        return 'bg-gradient-to-r from-red-500 to-red-600';
    }
  };

  // Función para manejar la adición de una nueva sesión
  const handleAddSession = (dia: string) => {
    const newSession: Session = {
      id: `session-${Date.now()}`,
      name: 'Nueva Sesión',
      exercises: [],
    };
    const updatedPlan: WeekPlan = {
      ...planSemanal,
      [dia]: {
        ...planSemanal[dia],
        sessions: [...planSemanal[dia].sessions, newSession],
      },
    };
    updatePlan(updatedPlan);
  };

  // Función para manejar la eliminación de una sesión
  const handleDeleteSession = (dia: string, sessionId: string) => {
    const updatedPlan: WeekPlan = {
      ...planSemanal,
      [dia]: {
        ...planSemanal[dia],
        sessions: planSemanal[dia].sessions.filter(
          (session) => session.id !== sessionId
        ),
      },
    };
    updatePlan(updatedPlan);
  };

  // Función para manejar la adición de un ejercicio
  const handleAddExercise = (dia: string, sessionId: string) => {
    setSelectedSessionInfo({ dia, sessionId });
    setShowExerciseSelector(true);
  };

  // Función para manejar la selección de un ejercicio desde el selector
  const handleSelectExercise = (exerciseTemplate: PredefinedExercise) => {
    if (!selectedSessionInfo) return;

    const { dia, sessionId } = selectedSessionInfo;
    const currentVariant = selectedVariant;

    const variantInfo = trainingVariants[currentVariant];
    const requiredSetCount = variantInfo.setCount;

    // Copiar las series por defecto del ejercicio
    let initialSets = [...exerciseTemplate.defaultSets];

    // Si el número de sets por defecto es menor que el requerido, añadir sets adicionales
    while (initialSets.length < requiredSetCount) {
      initialSets.push({ reps: 0, weight: 0, rest: 60 }); // Valores por defecto para series adicionales
    }

    // Aplicar el setModifier de la variante
    const modifiedSets = variantInfo.setModifier(
      initialSets,
      exerciseTemplate.name
    );

    // Asegurarse de que solo se incluyen las series requeridas
    const finalSets = modifiedSets.slice(0, requiredSetCount);

    const newExercise: Exercise = {
      id: `exercise-${Date.now()}`,
      name: exerciseTemplate.name,
      sets: finalSets.map((set) => ({
        id: `set-${Date.now()}-${Math.random()}`,
        reps: set.reps,
        weight: set.weight,
        rest: set.rest,
      })),
    };

    const updatedPlan: WeekPlan = {
      ...planSemanal,
      [dia]: {
        ...planSemanal[dia],
        sessions: planSemanal[dia].sessions.map((session) =>
          session.id === sessionId
            ? { ...session, exercises: [...session.exercises, newExercise] }
            : session
        ),
      },
    };

    updatePlan(updatedPlan);
  };

  // Función para filtrar las sesiones según el criterio
  const filteredSessions = (dia: string) => {
    if (!filtro) return planSemanal[dia].sessions;
    return planSemanal[dia].sessions.filter(
      (session) =>
        session.name.toLowerCase().includes(filtro.toLowerCase()) ||
        session.exercises.some((exercise) =>
          exercise.name.toLowerCase().includes(filtro.toLowerCase())
        )
    );
  };

  return (
    <>
      <ExerciseSelector
        isOpen={showExerciseSelector}
        onClose={() => setShowExerciseSelector(false)}
        onSelectExercise={handleSelectExercise}
      />

      <div className="space-y-6">
        {/* Grid de días de la semana */}
        <div className="grid grid-cols-7 gap-2">
          {dias.map((dia) => (
            <motion.div
              key={dia}
              className={`relative rounded-xl transition-all duration-300 transform hover:scale-105 overflow-hidden shadow-lg
                ${
                  diaSeleccionado === dia
                    ? getStatusBackground(dia, true)
                    : theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-white hover:bg-gray-50'
                } ${diaSeleccionado !== dia ? getStatusBackground(dia) : ''}`}
            >
              {getStatusIcon(dia)}
              <button
                onClick={() => setDiaSeleccionado(dia)}
                className="w-full p-4 text-center"
              >
                <div className="flex flex-col items-center space-y-2">
                  <Calendar
                    className={`w-6 h-6 ${
                      diaSeleccionado === dia ? 'text-current' : 'text-blue-500'
                    }`}
                  />
                  <span className="font-medium">{dia}</span>
                  <span className="text-sm opacity-75">
                    {planSemanal[dia].sessions.length} sesiones
                  </span>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Contenido del día seleccionado */}
        <AnimatePresence mode="wait">
          <motion.div
            key={diaSeleccionado}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-6 rounded-xl shadow-lg ${getStatusBackground(
              diaSeleccionado
            )}
              ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold">{diaSeleccionado}</h2>
                {getStatusIcon(diaSeleccionado)}
              </div>

              {/* Controles de variantes */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {[0, 1, 2, 3].map((variant) => (
                    <button
                      key={variant}
                      onClick={() =>
                        handleVariantChange(variant as 0 | 1 | 2 | 3)
                      }
                      className={`px-6 py-3 rounded-lg transition-all duration-300 ${getVariantColor(
                        variant as 0 | 1 | 2 | 3
                      )} ${
                        selectedVariant === variant
                          ? 'ring-2 ring-blue-500 transform scale-105'
                          : 'hover:opacity-90'
                      } text-white shadow-lg`}
                      aria-label={`Seleccionar variante ${
                        trainingVariants[
                          variant as keyof typeof trainingVariants
                        ].name
                      }`}
                    >
                      {
                        trainingVariants[
                          variant as keyof typeof trainingVariants
                        ].name
                      }
                    </button>
                  ))}
                </div>
              </div>

              {/* Controles de filtrado y añadir sesión */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    placeholder="Filtrar..."
                    className={`pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all
                      ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                      }`}
                  />
                </div>
                <Button
                  variant="create"
                  onClick={() => handleAddSession(diaSeleccionado)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Añadir Sesión</span>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredSessions(diaSeleccionado).map((session) => (
                <SesionEntrenamiento
                  key={session.id}
                  session={session}
                  diaSeleccionado={diaSeleccionado}
                  onDeleteSession={() =>
                    handleDeleteSession(diaSeleccionado, session.id)
                  }
                  onAddExercise={() =>
                    handleAddExercise(diaSeleccionado, session.id)
                  }
                  planSemanal={planSemanal}
                  updatePlan={updatePlan}
                  variant={selectedVariant}
                  previousDayStatus={getPreviousDayStatus(diaSeleccionado)}
                />
              ))}

              {filteredSessions(diaSeleccionado).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay sesiones programadas para este día
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default VistaCompleja;
