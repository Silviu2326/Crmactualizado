import { useState } from 'react';
import { X, Check, Rocket, AlertCircle } from 'lucide-react';

interface PlateauStrategiesPlannerProps {
  isVisible: boolean;
  onClose: () => void;
}

interface FormData {
  currentPlateau: string;
  plateauDuration: string;
  previousStrategies: string[];
  currentLevel: string;
  targetLevel: string;
  limitations: string[];
  motivation: number;
}

const PlateauStrategiesPlanner: React.FC<PlateauStrategiesPlannerProps> = ({
  isVisible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [strategy, setStrategy] = useState('');

  const [form, setForm] = useState<FormData>({
    currentPlateau: '',
    plateauDuration: '',
    previousStrategies: [],
    currentLevel: '',
    targetLevel: '',
    limitations: [],
    motivation: 5,
  });

  const plateauDurations = [
    '1-2 semanas',
    '2-4 semanas',
    '1-2 meses',
    'Más de 2 meses'
  ];

  const previousStrategiesOptions = [
    'Aumentar intensidad',
    'Cambiar rutina',
    'Descanso activo',
    'Nutrición específica',
    'Nuevo entrenador',
    'Cambio de horario'
  ];

  const limitationsOptions = [
    'Tiempo limitado',
    'Lesiones previas',
    'Equipo limitado',
    'Presupuesto',
    'Energía/Fatiga',
    'Técnica'
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: 'previousStrategies' | 'limitations', value: string) => {
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
    
    // Aquí iría la lógica para generar la estrategia
    // Simularemos una respuesta después de 2 segundos
    setTimeout(() => {
      setStrategy(`### Análisis del Estancamiento
- El estancamiento actual se centra en ${form.currentPlateau}
- Ha persistido durante ${form.plateauDuration}
- El nivel actual es ${form.currentLevel}
- El objetivo es alcanzar ${form.targetLevel}

### Estrategias Previas Analizadas
${form.previousStrategies.map(strategy => `- ${strategy}: Requiere ajuste o modificación`).join('\n')}

### Limitaciones Identificadas
${form.limitations.map(limitation => `- ${limitation}: Requiere consideración especial`).join('\n')}

### Plan de Acción Recomendado
- Implementar periodización ondulante
- Introducir nuevos estímulos de entrenamiento
- Ajustar la nutrición según la fase de entrenamiento
- Establecer mini-objetivos semanales

### Seguimiento y Ajustes
- Registrar progreso diario
- Evaluar resultados cada 2 semanas
- Ajustar según la respuesta individual`);
      
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
            <div className="p-4 rounded-t-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Planificador de Estrategias</h2>
              <p className="text-indigo-100">Supera mesetas en tu rendimiento</p>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
            ) : showForm ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Descripción del estancamiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Describe tu estancamiento actual
                  </label>
                  <textarea
                    value={form.currentPlateau}
                    onChange={(e) => handleInputChange('currentPlateau', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Describe en qué aspecto te sientes estancado..."
                  />
                </div>

                {/* Duración del estancamiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ¿Cuánto tiempo llevas estancado?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {plateauDurations.map(duration => (
                      <button
                        key={duration}
                        type="button"
                        onClick={() => handleInputChange('plateauDuration', duration)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.plateauDuration === duration
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nivel actual y objetivo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nivel actual
                    </label>
                    <input
                      type="text"
                      value={form.currentLevel}
                      onChange={(e) => handleInputChange('currentLevel', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="Ej: 80kg en press banca"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nivel objetivo
                    </label>
                    <input
                      type="text"
                      value={form.targetLevel}
                      onChange={(e) => handleInputChange('targetLevel', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="Ej: 100kg en press banca"
                    />
                  </div>
                </div>

                {/* Estrategias previas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estrategias que has intentado
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {previousStrategiesOptions.map(strategy => (
                      <button
                        key={strategy}
                        type="button"
                        onClick={() => handleArrayToggle('previousStrategies', strategy)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.previousStrategies.includes(strategy)
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {strategy}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Limitaciones */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Limitaciones actuales
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {limitationsOptions.map(limitation => (
                      <button
                        key={limitation}
                        type="button"
                        onClick={() => handleArrayToggle('limitations', limitation)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.limitations.includes(limitation)
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {limitation}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nivel de motivación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nivel de motivación actual (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={form.motivation}
                    onChange={(e) => handleInputChange('motivation', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Baja</span>
                    <span>Alta</span>
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
                    className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
                  >
                    <Rocket className="w-4 h-4" />
                    <span>Generar Estrategia</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                <div className="mb-4 p-4 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  ¡Estrategia generada exitosamente!
                </div>
                <div className="mt-4 space-y-6">
                  {strategy.split('###').map((section, index) => {
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
                                <div key={lineIndex} className="flex items-start p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                                  <AlertCircle className="w-5 h-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                                  <p className="text-indigo-700 dark:text-indigo-300">
                                    {trimmedLine.replace(/^!\s*/, '')}
                                  </p>
                                </div>
                              );
                            }
                            
                            if (trimmedLine.startsWith('-')) {
                              return (
                                <div key={lineIndex} className="flex items-start">
                                  <span className="text-indigo-500 mr-2">•</span>
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
                    Nueva estrategia
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
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

export default PlateauStrategiesPlanner;
