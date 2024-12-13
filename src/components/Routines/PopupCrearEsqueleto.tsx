import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { WeekSelector } from './WeekSelector';
import { ExercisePeriod } from './ExercisePeriod';
import { NavigationButtons } from './NavigationButtons';

interface WeekRange {
  start: number;
  end: number;
}

interface RenderConfig {
  campo1: string;
  campo2: string;
  campo3: string;
}

interface Set {
  reps: number;
  weight: number;
  weightType: 'absolute' | 'relative';
  rest: number;
  rpe: number;
  renderConfig: RenderConfig;
}

interface Exercise {
  exercise: string;
  orden: number;
  sets: Set[];
  notas: string;
}

interface Session {
  nombre: string;
  descripcion: string;
  exercises: Exercise[];
}

interface Variant {
  nombre: string;
  descripcion: string;
  sessions: Session[];
}

interface Day {
  dayNumber: number;
  variants: Variant[];
}

interface Plan {
  semanas: number;
  days: Day[];
}

interface Skeleton {
  _id?: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  dificultad: string;
  plan: Plan;
  semanas?: number;
}

interface PopupCrearEsqueletoProps {
  onClose: () => void;
  onSubmit?: (data: Skeleton) => void;
}

const PopupCrearEsqueleto: React.FC<PopupCrearEsqueletoProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(0);
  const [skeletonData, setSkeletonData] = useState<Skeleton>({
    nombre: '',
    descripcion: '',
    tipo: '',
    dificultad: '',
    plan: {
      semanas: 4,
      days: []
    }
  });
  const [skeletons, setSkeletons] = useState<Skeleton[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeeks, setSelectedWeeks] = useState<WeekRange[]>([]);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const fetchSkeletons = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/esqueleto/esqueletos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los esqueletos');
        }

        const data = await response.json();
        setSkeletons(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los esqueletos');
      } finally {
        setLoading(false);
      }
    };

    fetchSkeletons();
  }, []);

  const handleWeekSelect = (weekNumber: number) => {
    if (!selectionStart) {
      setSelectionStart(weekNumber);
    } else {
      const start = Math.min(selectionStart, weekNumber);
      const end = Math.max(selectionStart, weekNumber);
      
      const overlaps = selectedWeeks.some(range => 
        (start <= range.end && end >= range.start)
      );

      if (!overlaps) {
        setSelectedWeeks([...selectedWeeks, { start, end }]);
        // Actualizar el plan con las semanas seleccionadas
        setSkeletonData(prev => ({
          ...prev,
          plan: {
            ...prev.plan,
            semanas: Math.max(...selectedWeeks.map(w => w.end), end)
          }
        }));
      }
      
      setSelectionStart(null);
    }
  };

  const getPreviewRange = () => {
    if (!selectionStart || !hoveredWeek) return null;
    return {
      start: Math.min(selectionStart, hoveredWeek),
      end: Math.max(selectionStart, hoveredWeek)
    };
  };

  const handleRemovePeriod = (index: number) => {
    setSelectedWeeks(selectedWeeks.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!skeletonData.nombre.trim() || !skeletonData.descripcion.trim() || !skeletonData.tipo || !skeletonData.dificultad) {
        alert('Por favor, complete todos los campos obligatorios');
        return;
      }
    }

    if (step === 2 && selectedWeeks.length === 0) {
      alert('Por favor, seleccione al menos un período de semanas');
      return;
    }

    if (step === 3 && onSubmit) {
      // Convertir los períodos seleccionados a la estructura del plan
      const days: Day[] = [];
      selectedWeeks.forEach(week => {
        for (let i = week.start; i <= week.end; i++) {
          days.push({
            dayNumber: i,
            variants: [{
              nombre: "Variante A",
              descripcion: "Entrenamiento principal",
              sessions: [{
                nombre: "Sesión Principal",
                descripcion: "Entrenamiento del día",
                exercises: exercises
              }]
            }]
          });
        }
      });

      const finalData = {
        ...skeletonData,
        plan: {
          ...skeletonData.plan,
          days
        }
      };

      onSubmit(finalData);
      onClose();
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  const handleStartCreation = () => {
    setStep(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-100 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
      >
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 0 ? 'Esqueletos de Rutina' : 'Crear Esqueleto de Rutina'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 0 ? (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Esqueletos Existentes</h3>
                {loading ? (
                  <p>Cargando esqueletos...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                          <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                          <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semanas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {skeletons.map((skeleton) => (
                          <tr key={skeleton._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap border-b">{skeleton.nombre}</td>
                            <td className="px-6 py-4 whitespace-nowrap border-b">{skeleton.descripcion}</td>
                            <td className="px-6 py-4 whitespace-nowrap border-b">{skeleton.semanas}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleStartCreation}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Crear Nuevo Esqueleto
                </button>
              </div>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Crear Nuevo Esqueleto</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Esqueleto *
                      </label>
                      <input
                        type="text"
                        value={skeletonData.nombre}
                        onChange={(e) => setSkeletonData({...skeletonData, nombre: e.target.value})}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ingrese el nombre del esqueleto"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción *
                      </label>
                      <textarea
                        value={skeletonData.descripcion}
                        onChange={(e) => setSkeletonData({...skeletonData, descripcion: e.target.value})}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ingrese una descripción para el esqueleto"
                        rows={4}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo *
                      </label>
                      <select
                        value={skeletonData.tipo}
                        onChange={(e) => setSkeletonData({...skeletonData, tipo: e.target.value})}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Seleccione un tipo</option>
                        <option value="Fuerza">Fuerza</option>
                        <option value="Hipertrofia">Hipertrofia</option>
                        <option value="Resistencia">Resistencia</option>
                        <option value="Pérdida de peso">Pérdida de peso</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dificultad *
                      </label>
                      <select
                        value={skeletonData.dificultad}
                        onChange={(e) => setSkeletonData({...skeletonData, dificultad: e.target.value})}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Seleccione una dificultad</option>
                        <option value="Principiante">Principiante</option>
                        <option value="Intermedio">Intermedio</option>
                        <option value="Avanzado">Avanzado</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <WeekSelector
                  selectedWeeks={selectedWeeks}
                  onWeekSelect={handleWeekSelect}
                  onNext={handleNext}
                  selectionStart={selectionStart}
                  hoveredWeek={hoveredWeek}
                  setHoveredWeek={setHoveredWeek}
                  onRemovePeriod={handleRemovePeriod}
                  getPreviewRange={getPreviewRange}
                />
              )}

              {step === 3 && selectedWeeks.map((period, index) => (
                <ExercisePeriod
                  key={index}
                  period={period}
                  exercises={exercises}
                  onModify={(exercise) => {
                    setExercises(prev => [...prev, exercise]);
                  }}
                  onMakeConditional={() => {}}
                  onRemoveConditional={() => {}}
                />
              ))}

              <div className="mt-6">
                <NavigationButtons
                  onBack={handleBack}
                  onNext={handleNext}
                  nextLabel={step === 3 ? "Finalizar" : "Siguiente"}
                  showNext={true}
                />
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PopupCrearEsqueleto;