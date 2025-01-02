import { useState } from 'react';
import { X, Check, Gift, AlertCircle, Trophy, Target, Calendar } from 'lucide-react';

interface ChallengesCreatorProps {
  isVisible: boolean;
  onClose: () => void;
}

interface FormData {
  challengeName: string;
  duration: string;
  difficulty: string;
  objectives: string[];
  rewards: string[];
  milestones: string[];
  participantLimit: string;
  rules: string[];
}

const ChallengesCreator: React.FC<ChallengesCreatorProps> = ({
  isVisible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [challenge, setChallenge] = useState('');

  const [form, setForm] = useState<FormData>({
    challengeName: '',
    duration: '',
    difficulty: '',
    objectives: [],
    rewards: [],
    milestones: [],
    participantLimit: '',
    rules: [],
  });

  const durationOptions = [
    '1 semana',
    '2 semanas',
    '1 mes',
    '3 meses'
  ];

  const difficultyOptions = [
    'Principiante',
    'Intermedio',
    'Avanzado',
    'Elite'
  ];

  const objectiveOptions = [
    'Perdida de peso',
    'Ganancia muscular',
    'Resistencia',
    'Fuerza',
    'Flexibilidad',
    'Habitos saludables'
  ];

  const rewardOptions = [
    'Medalla virtual',
    'Descuento en servicios',
    'Sesion personal gratis',
    'Reconocimiento publico',
    'Productos fitness',
    'Puntos canjeables'
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: 'objectives' | 'rewards' | 'rules', value: string) => {
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
      setChallenge(`### Reto: ${form.challengeName}

### Detalles del Reto
- Duracion: ${form.duration}
- Dificultad: ${form.difficulty}
- Limite de participantes: ${form.participantLimit}

### Objetivos
${form.objectives.map(objective => `- ${objective}`).join('\n')}

### Recompensas
${form.rewards.map(reward => `- ${reward}`).join('\n')}

### Hitos y Progresion
${form.milestones.map((milestone, index) => `${index + 1}. ${milestone}`).join('\n')}

### Reglas y Lineamientos
${form.rules.map(rule => `- ${rule}`).join('\n')}

### Sistema de Puntuacion
- Participacion diaria: 10 puntos
- Logro de hitos: 50 puntos
- Completar reto: 100 puntos
- Bonus por consistencia: 25 puntos

### Seguimiento y Motivacion
- Tabla de clasificacion en tiempo real
- Recordatorios diarios
- Celebracion de logros
- Comunidad de apoyo`);
      
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
            <div className="p-4 rounded-t-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Creador de Retos</h2>
              <p className="text-yellow-100">Diseña retos motivadores para tus clientes</p>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600" />
              </div>
            ) : showForm ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre del reto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre del reto
                  </label>
                  <input
                    type="text"
                    value={form.challengeName}
                    onChange={(e) => handleInputChange('challengeName', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Ej: Reto 30 dias de transformacion"
                  />
                </div>

                {/* Duración */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duracion del reto
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {durationOptions.map(duration => (
                      <button
                        key={duration}
                        type="button"
                        onClick={() => handleInputChange('duration', duration)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.duration === duration
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dificultad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nivel de dificultad
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {difficultyOptions.map(difficulty => (
                      <button
                        key={difficulty}
                        type="button"
                        onClick={() => handleInputChange('difficulty', difficulty)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.difficulty === difficulty
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Objetivos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Objetivos del reto
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {objectiveOptions.map(objective => (
                      <button
                        key={objective}
                        type="button"
                        onClick={() => handleArrayToggle('objectives', objective)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.objectives.includes(objective)
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {objective}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recompensas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recompensas
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {rewardOptions.map(reward => (
                      <button
                        key={reward}
                        type="button"
                        onClick={() => handleArrayToggle('rewards', reward)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.rewards.includes(reward)
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {reward}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hitos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hitos del reto
                  </label>
                  <textarea
                    value={form.milestones.join('\n')}
                    onChange={(e) => handleInputChange('milestones', e.target.value.split('\n'))}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Agrega los hitos del reto (uno por linea)"
                  />
                </div>

                {/* Límite de participantes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Limite de participantes
                  </label>
                  <input
                    type="number"
                    value={form.participantLimit}
                    onChange={(e) => handleInputChange('participantLimit', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Numero maximo de participantes"
                  />
                </div>

                {/* Reglas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reglas del reto
                  </label>
                  <textarea
                    value={form.rules.join('\n')}
                    onChange={(e) => handleInputChange('rules', e.target.value.split('\n'))}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Agrega las reglas del reto (una por linea)"
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
                    className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Crear Reto</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                <div className="mb-4 p-4 rounded-lg bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  ¡Reto creado exitosamente!
                </div>
                <div className="mt-4 space-y-6">
                  {challenge.split('###').map((section, index) => {
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
                                <div key={lineIndex} className="flex items-start p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                                  <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                                  <p className="text-yellow-700 dark:text-yellow-300">
                                    {trimmedLine.replace(/^!\s*/, '')}
                                  </p>
                                </div>
                              );
                            }
                            
                            if (trimmedLine.startsWith('-')) {
                              return (
                                <div key={lineIndex} className="flex items-start">
                                  <span className="text-yellow-500 mr-2">•</span>
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
                    Nuevo reto
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg"
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

export default ChallengesCreator;
