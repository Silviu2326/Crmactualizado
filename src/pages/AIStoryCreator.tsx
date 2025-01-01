import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ImageIcon, Send, ArrowLeft, Layout } from 'lucide-react';
import Button from '../components/Common/Button';
import { useNavigate } from 'react-router-dom';

const AIStoryCreator: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const templates = [
    { id: 'carousel', name: 'Carrusel', icon: Layout },
    { id: 'story', name: 'Historia Simple', icon: ImageIcon },
    { id: 'poll', name: 'Encuesta', icon: Layout },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || !selectedTemplate) return;
    
    setIsGenerating(true);
    try {
      // Aquí iría la llamada a tu servicio de IA
      // Por ahora usamos un contenido de ejemplo
      const response = await new Promise(resolve => 
        setTimeout(() => resolve('¡Historia generada por IA! Esta es una historia de ejemplo.'), 1500)
      );
      setGeneratedContent(response as string);
    } catch (error) {
      console.error('Error al generar contenido:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate('/content')}
          className="mb-6 flex items-center gap-2"
          variant="ghost"
        >
          <ArrowLeft size={20} />
          Volver
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <ImageIcon className="text-blue-500" />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
              Creador de Historias con IA
            </span>
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Genera historias cautivadoras para tus redes sociales con ayuda de IA
          </p>
        </div>

        <div className="space-y-6">
          {/* Selección de plantilla */}
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className="text-xl font-semibold mb-4">Selecciona una plantilla:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTemplate === template.id
                      ? theme === 'dark'
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-blue-500 bg-blue-50'
                      : theme === 'dark'
                      ? 'border-gray-700 hover:border-blue-400'
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                >
                  <template.icon className={`w-8 h-8 mx-auto mb-2 ${
                    selectedTemplate === template.id ? 'text-blue-500' : 'text-gray-500'
                  }`} />
                  <span className="block text-center">{template.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Área de prompt */}
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe el tipo de historia que quieres generar..."
              className={`w-full h-32 p-4 rounded-lg resize-none ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-50 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 outline-none`}
            />
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim() || !selectedTemplate}
              className="mt-4 w-full flex items-center justify-center gap-2"
              variant="primary"
            >
              {isGenerating ? (
                <>Generando...</>
              ) : (
                <>
                  <Send size={20} />
                  Generar Historia
                </>
              )}
            </Button>
          </div>

          {/* Contenido generado */}
          {generatedContent && (
            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className="text-xl font-semibold mb-4">Historia Generada:</h3>
              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                {generatedContent}
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="flex-1">
                  Copiar
                </Button>
                <Button variant="primary" className="flex-1">
                  Guardar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIStoryCreator;
