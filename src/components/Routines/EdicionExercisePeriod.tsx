import React, { useEffect, useState } from 'react';
import { Search, Plus, Minus, Edit2, ChevronDown, ChevronUp, X } from 'lucide-react';
import clsx from 'clsx';

interface FieldOption {
  value: string;
  label: string;
}

interface FieldConfig {
  type: string;
  value: number;
}

interface Set {
  [key: string]: number;
  campo1: number;
  campo2: number;
  campo3: number;
}

interface ExerciseSet {
  exercise: string;
  sets: Set[];
  config: {
    campo1: string;
    campo2: string;
    campo3: string;
  };
}

interface Variant {
  color: string;
  exercises: ExerciseSet[];
}

interface Day {
  dayNumber: number;
  variants: Variant[];
}

interface Exercise {
  _id: string;
  nombre: string;
  grupoMuscular: string[];
  descripcion: string;
  equipo: string[];
  fechaCreacion: string;
}

interface Period {
  nombre: string;
  semanaInicio: number;
  diaInicio: number;
  semanaFin: number;
  diaFin: number;
  variants: Variant[];
}

interface EdicionExercisePeriodProps {
  periods: Period[];
  onSave: (updatedPeriods: Period[]) => void;
  onClose: () => void;
}

const fieldOptions = {
  campo1: [
    { value: 'reps', label: 'Repeticiones' },
    { value: 'distance', label: 'Distancia' },
    { value: 'tempo', label: 'Tempo' },
    { value: 'calories', label: 'Calorías' }
  ],
  campo2: [
    { value: 'weight', label: 'Peso' },
    { value: 'speed', label: 'Velocidad' },
    { value: 'height', label: 'Altura' },
    { value: 'cadence', label: 'Cadencia' },
    { value: 'rpm', label: 'RPM' }
  ],
  campo3: [
    { value: 'rest', label: 'Descanso' },
    { value: 'round', label: 'Ronda' },
    { value: 'rpe', label: 'RPE' },
    { value: 'rir', label: 'RIR' }
  ]
};

export function EdicionExercisePeriod({ periods, onSave, onClose }: EdicionExercisePeriodProps) {
  console.log('EdicionExercisePeriod - Props recibidos:', { periods, onSave, onClose });

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<'rojo' | 'verde' | 'amarillo'>('rojo');
  const [currentPeriods, setCurrentPeriods] = useState<Period[]>(periods);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<number>(0);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showSetModal, setShowSetModal] = useState(false);
  const [currentSets, setCurrentSets] = useState<Set[]>([]);
  const [currentConfig, setCurrentConfig] = useState({
    campo1: 'reps',
    campo2: 'weight',
    campo3: 'rest'
  });

  console.log('EdicionExercisePeriod - Estado inicial:', {
    currentPeriods,
    selectedPeriodIndex,
    selectedVariant,
    currentSets,
    currentConfig
  });

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        console.log('EdicionExercisePeriod - Iniciando fetchExercises');
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch('http://localhost:3000/api/exercises', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los ejercicios');
        }

        const data = await response.json();
        console.log('EdicionExercisePeriod - Ejercicios obtenidos:', data);
        setExercises(data.data);
        setLoading(false);
      } catch (err) {
        console.error('EdicionExercisePeriod - Error en fetchExercises:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleAddSet = () => {
    setCurrentSets([...currentSets, { campo1: 0, campo2: 0, campo3: 0 }]);
  };

  const handleRemoveSet = (index: number) => {
    setCurrentSets(currentSets.filter((_, i) => i !== index));
  };

  const handleSetChange = (index: number, field: string, value: number) => {
    const newSets = [...currentSets];
    newSets[index] = { ...newSets[index], [field]: value };
    setCurrentSets(newSets);
  };

  const handleConfigChange = (field: string, value: string) => {
    setCurrentConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCurrentSets([{ campo1: 0, campo2: 0, campo3: 0 }]);
    
    const existingExercise = getCurrentExercise(exercise._id);
    if (existingExercise) {
      setCurrentConfig(existingExercise.config);
      setCurrentSets(existingExercise.sets);
    } else {
      setCurrentConfig({
        campo1: 'reps',
        campo2: 'weight',
        campo3: 'rest'
      });
    }
    
    setShowSetModal(true);
  };

  const getCurrentExercise = (exerciseId: string) => {
    const currentPeriod = currentPeriods[selectedPeriodIndex];
    const variant = currentPeriod.variants.find(v => v.color === selectedVariant);
    return variant?.exercises.find(e => e.exercise === exerciseId);
  };

  const handleSaveExercise = () => {
    console.log('EdicionExercisePeriod - Iniciando handleSaveExercise');
    if (!selectedExercise) return;

    console.log('EdicionExercisePeriod - Ejercicio seleccionado:', selectedExercise);
    console.log('EdicionExercisePeriod - Sets actuales:', currentSets);
    console.log('EdicionExercisePeriod - Configuración actual:', currentConfig);

    const newExercise: ExerciseSet = {
      exercise: selectedExercise._id,
      sets: currentSets,
      config: currentConfig
    };

    console.log('EdicionExercisePeriod - Nuevo ejercicio creado:', newExercise);

    const newPeriods = [...currentPeriods];
    const currentPeriod = newPeriods[selectedPeriodIndex];
    const variantIndex = currentPeriod.variants.findIndex(v => v.color === selectedVariant);

    if (variantIndex === -1) {
      currentPeriod.variants.push({
        color: selectedVariant,
        exercises: [newExercise]
      });
    } else {
      currentPeriod.variants[variantIndex].exercises.push(newExercise);
    }

    console.log('EdicionExercisePeriod - Periodos actualizados:', newPeriods);
    setCurrentPeriods(newPeriods);
    setShowSetModal(false);
  };

  const handleSavePeriods = () => {
    console.log('EdicionExercisePeriod - Guardando periodos:', currentPeriods);
    onSave(currentPeriods);
    onClose();
  };

  const getFieldLabel = (field: string, type: string) => {
    return fieldOptions[field as keyof typeof fieldOptions]
      .find(option => option.value === type)?.label || type;
  };

  const toggleExerciseExpand = (exerciseId: string) => {
    // No implementado
  };

  const filteredExercises = exercises.filter(exercise =>
    exercise.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.grupoMuscular.some(grupo => 
      grupo.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) return <div className="p-4">Cargando ejercicios...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[80%] max-w-4xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Editar Periodos</h2>
          
          {/* Selector de periodo */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Periodo
            </label>
            <select
              value={selectedPeriodIndex}
              onChange={(e) => setSelectedPeriodIndex(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {currentPeriods.map((period, index) => (
                <option key={index} value={index}>
                  {period.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <div className="flex space-x-4 mb-4">
              {['rojo', 'verde', 'amarillo'].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedVariant(color as 'rojo' | 'verde' | 'amarillo')}
                  className={clsx(
                    'px-4 py-2 rounded-md font-medium',
                    {
                      'bg-red-500 text-white': color === 'rojo' && selectedVariant === 'rojo',
                      'bg-green-500 text-white': color === 'verde' && selectedVariant === 'verde',
                      'bg-yellow-500 text-white': color === 'amarillo' && selectedVariant === 'amarillo',
                      'bg-gray-100': selectedVariant !== color
                    }
                  )}
                >
                  Variante {color}
                </button>
              ))}
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Buscar ejercicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-md pl-10"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-2">
              {filteredExercises.map((exercise) => {
                const isExpanded = false; // No implementado
                const existingExercise = getCurrentExercise(exercise._id);

                return (
                  <div
                    key={exercise._id}
                    className="border rounded-md overflow-hidden"
                  >
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleExerciseExpand(exercise._id)}
                    >
                      <div>
                        <h3 className="font-medium">{exercise.nombre}</h3>
                        <p className="text-sm text-gray-500">
                          {exercise.grupoMuscular.join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {existingExercise && (
                          <span className="text-sm text-green-500">
                            Configurado
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddExercise(exercise);
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </div>

                    {isExpanded && existingExercise && (
                      <div className="p-4 bg-gray-50 border-t">
                        <h4 className="font-medium mb-2">Configuración actual:</h4>
                        <div className="space-y-2">
                          {existingExercise.sets.map((set, index) => (
                            <div key={index} className="flex space-x-4">
                              <span>{getFieldLabel('campo1', existingExercise.config.campo1)}: {set.campo1}</span>
                              <span>{getFieldLabel('campo2', existingExercise.config.campo2)}: {set.campo2}</span>
                              <span>{getFieldLabel('campo3', existingExercise.config.campo3)}: {set.campo3}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {showSetModal && selectedExercise && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
              <h3 className="text-lg font-medium mb-4">
                Configurar {selectedExercise.nombre}
              </h3>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(fieldOptions).map(([field, options]) => (
                    <div key={field}>
                      <label className="block text-sm font-medium mb-1">
                        Campo {field.slice(-1)}
                      </label>
                      <select
                        value={currentConfig[field as keyof typeof currentConfig]}
                        onChange={(e) => handleConfigChange(field, e.target.value)}
                        className="w-full border rounded-md p-2"
                      >
                        {options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {currentSets.map((set, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="grid grid-cols-3 gap-4 flex-1">
                      {Object.entries(currentConfig).map(([field, type]) => (
                        <div key={field}>
                          <label className="block text-sm font-medium mb-1">
                            {getFieldLabel(field, type)}
                          </label>
                          <input
                            type="number"
                            value={set[field as keyof Set]}
                            onChange={(e) => handleSetChange(index, field, Number(e.target.value))}
                            className="w-full border rounded-md p-2"
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => handleRemoveSet(index)}
                      className="p-2 hover:bg-red-100 rounded-full"
                    >
                      <Minus className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={handleAddSet}
                  className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
                >
                  <Plus className="w-5 h-5" />
                  <span>Añadir serie</span>
                </button>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowSetModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveExercise}
                  className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSavePeriods}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
