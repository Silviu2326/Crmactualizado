import { useState } from 'react';
import { X, Check, Briefcase, AlertCircle, Clock, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OfficeBreaksDesignerProps {
  isVisible: boolean;
  onClose: () => void;
}

interface FormData {
  workSchedule: string;
  breakFrequency: string;
  selectedExercises: string[];
  workEnvironment: string[];
  healthConditions: string[];
  preferences: string[];
}

const OfficeBreaksDesigner: React.FC<OfficeBreaksDesignerProps> = ({
  isVisible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [routine, setRoutine] = useState('');

  const [form, setForm] = useState<FormData>({
    workSchedule: '',
    breakFrequency: '',
    selectedExercises: [],
    workEnvironment: [],
    healthConditions: [],
    preferences: [],
  });

  const scheduleOptions = [
    '4-6 horas',
    '6-8 horas',
    '8-10 horas',
    '+10 horas'
  ];

  const frequencyOptions = [
    'Cada hora',
    'Cada 2 horas',
    'Cada 3 horas',
    'Flexible'
  ];

  const exerciseOptions = [
    'Estiramientos',
    'Ejercicios oculares',
    'Movilidad articular',
    'Respiracion',
    'Postura',
    'Relajacion'
  ];

  const environmentOptions = [
    'Escritorio individual',
    'Espacio compartido',
    'Sala de reuniones',
    'Home office'
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: 'selectedExercises' | 'workEnvironment' | 'healthConditions' | 'preferences', value: string) => {
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
    
    setTimeout(() => {
      setRoutine(`### Plan de Pausas Activas

### Horario y Frecuencia
- Jornada laboral: ${form.workSchedule}
- Frecuencia de pausas: ${form.breakFrequency}

### Rutinas Programadas

#### Pausa Matutina (10:00)
- 2 min: Ejercicios de respiracion profunda
- 3 min: Estiramientos de cuello y hombros
- 2 min: Ejercicios oculares

#### Pausa de Media Mañana (12:00)
- 3 min: Movilidad articular
- 2 min: Ejercicios posturales
- 2 min: Estiramientos de muñecas

#### Pausa de Almuerzo (14:00)
- 5 min: Caminata ligera
- 3 min: Ejercicios de relajacion
- 2 min: Respiracion consciente

#### Pausa de Media Tarde (16:00)
- 3 min: Estiramientos de espalda
- 2 min: Ejercicios de enfoque visual
- 2 min: Movimientos de piernas

### Ejercicios Seleccionados
${form.selectedExercises.map(exercise => `- ${exercise}`).join('\n')}

### Consideraciones del Entorno
${form.workEnvironment.map(env => `- ${env}`).join('\n')}

### Recomendaciones
- Mantener una postura correcta
- Ajustar la altura del monitor
- Usar recordatorios programados
- Beber agua regularmente

### Beneficios Esperados
- Reduccion de fatiga visual
- Mejora de la postura
- Aumento de productividad
- Prevencion de lesiones
- Mayor bienestar general`);
      
      setIsLoading(false);
      setShowForm(false);
    }, 2000);
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
              <div className="p-4 rounded-t-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Diseño de Pausas Activas</h2>
                <p className="text-cyan-100">Optimiza tu bienestar en el trabajo</p>
              </div>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600" />
                </div>
              ) : showForm ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Horario laboral */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Horario laboral
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {scheduleOptions.map(schedule => (
                        <button
                          key={schedule}
                          type="button"
                          onClick={() => handleInputChange('workSchedule', schedule)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.workSchedule === schedule
                              ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {schedule}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Frecuencia de pausas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Frecuencia de pausas
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {frequencyOptions.map(frequency => (
                        <button
                          key={frequency}
                          type="button"
                          onClick={() => handleInputChange('breakFrequency', frequency)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.breakFrequency === frequency
                              ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {frequency}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ejercicios */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tipos de ejercicios
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {exerciseOptions.map(exercise => (
                        <button
                          key={exercise}
                          type="button"
                          onClick={() => handleArrayToggle('selectedExercises', exercise)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.selectedExercises.includes(exercise)
                              ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {exercise}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Entorno de trabajo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Entorno de trabajo
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {environmentOptions.map(environment => (
                        <button
                          key={environment}
                          type="button"
                          onClick={() => handleArrayToggle('workEnvironment', environment)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.workEnvironment.includes(environment)
                              ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {environment}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Condiciones de salud */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Condiciones de salud a considerar
                    </label>
                    <textarea
                      value={form.healthConditions.join('\n')}
                      onChange={(e) => handleInputChange('healthConditions', e.target.value.split('\n'))}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      rows={3}
                      placeholder="Agrega condiciones de salud (una por linea)"
                    />
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
                      className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Generar Plan</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <div className="mb-4 p-4 rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300 flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    ¡Plan de pausas generado exitosamente!
                  </div>
                  <div className="mt-4 space-y-6">
                    {routine.split('###').map((section, index) => {
                      if (!section.trim()) return null;
                      
                      const [title, ...content] = section.split('\n');
                      return (
                        <div key={index} className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {title.trim()}
                          </h3>
                          <div className="space-y-2">
                            {content.map((line, lineIndex) => {
                              const trimmedLine = line.trim();
                              if (!trimmedLine) return null;
                              
                              if (trimmedLine.startsWith('!')) {
                                return (
                                  <div key={lineIndex} className="flex items-start p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-cyan-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <p className="text-cyan-700 dark:text-cyan-300">
                                      {trimmedLine.replace(/^!\s*/, '')}
                                    </p>
                                  </div>
                                );
                              }
                              
                              if (trimmedLine.startsWith('-')) {
                                return (
                                  <div key={lineIndex} className="flex items-start">
                                    <span className="text-cyan-500 mr-2">•</span>
                                    <p className="text-gray-600 dark:text-gray-300">
                                      {trimmedLine.replace(/^-\s*/, '')}
                                    </p>
                                  </div>
                                );
                              }
                              
                              return (
                                <p key={lineIndex} className="text-gray-600 dark:text-gray-300">
                                  {trimmedLine}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 flex justify-between sticky bottom-0 bg-white dark:bg-gray-800 pt-4 border-t dark:border-gray-700">
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                    >
                      Nuevo plan
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
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

export default OfficeBreaksDesigner;
