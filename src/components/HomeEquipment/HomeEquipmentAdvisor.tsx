import { useState } from 'react';
import { X, Check, Home, AlertCircle, Package, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HomeEquipmentAdvisorProps {
  isVisible: boolean;
  onClose: () => void;
}

interface FormData {
  spaceAvailable: string;
  budget: string;
  fitnessGoals: string[];
  experienceLevel: string;
  preferences: string[];
  constraints: string[];
}

const HomeEquipmentAdvisor: React.FC<HomeEquipmentAdvisorProps> = ({
  isVisible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [recommendation, setRecommendation] = useState('');

  const [form, setForm] = useState<FormData>({
    spaceAvailable: '',
    budget: '',
    fitnessGoals: [],
    experienceLevel: '',
    preferences: [],
    constraints: [],
  });

  const spaceOptions = [
    'Espacio reducido (<10m²)',
    'Espacio medio (10-20m²)',
    'Espacio amplio (>20m²)',
    'Exterior disponible'
  ];

  const budgetOptions = [
    'Bajo (<200€)',
    'Medio (200-500€)',
    'Alto (500-1000€)',
    'Premium (>1000€)'
  ];

  const goalOptions = [
    'Perdida de peso',
    'Ganancia muscular',
    'Resistencia',
    'Flexibilidad',
    'Fuerza',
    'Rehabilitacion'
  ];

  const experienceOptions = [
    'Principiante',
    'Intermedio',
    'Avanzado',
    'Atleta'
  ];

  const preferenceOptions = [
    'Pesas libres',
    'Maquinas',
    'Bandas elasticas',
    'Calistenia',
    'Cardio',
    'Funcional'
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: 'fitnessGoals' | 'preferences' | 'constraints', value: string) => {
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
      setRecommendation(`### Analisis de Requisitos
- Espacio disponible: ${form.spaceAvailable}
- Presupuesto: ${form.budget}
- Nivel de experiencia: ${form.experienceLevel}

### Objetivos de Entrenamiento
${form.fitnessGoals.map(goal => `- ${goal}`).join('\n')}

### Preferencias de Equipamiento
${form.preferences.map(pref => `- ${pref}`).join('\n')}

### Equipo Recomendado

#### Equipamiento Esencial
- Conjunto de mancuernas ajustables
- Banda de resistencia set completo
- Colchoneta de ejercicio
- Barra de dominadas para puerta

#### Equipamiento Opcional
- TRX o sistema de suspension
- Banco ajustable
- Kettlebell (2-3 pesos)
- Step de ejercicio

#### Alternativas Economicas
- Bandas de resistencia como sustituto de pesas
- Botellas de agua rellenas como pesos
- Muebles adaptados para ejercicios
- Apps de entrenamiento gratuitas

### Organizacion del Espacio
- Zona de almacenamiento compacta
- Area de ejercicio flexible
- Espacio multiuso adaptable
- Solucion de pared plegable

### Consideraciones Adicionales
- Ventilacion adecuada
- Iluminacion natural/artificial
- Superficie antideslizante
- Espejo para forma

### Presupuesto Desglosado
- Equipo esencial: 60% del presupuesto
- Accesorios: 25% del presupuesto
- Extras y mejoras: 15% del presupuesto`);
      
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
              <div className="p-4 rounded-t-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Orientador de Equipamiento</h2>
                <p className="text-blue-100">Optimiza tu entrenamiento en casa</p>
              </div>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
              ) : showForm ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Espacio disponible */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Espacio disponible
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {spaceOptions.map(space => (
                        <button
                          key={space}
                          type="button"
                          onClick={() => handleInputChange('spaceAvailable', space)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.spaceAvailable === space
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {space}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Presupuesto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Presupuesto disponible
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {budgetOptions.map(budget => (
                        <button
                          key={budget}
                          type="button"
                          onClick={() => handleInputChange('budget', budget)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.budget === budget
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {budget}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Objetivos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Objetivos de entrenamiento
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {goalOptions.map(goal => (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => handleArrayToggle('fitnessGoals', goal)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.fitnessGoals.includes(goal)
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nivel de experiencia */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nivel de experiencia
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {experienceOptions.map(experience => (
                        <button
                          key={experience}
                          type="button"
                          onClick={() => handleInputChange('experienceLevel', experience)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.experienceLevel === experience
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {experience}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preferencias */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Preferencias de equipamiento
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {preferenceOptions.map(preference => (
                        <button
                          key={preference}
                          type="button"
                          onClick={() => handleArrayToggle('preferences', preference)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.preferences.includes(preference)
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {preference}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Limitaciones */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Limitaciones o restricciones
                    </label>
                    <textarea
                      value={form.constraints.join('\n')}
                      onChange={(e) => handleInputChange('constraints', e.target.value.split('\n'))}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      rows={3}
                      placeholder="Agrega limitaciones o restricciones (una por linea)"
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
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
                    >
                      <Package className="w-4 h-4" />
                      <span>Generar Recomendacion</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <div className="mb-4 p-4 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    ¡Recomendacion generada exitosamente!
                  </div>
                  <div className="mt-4 space-y-6">
                    {recommendation.split('###').map((section, index) => {
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
                                  <div key={lineIndex} className="flex items-start p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <p className="text-blue-700 dark:text-blue-300">
                                      {trimmedLine.replace(/^!\s*/, '')}
                                    </p>
                                  </div>
                                );
                              }
                              
                              if (trimmedLine.startsWith('-')) {
                                return (
                                  <div key={lineIndex} className="flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
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
                      Nueva consulta
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg"
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

export default HomeEquipmentAdvisor;
