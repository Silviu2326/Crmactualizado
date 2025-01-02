import { useState } from 'react';
import { X, Check, Users, AlertCircle, Calendar, Clock, Target, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GroupClassesManagerProps {
  isVisible: boolean;
  onClose: () => void;
}

interface ClassSession {
  id: string;
  name: string;
  type: string;
  level: string;
  capacity: number;
  schedule: string;
  duration: string;
  equipment: string[];
  objectives: string[];
}

interface FormData {
  className: string;
  classType: string;
  level: string;
  capacity: string;
  schedule: string;
  duration: string;
  equipment: string[];
  objectives: string[];
}

const GroupClassesManager: React.FC<GroupClassesManagerProps> = ({
  isVisible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [sessions, setSessions] = useState<ClassSession[]>([]);

  const [form, setForm] = useState<FormData>({
    className: '',
    classType: '',
    level: '',
    capacity: '',
    schedule: '',
    duration: '',
    equipment: [],
    objectives: [],
  });

  const classTypes = [
    'Bootcamp',
    'HIIT',
    'Funcional',
    'Fuerza',
    'Cardio',
    'Mixto'
  ];

  const levelOptions = [
    'Principiante',
    'Intermedio',
    'Avanzado',
    'Multinivel'
  ];

  const capacityOptions = [
    '5-10',
    '10-15',
    '15-20',
    '20+'
  ];

  const durationOptions = [
    '30 min',
    '45 min',
    '60 min',
    '90 min'
  ];

  const equipmentOptions = [
    'Pesas',
    'Bandas',
    'Steps',
    'Colchonetas',
    'TRX',
    'Kettlebells'
  ];

  const objectiveOptions = [
    'Pérdida de peso',
    'Tonificación',
    'Resistencia',
    'Fuerza',
    'Agilidad',
    'Flexibilidad'
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: 'equipment' | 'objectives', value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const newSession: ClassSession = {
      id: Date.now().toString(),
      name: form.className,
      type: form.classType,
      level: form.level,
      capacity: parseInt(form.capacity),
      schedule: form.schedule,
      duration: form.duration,
      equipment: form.equipment,
      objectives: form.objectives,
    };

    setTimeout(() => {
      setSessions(prev => [...prev, newSession]);
      setIsLoading(false);
      setShowForm(false);
    }, 1500);
  };

  const formatSessionDetails = (session: ClassSession) => {
    return `### ${session.name}

#### Detalles Básicos
- Tipo: ${session.type}
- Nivel: ${session.level}
- Capacidad: ${session.capacity} participantes
- Duración: ${session.duration}
- Horario: ${session.schedule}

#### Equipamiento Necesario
${session.equipment.map(eq => `- ${eq}`).join('\n')}

#### Objetivos
${session.objectives.map(obj => `- ${obj}`).join('\n')}

#### Estructura de la Clase

1. Calentamiento (${parseInt(session.duration) * 0.15} min)
   - Movilidad articular
   - Activación cardiovascular
   - Ejercicios de preparación

2. Parte Principal (${parseInt(session.duration) * 0.7} min)
   - Circuitos de alta intensidad
   - Ejercicios funcionales
   - Trabajo por estaciones

3. Vuelta a la calma (${parseInt(session.duration) * 0.15} min)
   - Estiramientos
   - Ejercicios de respiración
   - Cool down

#### Progresión Recomendada
- Semana 1-2: Adaptación y técnica
- Semana 3-4: Incremento de intensidad
- Semana 5-6: Aumento de complejidad
- Semana 7-8: Peak performance

#### Consideraciones
! Mantener ratio instructor/alumno adecuado
! Adaptar ejercicios según nivel
! Monitorear intensidad y técnica`;
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="sticky top-0 z-10">
              <div className="p-4 rounded-t-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Gestor de Clases Grupales</h2>
                <p className="text-pink-100">Diseña y organiza sesiones efectivas</p>
              </div>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
                </div>
              ) : showForm ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nombre de la clase */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre de la clase
                    </label>
                    <input
                      type="text"
                      value={form.className}
                      onChange={(e) => handleInputChange('className', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="Nombre de la clase"
                      required
                    />
                  </div>

                  {/* Tipo de clase */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tipo de clase
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {classTypes.map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleInputChange('classType', type)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.classType === type
                              ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nivel */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nivel
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {levelOptions.map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleInputChange('level', level)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.level === level
                              ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Capacidad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Capacidad
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {capacityOptions.map(capacity => (
                        <button
                          key={capacity}
                          type="button"
                          onClick={() => handleInputChange('capacity', capacity)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.capacity === capacity
                              ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {capacity}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Horario */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Horario
                    </label>
                    <input
                      type="text"
                      value={form.schedule}
                      onChange={(e) => handleInputChange('schedule', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="Ej: Lunes y Miércoles 18:00"
                      required
                    />
                  </div>

                  {/* Duración */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duración
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {durationOptions.map(duration => (
                        <button
                          key={duration}
                          type="button"
                          onClick={() => handleInputChange('duration', duration)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.duration === duration
                              ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {duration}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Equipamiento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Equipamiento necesario
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {equipmentOptions.map(equipment => (
                        <button
                          key={equipment}
                          type="button"
                          onClick={() => handleArrayToggle('equipment', equipment)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.equipment.includes(equipment)
                              ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {equipment}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Objetivos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Objetivos de la clase
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {objectiveOptions.map(objective => (
                        <button
                          key={objective}
                          type="button"
                          onClick={() => handleArrayToggle('objectives', objective)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.objectives.includes(objective)
                              ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {objective}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
                    >
                      <Users className="w-4 h-4" />
                      <span>Crear Clase</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <div className="mb-4 p-4 rounded-lg bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300 flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    ¡Clase creada exitosamente!
                  </div>
                  <div className="mt-4 space-y-6">
                    {sessions.map((session) => {
                      const details = formatSessionDetails(session);
                      return details.split('\n').map((line, index) => {
                        if (!line.trim()) return null;
                        
                        if (line.startsWith('###')) {
                          return (
                            <h3 key={index} className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-4">
                              {line.replace(/^### /, '')}
                            </h3>
                          );
                        }
                        
                        if (line.startsWith('####')) {
                          return (
                            <h4 key={index} className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">
                              {line.replace(/^#### /, '')}
                            </h4>
                          );
                        }
                        
                        if (line.startsWith('!')) {
                          return (
                            <div key={index} className="flex items-start p-3 bg-pink-50 dark:bg-pink-900/30 rounded-lg my-2">
                              <AlertCircle className="w-5 h-5 text-pink-500 mr-2 flex-shrink-0 mt-0.5" />
                              <p className="text-pink-700 dark:text-pink-300 m-0">
                                {line.replace(/^! /, '')}
                              </p>
                            </div>
                          );
                        }
                        
                        if (line.startsWith('-')) {
                          return (
                            <div key={index} className="flex items-start my-1">
                              <span className="text-pink-500 mr-2">•</span>
                              <p className="text-gray-600 dark:text-gray-300 m-0">
                                {line.replace(/^- /, '')}
                              </p>
                            </div>
                          );
                        }
                        
                        if (line.match(/^\d\./)) {
                          return (
                            <div key={index} className="ml-4 my-2">
                              <p className="text-gray-700 dark:text-gray-300 m-0 font-medium">
                                {line}
                              </p>
                            </div>
                          );
                        }
                        
                        return (
                          <p key={index} className="text-gray-600 dark:text-gray-300 my-1">
                            {line}
                          </p>
                        );
                      });
                    })}
                  </div>
                  <div className="mt-6 flex justify-between sticky bottom-0 bg-white dark:bg-gray-800 pt-4 border-t dark:border-gray-700">
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                    >
                      Nueva clase
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GroupClassesManager;
