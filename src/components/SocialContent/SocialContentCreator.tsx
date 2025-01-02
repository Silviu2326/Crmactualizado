import { useState } from 'react';
import { X, Check, Instagram, AlertCircle, Image, Video, Hash } from 'lucide-react';

interface SocialContentCreatorProps {
  isVisible: boolean;
  onClose: () => void;
}

interface FormData {
  contentType: 'post' | 'story' | 'reel';
  topic: string;
  objective: string;
  targetAudience: string;
  tone: string;
  hashtags: string[];
  visualElements: string[];
}

const SocialContentCreator: React.FC<SocialContentCreatorProps> = ({
  isVisible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [content, setContent] = useState('');

  const [form, setForm] = useState<FormData>({
    contentType: 'post',
    topic: '',
    objective: '',
    targetAudience: '',
    tone: '',
    hashtags: [],
    visualElements: [],
  });

  const contentTypes = [
    { id: 'post', label: 'Post', icon: Instagram },
    { id: 'story', label: 'Story', icon: Image },
    { id: 'reel', label: 'Reel', icon: Video }
  ];

  const toneOptions = [
    'Profesional',
    'Casual',
    'Motivador',
    'Educativo',
    'Divertido',
    'Inspirador'
  ];

  const hashtagOptions = [
    '#fitness',
    '#healthy',
    '#workout',
    '#motivation',
    '#lifestyle',
    '#training',
    '#gym',
    '#health'
  ];

  const visualElementOptions = [
    'Foto de ejercicio',
    'Video demostrativo',
    'Infografía',
    'Antes/Después',
    'Cita motivacional',
    'Tutorial paso a paso'
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: 'hashtags' | 'visualElements', value: string) => {
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
    
    // Aquí iría la lógica para generar el contenido
    // Simularemos una respuesta después de 2 segundos
    setTimeout(() => {
      setContent(`### Contenido para ${form.contentType.toUpperCase()}

### Descripcion del Contenido
${form.topic}

### Objetivo
${form.objective}

### Audiencia Objetivo
${form.targetAudience}

### Tono de Comunicacion
${form.tone}

### Elementos Visuales Recomendados
${form.visualElements.map(element => `- ${element}`).join('\n')}

### Hashtags Sugeridos
${form.hashtags.map(hashtag => hashtag).join(' ')}

### Estructura del Contenido

#### Introduccion
- Gancho inicial atractivo
- Presentacion del tema principal
- Llamada a la atencion

#### Desarrollo
- Puntos clave del mensaje
- Beneficios o informacion relevante
- Ejemplos o demostraciones

#### Cierre
- Llamada a la accion clara
- Invitacion a interactuar
- Elemento de conexion con la audiencia`);
      
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
            <div className="p-4 rounded-t-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Creador de Contenido Social</h2>
              <p className="text-pink-100">Genera contenido atractivo para redes sociales</p>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
              </div>
            ) : showForm ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tipo de contenido */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de contenido
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {contentTypes.map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleInputChange('contentType', type.id)}
                        className={`p-3 rounded-lg text-sm transition-colors flex items-center justify-center space-x-2 ${
                          form.contentType === type.id
                            ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        <type.icon className="w-4 h-4" />
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tema */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tema del contenido
                  </label>
                  <textarea
                    value={form.topic}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    rows={2}
                    placeholder="¿Sobre qué quieres hablar?"
                  />
                </div>

                {/* Objetivo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Objetivo del contenido
                  </label>
                  <input
                    type="text"
                    value={form.objective}
                    onChange={(e) => handleInputChange('objective', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="¿Qué quieres lograr con este contenido?"
                  />
                </div>

                {/* Audiencia objetivo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Audiencia objetivo
                  </label>
                  <input
                    type="text"
                    value={form.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="¿A quién va dirigido este contenido?"
                  />
                </div>

                {/* Tono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tono de comunicación
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {toneOptions.map(tone => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => handleInputChange('tone', tone)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.tone === tone
                            ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hashtags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hashtags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {hashtagOptions.map(hashtag => (
                      <button
                        key={hashtag}
                        type="button"
                        onClick={() => handleArrayToggle('hashtags', hashtag)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center ${
                          form.hashtags.includes(hashtag)
                            ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        <Hash className="w-3 h-3 mr-1" />
                        {hashtag.replace('#', '')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Elementos visuales */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Elementos visuales
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {visualElementOptions.map(element => (
                      <button
                        key={element}
                        type="button"
                        onClick={() => handleArrayToggle('visualElements', element)}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          form.visualElements.includes(element)
                            ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {element}
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
                    <Instagram className="w-4 h-4" />
                    <span>Generar Contenido</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                <div className="mb-4 p-4 rounded-lg bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300 flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  ¡Contenido generado exitosamente!
                </div>
                <div className="mt-4 space-y-6">
                  {content.split('###').map((section, index) => {
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
                                <div key={lineIndex} className="flex items-start p-3 bg-pink-50 dark:bg-pink-900/30 rounded-lg">
                                  <AlertCircle className="w-5 h-5 text-pink-500 mr-2 flex-shrink-0 mt-0.5" />
                                  <p className="text-pink-700 dark:text-pink-300">
                                    {trimmedLine.replace(/^!\s*/, '')}
                                  </p>
                                </div>
                              );
                            }
                            
                            if (trimmedLine.startsWith('-')) {
                              return (
                                <div key={lineIndex} className="flex items-start">
                                  <span className="text-pink-500 mr-2">•</span>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    {trimmedLine.replace(/^-\s*/, '')}
                                  </p>
                                </div>
                              );
                            }
                            
                            if (trimmedLine.startsWith('#')) {
                              return (
                                <span key={lineIndex} className="inline-block px-2 py-1 m-1 bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300 rounded-full text-sm">
                                  {trimmedLine}
                                </span>
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
                    Nuevo contenido
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
        </div>
      </div>
    </div>
  );
};

export default SocialContentCreator;
