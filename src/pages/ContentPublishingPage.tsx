import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Sparkles, Image as ImageIcon, MessageSquare, X, Mic, Share2, 
  TrendingUp, Target, Users, Globe, Instagram, Facebook,
  Video, Wand2, Zap, Brain, Rocket, BarChart, Mail, Search
} from 'lucide-react';
import Button from '../components/Common/Button';
import AIChat from '../components/ContentPublishing/AIChat';
import ToolCard from '../components/ContentPublishing/ToolCard';
import { chatService } from '../services/chatService';

const ContentPublishingPage: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useTheme();
  const [showChat, setShowChat] = useState(false);
  const [selectedChat, setSelectedChat] = useState<number>(0);

  const mainTools = [
    { 
      id: 'posts', 
      chatId: 1,
      name: 'Crear Posts con IA', 
      icon: Sparkles,
      description: 'Genera posts virales para tus redes sociales con IA avanzada',
      gradient: 'from-purple-500 to-pink-500',
      features: ['Optimización SEO', 'Análisis de tendencias', 'Personalización automática']
    },
    { 
      id: 'stories', 
      chatId: 2,
      name: 'Crear Historias con IA', 
      icon: ImageIcon,
      description: 'Diseña historias cautivadoras que conecten con tu audiencia',
      gradient: 'from-blue-500 to-cyan-500',
      features: ['Plantillas dinámicas', 'Efectos visuales', 'Programación automática']
    },
    { 
      id: 'image-gen', 
      chatId: 3,
      name: 'Image Creator', 
      icon: Wand2,
      description: 'Genera imágenes únicas y profesionales con IA',
      gradient: 'from-green-500 to-emerald-500',
      features: ['Estilos personalizados', 'Alta resolución', 'Edición avanzada']
    }
  ];

  const marketingTools = [
    { 
      id: 'audience', 
      chatId: 4,
      name: 'Audience Analyzer', 
      icon: Users,
      description: 'Comprende y segmenta tu audiencia ideal',
      gradient: 'from-orange-500 to-red-500',
      features: ['Análisis demográfico', 'Patrones de comportamiento', 'Preferencias']
    },
    { 
      id: 'trends', 
      chatId: 5,
      name: 'Trend Detector', 
      icon: TrendingUp,
      description: 'Detecta y aprovecha tendencias en tiempo real',
      gradient: 'from-pink-500 to-rose-500',
      features: ['Monitoreo 24/7', 'Predicciones', 'Alertas personalizadas']
    },
    { 
      id: 'content-strategy', 
      chatId: 6,
      name: 'Content Strategy', 
      icon: Brain,
      description: 'Desarrolla estrategias efectivas de contenido',
      gradient: 'from-violet-500 to-purple-500',
      features: ['Planificación', 'Calendario editorial', 'Optimización']
    }
  ];

  const optimizationTools = [
    { 
      id: 'seo', 
      chatId: 7,
      name: 'SEO Optimizer', 
      icon: Search,
      description: 'Optimiza tu contenido para motores de búsqueda',
      gradient: 'from-fuchsia-500 to-pink-500',
      features: ['Keywords', 'Meta tags', 'Estructura']
    },
    { 
      id: 'email', 
      chatId: 8,
      name: 'Email Marketing', 
      icon: Mail,
      description: 'Crea campañas efectivas de correo electrónico',
      gradient: 'from-blue-600 to-indigo-500',
      features: ['Templates', 'Segmentación', 'A/B Testing']
    },
    { 
      id: 'analytics', 
      chatId: 9,
      name: 'Analytics Expert', 
      icon: BarChart,
      description: 'Analiza e interpreta métricas digitales',
      gradient: 'from-teal-500 to-emerald-500',
      features: ['KPIs', 'Reportes', 'Insights']
    }
  ];

  const handleToolClick = (tool: Tool) => {
    console.log('ContentPublishingPage - handleToolClick llamado con tool:', tool);
    console.log('ContentPublishingPage - chatId del tool:', tool.chatId);
    setSelectedTool(tool);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('ContentPublishingPage - Cerrando modal');
    setIsModalOpen(false);
    setSelectedTool(null);
  };

  const handleSendMessage = async (message: string) => {
    console.log('ContentPublishingPage - handleSendMessage llamado con mensaje:', message);
    console.log('ContentPublishingPage - selectedTool actual:', selectedTool);
    
    if (!selectedTool) {
      console.error('ContentPublishingPage - No hay herramienta seleccionada');
      return;
    }

    try {
      const response = await chatService.sendMessage(selectedTool.chatId, message);
      console.log('ContentPublishingPage - Respuesta del servidor:', response);
      return response;
    } catch (error) {
      console.error('ContentPublishingPage - Error al enviar mensaje:', error);
      throw error;
    }
  };

  return (
    <div className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Centro de Creación de Contenido
          </h1>
          <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Potencia tu marketing con nuestras herramientas de IA de última generación
          </p>
        </motion.div>

        {/* Herramientas Principales */}
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold mb-8 flex items-center"
          >
            <Rocket className="w-8 h-8 mr-3 text-blue-500" />
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Creación de Contenido
            </span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainTools.map((tool) => (
              <ToolCard 
                key={tool.id}
                tool={tool}
                onClick={() => handleToolClick(tool)}
                theme={theme}
              />
            ))}
          </div>
        </div>

        {/* Herramientas de Marketing */}
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold mb-8 flex items-center"
          >
            <Target className="w-8 h-8 mr-3 text-pink-500" />
            <span className="bg-gradient-to-r from-pink-400 to-red-600 bg-clip-text text-transparent">
              Análisis y Estrategia
            </span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketingTools.map((tool) => (
              <ToolCard 
                key={tool.id}
                tool={tool}
                onClick={() => handleToolClick(tool)}
                theme={theme}
              />
            ))}
          </div>
        </div>

        {/* Herramientas de Optimización */}
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold mb-8 flex items-center"
          >
            <Zap className="w-8 h-8 mr-3 text-yellow-500" />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent">
              Optimización y Análisis
            </span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {optimizationTools.map((tool) => (
              <ToolCard 
                key={tool.id}
                tool={tool}
                onClick={() => handleToolClick(tool)}
                theme={theme}
              />
            ))}
          </div>
        </div>

        {/* Chat Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            >
              <div className={`relative w-full max-w-4xl h-[80vh] rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <AIChat
                  onSendMessage={handleSendMessage}
                  chatDescription={chatService.getChatDescription(selectedTool?.chatId)}
                  theme={theme}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContentPublishingPage;