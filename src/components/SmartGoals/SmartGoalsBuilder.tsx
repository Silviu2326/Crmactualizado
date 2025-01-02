import { useState } from 'react';
import { X, Check, Target, AlertCircle } from 'lucide-react';

interface SmartGoalsBuilderProps {
  isVisible: boolean;
  onClose: () => void;
}

interface FormData {
  goalDescription: string;
  timeframe: string;
  measurementMethod: string;
  currentValue: string;
  targetValue: string;
  relevance: string;
  obstacles: string[];
  resources: string[];
}

const SmartGoalsBuilder: React.FC<SmartGoalsBuilderProps> = ({
  isVisible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [smartGoal, setSmartGoal] = useState('');

  const [form, setForm] = useState<FormData>({
    goalDescription: '',
    timeframe: '',
    measurementMethod: '',
    currentValue: '',
    targetValue: '',
    relevance: '',
    obstacles: [],
    resources: [],
  });

  const timeframeOptions = [
    '1 mes',
    '3 meses',
    '6 meses',
    '1 año'
  ];

  const obstacleOptions = [
    'Tiempo limitado',
    'Recursos económicos',
    'Conocimientos técnicos',
    'Apoyo social',
    'Motivación inconsistente',
    'Compromisos existentes'
  ];

  const resourceOptions = [
    'Entrenador personal',
    'Material educativo',
    'Equipamiento',
    'Grupo de apoyo',
    'Apps/Software',
    'Mentor'
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: 'obstacles' | 'resources', value: string) => {
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
    
    // Aquí iría la lógica para generar el objetivo SMART
    // Simularemos una respuesta después de 2 segundos
    setTimeout(() => {
      setSmartGoal(`### Objetivo SMART Definido
${form.goalDescription}

### Específico (Specific)
- Meta claramente definida y detallada
- Enfoque en ${form.targetValue} como objetivo cuantificable
- Punto de partida actual: ${form.currentValue}

### Medible (Measurable)
- Método de medición: ${form.measurementMethod}
- Seguimiento regular del progreso
- Indicadores claros de éxito

### Alcanzable (Achievable)
- Recursos disponibles:
${form.resources.map(resource => `- ${resource}`).join('\n')}
- Plan para superar obstáculos:
${form.obstacles.map(obstacle => `- Estrategia para ${obstacle}`).join('\n')}

### Relevante (Relevant)
${form.relevance}

### Temporal (Time-bound)
- Plazo establecido: ${form.timeframe}
- Hitos intermedios definidos
- Fechas de revisión programadas`);
      
      setIsLoading(false);
      setShowForm(false);
    }, 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="h-full w-full overflow-y-auto custom-scrollbar">
      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="sticky top-0 z-10">
            <div className="p-4 rounded-t-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Constructor de Metas SMART</h2>
              <p className="text-purple-100">Define objetivos específicos y alcanzables</p>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
              </div>
            ) : showForm ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Descripción del objetivo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Describe tu objetivo
                  </label>
                  <textarea
                    value={form.goalDescription}
                    onChange={(e) => handleInputChange('goalDescription', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="¿Qué quieres lograr específicamente?"
                  />
                </div>

                {/* Plazo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ¿En cuánto tiempo quieres lograrlo?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {timeframeOptions.map(timeframe => (
                      <button
                        key={timeframe}
                        type="button"
                        onClick={() => handleInputChange('timeframe', timeframe)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.timeframe === timeframe
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {timeframe}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Método de medición */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ¿Cómo medirás el progreso?
                  </label>
                  <input
                    type="text"
                    value={form.measurementMethod}
                    onChange={(e) => handleInputChange('measurementMethod', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Ej: Peso, repeticiones, tiempo, etc."
                  />
                </div>

                {/* Valores actual y objetivo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valor actual
                    </label>
                    <input
                      type="text"
                      value={form.currentValue}
                      onChange={(e) => handleInputChange('currentValue', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="¿Dónde estás ahora?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valor objetivo
                    </label>
                    <input
                      type="text"
                      value={form.targetValue}
                      onChange={(e) => handleInputChange('targetValue', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="¿Dónde quieres llegar?"
                    />
                  </div>
                </div>

                {/* Relevancia */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ¿Por qué es importante este objetivo?
                  </label>
                  <textarea
                    value={form.relevance}
                    onChange={(e) => handleInputChange('relevance', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    rows={2}
                    placeholder="Explica por qué este objetivo es relevante para ti"
                  />
                </div>

                {/* Obstáculos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Posibles obstáculos
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {obstacleOptions.map(obstacle => (
                      <button
                        key={obstacle}
                        type="button"
                        onClick={() => handleArrayToggle('obstacles', obstacle)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.obstacles.includes(obstacle)
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {obstacle}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recursos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recursos necesarios
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {resourceOptions.map(resource => (
                      <button
                        key={resource}
                        type="button"
                        onClick={() => handleArrayToggle('resources', resource)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.resources.includes(resource)
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {resource}
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
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
                  >
                    <Target className="w-4 h-4" />
                    <span>Crear Objetivo SMART</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                <div className="mb-4 p-4 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  ¡Objetivo SMART creado exitosamente!
                </div>
                <div className="mt-4 space-y-6">
                  {smartGoal.split('###').map((section, index) => {
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
                                <div key={lineIndex} className="flex items-start p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                                  <AlertCircle className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                                  <p className="text-purple-700 dark:text-purple-300">
                                    {trimmedLine.replace(/^!\s*/, '')}
                                  </p>
                                </div>
                              );
                            }
                            
                            if (trimmedLine.startsWith('-')) {
                              return (
                                <div key={lineIndex} className="flex items-start">
                                  <span className="text-purple-500 mr-2">•</span>
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
                    Nuevo objetivo
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartGoalsBuilder;
