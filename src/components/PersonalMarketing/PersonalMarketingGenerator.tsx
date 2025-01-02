import { useState } from 'react';
import { X, Check, Users, AlertCircle, Target, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PersonalMarketingGeneratorProps {
  isVisible: boolean;
  onClose: () => void;
}

interface FormData {
  niche: string;
  platforms: string[];
  objectives: string[];
  expertise: string[];
  targetAudience: string[];
  currentPresence: string;
}

const PersonalMarketingGenerator: React.FC<PersonalMarketingGeneratorProps> = ({
  isVisible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [strategy, setStrategy] = useState('');

  const [form, setForm] = useState<FormData>({
    niche: '',
    platforms: [],
    objectives: [],
    expertise: [],
    targetAudience: [],
    currentPresence: '',
  });

  const nicheOptions = [
    'Fitness general',
    'Pérdida de peso',
    'Entrenamiento funcional',
    'Yoga y bienestar',
    'Nutrición deportiva',
    'Rendimiento atlético'
  ];

  const platformOptions = [
    'Instagram',
    'YouTube',
    'TikTok',
    'LinkedIn',
    'Twitter',
    'Blog personal'
  ];

  const objectiveOptions = [
    'Aumentar clientes',
    'Construir autoridad',
    'Generar leads',
    'Crear comunidad',
    'Vender productos',
    'Networking'
  ];

  const audienceOptions = [
    'Principiantes',
    'Deportistas amateur',
    'Profesionales',
    'Corporativos',
    'Adultos mayores',
    'Jóvenes activos'
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
    
    setTimeout(() => {
      setStrategy(`### Estrategia de Marketing Personal

### Nicho y Posicionamiento
- Especialización: ${form.niche}
- Público objetivo: ${form.targetAudience.join(', ')}
- Propuesta de valor única: Experto en ${form.expertise.join(' y ')}

### Plan de Contenidos

#### Pilares de Contenido
- Educación: Tips y tutoriales sobre ${form.niche}
- Inspiración: Casos de éxito y transformaciones
- Engagement: Preguntas y debates con la comunidad
- Autoridad: Compartir conocimientos especializados

#### Estrategia por Plataforma
${form.platforms.map(platform => `
##### ${platform}
- Frecuencia: 3-5 posts semanales
- Formato principal: ${getFormatForPlatform(platform)}
- Enfoque: ${getFocusForPlatform(platform)}
`).join('\n')}

### Objetivos y KPIs
${form.objectives.map(obj => `- ${obj}: ${getKPIForObjective(obj)}`).join('\n')}

### Plan de Acción
- Semana 1-2: Optimización de perfiles
- Semana 3-4: Creación de contenido base
- Semana 5-6: Implementación de estrategia
- Semana 7-8: Análisis y ajustes

### Recomendaciones
- Mantener consistencia en la marca personal
- Interactuar regularmente con la audiencia
- Monitorear métricas clave
- Adaptar contenido según feedback

### Próximos Pasos
1. Optimizar biografías en redes sociales
2. Crear calendario de contenidos
3. Desarrollar banco de contenido
4. Establecer sistema de métricas`);
      
      setIsLoading(false);
      setShowForm(false);
    }, 2000);
  };

  const getFormatForPlatform = (platform: string) => {
    const formats: { [key: string]: string } = {
      'Instagram': 'Carruseles educativos y Reels',
      'YouTube': 'Videos tutoriales y vlogs',
      'TikTok': 'Videos cortos y challenges',
      'LinkedIn': 'Artículos y casos de estudio',
      'Twitter': 'Hilos informativos y tips',
      'Blog personal': 'Artículos detallados y guías'
    };
    return formats[platform] || 'Contenido variado';
  };

  const getFocusForPlatform = (platform: string) => {
    const focus: { [key: string]: string } = {
      'Instagram': 'Visuales atractivos y storytelling',
      'YouTube': 'Contenido educativo en profundidad',
      'TikTok': 'Entretenimiento y tendencias',
      'LinkedIn': 'Networking y profesionalismo',
      'Twitter': 'Conversación y actualidad',
      'Blog personal': 'SEO y contenido evergreen'
    };
    return focus[platform] || 'Engagement general';
  };

  const getKPIForObjective = (objective: string) => {
    const kpis: { [key: string]: string } = {
      'Aumentar clientes': 'Leads cualificados por mes',
      'Construir autoridad': 'Menciones y colaboraciones',
      'Generar leads': 'Tasa de conversión de seguidores',
      'Crear comunidad': 'Engagement rate y comentarios',
      'Vender productos': 'Conversiones y revenue',
      'Networking': 'Nuevas conexiones profesionales'
    };
    return kpis[objective] || 'Métricas personalizadas';
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
              <div className="p-4 rounded-t-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Marketing Personal</h2>
                <p className="text-violet-100">Potencia tu presencia profesional</p>
              </div>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
                </div>
              ) : showForm ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nicho */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nicho principal
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {nicheOptions.map(niche => (
                        <button
                          key={niche}
                          type="button"
                          onClick={() => handleInputChange('niche', niche)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.niche === niche
                              ? 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {niche}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Plataformas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Plataformas principales
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {platformOptions.map(platform => (
                        <button
                          key={platform}
                          type="button"
                          onClick={() => handleArrayToggle('platforms', platform)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.platforms.includes(platform)
                              ? 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {platform}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Objetivos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Objetivos principales
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {objectiveOptions.map(objective => (
                        <button
                          key={objective}
                          type="button"
                          onClick={() => handleArrayToggle('objectives', objective)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.objectives.includes(objective)
                              ? 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {objective}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audiencia */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Audiencia objetivo
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {audienceOptions.map(audience => (
                        <button
                          key={audience}
                          type="button"
                          onClick={() => handleArrayToggle('targetAudience', audience)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            form.targetAudience.includes(audience)
                              ? 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {audience}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Experiencia */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Áreas de experiencia
                    </label>
                    <textarea
                      value={form.expertise.join('\n')}
                      onChange={(e) => handleInputChange('expertise', e.target.value.split('\n'))}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      rows={3}
                      placeholder="Lista tus áreas de experiencia (una por línea)"
                    />
                  </div>

                  {/* Presencia actual */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Presencia actual en redes
                    </label>
                    <textarea
                      value={form.currentPresence}
                      onChange={(e) => handleInputChange('currentPresence', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      rows={3}
                      placeholder="Describe tu presencia actual en redes sociales"
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
                      className="px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg hover:from-violet-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
                    >
                      <Target className="w-4 h-4" />
                      <span>Generar Estrategia</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <div className="mb-4 p-4 rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300 flex items-center">
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
                                  <div key={lineIndex} className="flex items-start p-3 bg-violet-50 dark:bg-violet-900/30 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-violet-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <p className="text-violet-700 dark:text-violet-300">
                                      {trimmedLine.replace(/^!\s*/, '')}
                                    </p>
                                  </div>
                                );
                              }
                              
                              if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
                                return (
                                  <div key={lineIndex} className="flex items-start">
                                    <span className="text-violet-500 mr-2">•</span>
                                    <p className="text-gray-600 dark:text-gray-300">
                                      {trimmedLine.replace(/^[-•]\s*/, '')}
                                    </p>
                                  </div>
                                );
                              }
                              
                              if (trimmedLine.startsWith('#####')) {
                                return (
                                  <h5 key={lineIndex} className="text-md font-medium text-gray-900 dark:text-white mt-4">
                                    {trimmedLine.replace(/^##### /, '')}
                                  </h5>
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
                      className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg hover:from-violet-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg"
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

export default PersonalMarketingGenerator;
