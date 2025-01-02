import { useState } from 'react';
import { X, Check, Star, AlertCircle, Clock, Calendar, Target, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MicroHabitsBuilderProps {
  isVisible: boolean;
  onClose: () => void;
}

interface FormData {
  habitName: string;
  category: string;
  frequency: string;
  duration: string;
  trigger: string;
  reminders: string[];
  obstacles: string[];
  rewards: string[];
}

const MicroHabitsBuilder: React.FC<MicroHabitsBuilderProps> = ({
  isVisible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [plan, setPlan] = useState('');

  const [form, setForm] = useState<FormData>({
    habitName: '',
    category: '',
    frequency: '',
    duration: '',
    trigger: '',
    reminders: [],
    obstacles: [],
    rewards: [],
  });

  const categoryOptions = [
    'Nutrición',
    'Ejercicio',
    'Descanso',
    'Hidratación',
    'Postura',
    'Meditación'
  ];

  const frequencyOptions = [
    'Diario',
    '3-4 veces/semana',
    'Días laborables',
    'Fines de semana'
  ];

  const durationOptions = [
    '1-2 minutos',
    '5 minutos',
    '10 minutos',
    '15+ minutos'
  ];

  const reminderOptions = [
    'Notificación móvil',
    'Alarma',
    'Post-it',
    'Calendario',
    'Antes de comidas',
    'Al despertar'
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: 'reminders' | 'obstacles' | 'rewards', value: string) => {
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
      setPlan(`### Plan de Micro-Hábito: ${form.habitName}

#### Detalles del Hábito
- Categoría: ${form.category}
- Frecuencia: ${form.frequency}
- Duración: ${form.duration}
- Desencadenante: ${form.trigger}

#### Sistema de Recordatorios
${form.reminders.map(reminder => `- ${reminder}`).join('\n')}

#### Obstáculos y Soluciones
${form.obstacles.map((obstacle, index) => `
##### Obstáculo ${index + 1}
- ${obstacle}
- Solución: ${generateSolution(obstacle)}`).join('\n')}

#### Sistema de Recompensas
${form.rewards.map(reward => `- ${reward}`).join('\n')}

#### Plan de Implementación

##### Semana 1: Establecimiento
- Día 1-2: Preparación del entorno
- Día 3-5: Primera ejecución con recordatorios
- Día 6-7: Evaluación y ajustes

##### Semana 2: Consolidación
- Seguimiento diario
- Ajuste de recordatorios
- Identificación de patrones

##### Semana 3: Automatización
- Reducción de recordatorios externos
- Fortalecimiento del hábito
- Celebración de logros

##### Semana 4: Evaluación
- Análisis de adherencia
- Ajustes finales
- Plan de mantenimiento

#### Seguimiento Diario
1. Marcar completado ✓
2. Anotar dificultades
3. Registrar sensaciones
4. Evaluar efectividad

#### Consejos de Éxito
! Comenzar pequeño y crecer gradualmente
! Mantener consistencia sobre perfección
! Celebrar cada pequeño logro
! Ajustar según necesidad sin abandonar`);
      
      setIsLoading(false);
      setShowForm(false);
    }, 1500);
  };

  const generateSolution = (obstacle: string): string => {
    const solutions: { [key: string]: string } = {
      'Falta de tiempo': 'Dividir en micro-tareas de 2 minutos',
      'Olvido': 'Establecer recordatorios visuales estratégicos',
      'Cansancio': 'Programar para momentos de mayor energía',
      'Desmotivación': 'Crear un sistema de recompensas inmediatas',
      'Distracciones': 'Preparar el entorno la noche anterior',
    };
    return solutions[obstacle] || 'Adaptar y ajustar según el progreso';
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
              <div className="p-4 rounded-t-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Constructor de Micro-Hábitos</h2>
                <p className="text-emerald-100">Desarrolla hábitos saludables paso a paso</p>
              </div>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
                </div>
              ) : showForm ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nombre del hábito */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre del hábito
                    </label>
                    <input
                      type="text"
                      value={form.habitName}
                      onChange={(e) => handleInputChange('habitName', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="¿Qué hábito quieres desarrollar?"
                      required
                    />
                  </div>

                  {/* Categoría */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Categoría
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {categoryOptions.map(category => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => handleInputChange('category', category)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.category === category
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Frecuencia */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Frecuencia
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {frequencyOptions.map(frequency => (
                        <button
                          key={frequency}
                          type="button"
                          onClick={() => handleInputChange('frequency', frequency)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.frequency === frequency
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {frequency}
                        </button>
                      ))}
                    </div>
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
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {duration}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Desencadenante */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Desencadenante
                    </label>
                    <input
                      type="text"
                      value={form.trigger}
                      onChange={(e) => handleInputChange('trigger', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="¿Qué acción o momento desencadenará este hábito?"
                      required
                    />
                  </div>

                  {/* Recordatorios */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sistema de recordatorios
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {reminderOptions.map(reminder => (
                        <button
                          key={reminder}
                          type="button"
                          onClick={() => handleArrayToggle('reminders', reminder)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.reminders.includes(reminder)
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {reminder}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Obstáculos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Posibles obstáculos
                    </label>
                    <textarea
                      value={form.obstacles.join('\n')}
                      onChange={(e) => handleInputChange('obstacles', e.target.value.split('\n'))}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      rows={3}
                      placeholder="Lista los posibles obstáculos (uno por línea)"
                    />
                  </div>

                  {/* Recompensas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sistema de recompensas
                    </label>
                    <textarea
                      value={form.rewards.join('\n')}
                      onChange={(e) => handleInputChange('rewards', e.target.value.split('\n'))}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      rows={3}
                      placeholder="Lista las recompensas (una por línea)"
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
                      className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
                    >
                      <Star className="w-4 h-4" />
                      <span>Crear Plan</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <div className="mb-4 p-4 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    ¡Plan de hábito creado exitosamente!
                  </div>
                  <div className="mt-4 space-y-6">
                    {plan.split('\n').map((line, index) => {
                      if (!line.trim()) return null;
                      
                      if (line.startsWith('###')) {
                        const level = line.match(/^#{3,5}/)?.[0].length || 3;
                        const title = line.replace(/^#{3,5} /, '');
                        const sizes = {
                          3: 'text-xl',
                          4: 'text-lg',
                          5: 'text-md'
                        };
                        return (
                          <h3 key={index} className={`${sizes[level as keyof typeof sizes]} font-bold text-gray-900 dark:text-white ${level === 3 ? 'mt-6 mb-4' : 'mt-4 mb-2'}`}>
                            {title}
                          </h3>
                        );
                      }
                      
                      if (line.startsWith('!')) {
                        return (
                          <div key={index} className="flex items-start p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg my-2">
                            <AlertCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-emerald-700 dark:text-emerald-300 m-0">
                              {line.replace(/^! /, '')}
                            </p>
                          </div>
                        );
                      }
                      
                      if (line.startsWith('-')) {
                        return (
                          <div key={index} className="flex items-start my-1">
                            <span className="text-emerald-500 mr-2">•</span>
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
                    })}
                  </div>
                  <div className="mt-6 flex justify-between sticky bottom-0 bg-white dark:bg-gray-800 pt-4 border-t dark:border-gray-700">
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                    >
                      Nuevo hábito
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
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

export default MicroHabitsBuilder;
