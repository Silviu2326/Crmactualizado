import { useState } from 'react';
import { X, Check, TrendingUp, AlertCircle, BarChart, Activity } from 'lucide-react';

interface ProgressSimulatorProps {
  isVisible: boolean;
  onClose: () => void;
}

interface FormData {
  startingPoint: string;
  targetGoal: string;
  timeframe: string;
  frequency: string;
  intensity: string;
  variables: string[];
  constraints: string[];
  optimizations: string[];
}

const ProgressSimulator: React.FC<ProgressSimulatorProps> = ({
  isVisible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [simulation, setSimulation] = useState('');

  const [form, setForm] = useState<FormData>({
    startingPoint: '',
    targetGoal: '',
    timeframe: '',
    frequency: '',
    intensity: '',
    variables: [],
    constraints: [],
    optimizations: [],
  });

  const timeframeOptions = [
    '1 mes',
    '3 meses',
    '6 meses',
    '1 año'
  ];

  const frequencyOptions = [
    '2-3 veces/semana',
    '3-4 veces/semana',
    '4-5 veces/semana',
    '6-7 veces/semana'
  ];

  const intensityOptions = [
    'Baja',
    'Moderada',
    'Alta',
    'Variable'
  ];

  const variableOptions = [
    'Nutricion',
    'Descanso',
    'Estres',
    'Lesiones previas',
    'Genetica',
    'Edad'
  ];

  const constraintOptions = [
    'Tiempo limitado',
    'Equipo disponible',
    'Presupuesto',
    'Condicion fisica',
    'Factores externos',
    'Compromisos'
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: 'variables' | 'constraints' | 'optimizations', value: string) => {
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
      setSimulation(`### Escenario Base
- Punto de inicio: ${form.startingPoint}
- Objetivo: ${form.targetGoal}
- Plazo: ${form.timeframe}
- Frecuencia: ${form.frequency}
- Intensidad: ${form.intensity}

### Variables Consideradas
${form.variables.map(variable => `- ${variable}: Impacto en el progreso`).join('\n')}

### Limitaciones y Restricciones
${form.constraints.map(constraint => `- ${constraint}: Factor a considerar`).join('\n')}

### Proyecciones de Progreso

#### Escenario Optimista
- Progreso mensual: 15-20%
- Tiempo estimado: ${form.timeframe}
- Probabilidad: 30%

#### Escenario Realista
- Progreso mensual: 10-15%
- Tiempo estimado: ${parseInt(form.timeframe) * 1.2} meses
- Probabilidad: 50%

#### Escenario Conservador
- Progreso mensual: 5-10%
- Tiempo estimado: ${parseInt(form.timeframe) * 1.5} meses
- Probabilidad: 20%

### Puntos de Ajuste
- Revision cada 4 semanas
- Ajuste de variables segun respuesta
- Modificacion de intensidad segun progreso
- Adaptacion de frecuencia segun recuperacion

### Recomendaciones de Optimizacion
- Monitoreo constante de variables clave
- Ajustes periodicos basados en resultados
- Plan de contingencia para estancamientos
- Estrategias de recuperacion activa`);
      
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
            <div className="p-4 rounded-t-lg bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Simulador de Progreso</h2>
              <p className="text-green-100">Visualiza diferentes escenarios de avance</p>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
              </div>
            ) : showForm ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Punto de inicio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Punto de inicio
                  </label>
                  <input
                    type="text"
                    value={form.startingPoint}
                    onChange={(e) => handleInputChange('startingPoint', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Ej: 60kg en press banca"
                  />
                </div>

                {/* Objetivo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Objetivo
                  </label>
                  <input
                    type="text"
                    value={form.targetGoal}
                    onChange={(e) => handleInputChange('targetGoal', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Ej: 100kg en press banca"
                  />
                </div>

                {/* Plazo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Plazo objetivo
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {timeframeOptions.map(timeframe => (
                      <button
                        key={timeframe}
                        type="button"
                        onClick={() => handleInputChange('timeframe', timeframe)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.timeframe === timeframe
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {timeframe}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frecuencia */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Frecuencia de entrenamiento
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {frequencyOptions.map(frequency => (
                      <button
                        key={frequency}
                        type="button"
                        onClick={() => handleInputChange('frequency', frequency)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.frequency === frequency
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {frequency}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Intensidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nivel de intensidad
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {intensityOptions.map(intensity => (
                      <button
                        key={intensity}
                        type="button"
                        onClick={() => handleInputChange('intensity', intensity)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.intensity === intensity
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {intensity}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Variables */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Variables a considerar
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {variableOptions.map(variable => (
                      <button
                        key={variable}
                        type="button"
                        onClick={() => handleArrayToggle('variables', variable)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.variables.includes(variable)
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {variable}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Limitaciones */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Limitaciones y restricciones
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {constraintOptions.map(constraint => (
                      <button
                        key={constraint}
                        type="button"
                        onClick={() => handleArrayToggle('constraints', constraint)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.constraints.includes(constraint)
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {constraint}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optimizaciones */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estrategias de optimizacion
                  </label>
                  <textarea
                    value={form.optimizations.join('\n')}
                    onChange={(e) => handleInputChange('optimizations', e.target.value.split('\n'))}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Agrega estrategias de optimizacion (una por linea)"
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
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
                  >
                    <BarChart className="w-4 h-4" />
                    <span>Simular Progreso</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  ¡Simulacion generada exitosamente!
                </div>
                <div className="mt-4 space-y-6">
                  {simulation.split('###').map((section, index) => {
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
                                <div key={lineIndex} className="flex items-start p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                                  <AlertCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                  <p className="text-green-700 dark:text-green-300">
                                    {trimmedLine.replace(/^!\s*/, '')}
                                  </p>
                                </div>
                              );
                            }
                            
                            if (trimmedLine.startsWith('-')) {
                              return (
                                <div key={lineIndex} className="flex items-start">
                                  <span className="text-green-500 mr-2">•</span>
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
                    Nueva simulacion
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg"
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

export default ProgressSimulator;
