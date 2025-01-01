import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sparkles, Send, ArrowLeft } from 'lucide-react';
import Button from '../components/Common/Button';
import { useNavigate } from 'react-router-dom';

const AIPostCreator: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      // Aquí iría la llamada a tu servicio de IA
      // Por ahora usamos un contenido de ejemplo
      const response = await new Promise(resolve => 
        setTimeout(() => resolve('¡Contenido generado por IA! Este es un post de ejemplo.'), 1500)
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
            <Sparkles className="text-purple-500" />
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Creador de Posts con IA
            </span>
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Genera posts virales para tus redes sociales con ayuda de IA
          </p>
        </div>

        <div className="space-y-6">
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe el tipo de post que quieres generar..."
              className={`w-full h-32 p-4 rounded-lg resize-none ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-50 text-gray-900'
              } focus:ring-2 focus:ring-purple-500 outline-none`}
            />
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="mt-4 w-full flex items-center justify-center gap-2"
              variant="primary"
            >
              {isGenerating ? (
                <>Generando...</>
              ) : (
                <>
                  <Send size={20} />
                  Generar Post
                </>
              )}
            </Button>
          </div>

          {generatedContent && (
            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className="text-xl font-semibold mb-4">Contenido Generado:</h3>
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

export default AIPostCreator;
