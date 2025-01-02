import { useState } from 'react';
import { X, Check, Globe, AlertCircle, Send, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TravelTrainingChatProps {
  isVisible: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface FormData {
  destination: string;
  duration: string;
  equipment: string[];
  goals: string[];
  limitations: string[];
  preferences: string[];
}

const TravelTrainingChat: React.FC<TravelTrainingChatProps> = ({
  isVisible,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const [form, setForm] = useState<FormData>({
    destination: '',
    duration: '',
    equipment: [],
    goals: [],
    limitations: [],
    preferences: [],
  });

  const durationOptions = [
    'Menos de 1 semana',
    '1-2 semanas',
    '2-4 semanas',
    'Más de 1 mes'
  ];

  const equipmentOptions = [
    'Sin equipo',
    'Bandas elásticas',
    'TRX/Suspensión',
    'Esterilla',
    'Pesas ajustables',
    'Equipaje básico'
  ];

  const goalOptions = [
    'Mantener rutina',
    'Pérdida de peso',
    'Tonificación',
    'Movilidad',
    'Cardio',
    'Fuerza'
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: keyof FormData, value: string) => {
    if (Array.isArray(form[field])) {
      setForm(prev => ({
        ...prev,
        [field]: (prev[field] as string[]).includes(value)
          ? (prev[field] as string[]).filter(item => item !== value)
          : [...(prev[field] as string[]), value]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const initialMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `¡Hola! He analizado tu situación de viaje a ${form.destination} y he preparado un plan personalizado para ti. 

### Plan de Entrenamiento en Viaje

#### Detalles del Viaje
- Destino: ${form.destination}
- Duración: ${form.duration}
- Equipo disponible: ${form.equipment.join(', ')}

#### Rutina Adaptada
1. Calentamiento (10-15 min)
   - Movilidad articular
   - Activación cardiovascular ligera
   - Estiramientos dinámicos

2. Entrenamiento Principal (30-40 min)
   ${generateWorkout(form.equipment, form.goals)}

3. Vuelta a la calma (5-10 min)
   - Estiramientos estáticos
   - Ejercicios de respiración
   - Relajación muscular

#### Recomendaciones Nutricionales
- Mantén una buena hidratación
- Prioriza proteínas y vegetales
- Adapta las comidas al horario local
- Lleva snacks saludables

#### Tips Adicionales
- Ajusta el horario según jet lag
- Aprovecha instalaciones del hotel
- Explora actividades locales activas
- Mantén un diario de ejercicios

¿Tienes alguna pregunta específica sobre el plan?`,
      timestamp: new Date()
    };

    setMessages([initialMessage]);
    setIsLoading(false);
    setShowForm(false);
  };

  const generateWorkout = (equipment: string[], goals: string[]): string => {
    let workout = '';
    
    if (equipment.includes('Sin equipo')) {
      workout += `
   Circuito corporal:
   - Burpees: 10 reps
   - Sentadillas: 15 reps
   - Flexiones: 12 reps
   - Mountain climbers: 30 segs
   - Plancha: 45 segs
   3-4 rondas`;
    }
    
    if (equipment.includes('Bandas elásticas')) {
      workout += `
   Ejercicios con banda:
   - Rows: 15 reps
   - Press de hombro: 12 reps
   - Extensiones de tríceps: 15 reps
   - Curl de bíceps: 12 reps
   2-3 rondas`;
    }
    
    return workout || `
   Rutina personalizada:
   - Ejercicios corporales
   - Movimientos funcionales
   - Trabajo cardiovascular
   Adaptar según energía y tiempo`;
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    // Simular respuesta del asistente
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateResponse(currentMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateResponse = (question: string): string => {
    // Aquí podrías implementar una lógica más sofisticada para generar respuestas
    const responses = [
      `¡Excelente pregunta! Para adaptar tu entrenamiento en ${form.destination}, te sugiero: \n\n1. Mantén la intensidad pero ajusta el volumen\n2. Prioriza ejercicios compuestos\n3. Aprovecha el entorno local para actividades físicas`,
      'Respecto a la nutrición durante el viaje, es importante:\n\n- Mantener un balance de macronutrientes\n- Hidratarse adecuadamente\n- Planificar las comidas con anticipación',
      'Para maximizar tu tiempo de entrenamiento:\n\n1. Entrena temprano en la mañana\n2. Combina cardio con fuerza\n3. Utiliza circuitos de alta intensidad',
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
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
              <div className="p-4 rounded-t-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Entrenamiento en Viajes</h2>
                <p className="text-amber-100">Mantén tu rutina mientras viajas</p>
              </div>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
                </div>
              ) : showForm ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Destino */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Destino del viaje
                    </label>
                    <input
                      type="text"
                      value={form.destination}
                      onChange={(e) => handleInputChange('destination', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="¿A dónde viajas?"
                    />
                  </div>

                  {/* Duración */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duración del viaje
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {durationOptions.map(duration => (
                        <button
                          key={duration}
                          type="button"
                          onClick={() => handleInputChange('duration', duration)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.duration === duration
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {duration}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Equipo disponible */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Equipo disponible
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {equipmentOptions.map(equipment => (
                        <button
                          key={equipment}
                          type="button"
                          onClick={() => handleArrayToggle('equipment', equipment)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.equipment.includes(equipment)
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
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
                      Objetivos durante el viaje
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {goalOptions.map(goal => (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => handleArrayToggle('goals', goal)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.goals.includes(goal)
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Limitaciones */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Limitaciones o consideraciones
                    </label>
                    <textarea
                      value={form.limitations.join('\n')}
                      onChange={(e) => handleInputChange('limitations', e.target.value.split('\n'))}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      rows={3}
                      placeholder="Agrega limitaciones o consideraciones (una por línea)"
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
                      className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Iniciar Chat</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col h-[calc(90vh-theme(space.32))]">
                  <div className="flex-1 overflow-y-auto mb-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 ${
                          message.type === 'user' ? 'text-right' : 'text-left'
                        }`}
                      >
                        <div
                          className={`inline-block max-w-[80%] p-4 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-amber-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}
                        >
                          <div className="prose dark:prose-invert max-w-none">
                            {message.content.split('\n').map((line, index) => {
                              if (line.startsWith('###')) {
                                return (
                                  <h3 key={index} className="text-lg font-semibold mb-2">
                                    {line.replace(/^### /, '')}
                                  </h3>
                                );
                              }
                              if (line.startsWith('####')) {
                                return (
                                  <h4 key={index} className="text-md font-medium mb-2">
                                    {line.replace(/^#### /, '')}
                                  </h4>
                                );
                              }
                              if (line.startsWith('-')) {
                                return (
                                  <div key={index} className="flex items-start mb-1">
                                    <span className="mr-2">•</span>
                                    <p className="m-0">{line.replace(/^- /, '')}</p>
                                  </div>
                                );
                              }
                              if (line.match(/^\d\./)) {
                                return (
                                  <div key={index} className="ml-4 mb-2">
                                    <p className="m-0">{line}</p>
                                  </div>
                                );
                              }
                              return <p key={index} className="mb-1">{line}</p>;
                            })}
                          </div>
                          <div className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start mb-4">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="sticky bottom-0 bg-white dark:bg-gray-800 pt-4">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Escribe tu mensaje..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!currentMessage.trim()}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
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

export default TravelTrainingChat;
