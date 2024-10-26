import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Sparkles, Type, Pencil, Lightbulb, Image as ImageIcon, 
  MessageSquare, X, Palette, Mic, Share2, TrendingUp,
  BarChart2, Target, Users, Globe, Instagram, Facebook,
  Video, Wand2, Star, Zap, Brain, Rocket
} from 'lucide-react';
import Button from '../components/Common/Button';
import AIChat from '../components/ContentPublishing/AIChat';

const ContentPublishingPage: React.FC = () => {
  const { theme } = useTheme();
  const [showChat, setShowChat] = useState(false);
  const [chatTool, setChatTool] = useState('');
  const [hoveredTool, setHoveredTool] = useState('');

  const mainTools = [
    { 
      id: 'posts', 
      name: 'Crear Posts con IA', 
      icon: Sparkles,
      description: 'Genera posts virales para tus redes sociales con IA avanzada',
      gradient: 'from-purple-500 to-pink-500',
      features: ['Optimización SEO', 'Análisis de tendencias', 'Personalización automática']
    },
    { 
      id: 'stories', 
      name: 'Crear Historias con IA', 
      icon: ImageIcon,
      description: 'Diseña historias cautivadoras que conecten con tu audiencia',
      gradient: 'from-blue-500 to-cyan-500',
      features: ['Plantillas dinámicas', 'Efectos visuales', 'Programación automática']
    },
    { 
      id: 'image-gen', 
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
      name: 'Audience Analyzer', 
      icon: Users,
      description: 'Comprende y segmenta tu audiencia ideal',
      gradient: 'from-orange-500 to-red-500',
      features: ['Análisis demográfico', 'Patrones de comportamiento', 'Preferencias']
    },
    { 
      id: 'trends', 
      name: 'Trend Detector', 
      icon: TrendingUp,
      description: 'Detecta y aprovecha tendencias en tiempo real',
      gradient: 'from-pink-500 to-rose-500',
      features: ['Monitoreo 24/7', 'Predicciones', 'Alertas personalizadas']
    },
    { 
      id: 'competitor', 
      name: 'Competitor Analysis', 
      icon: Target,
      description: 'Analiza y supera a tu competencia',
      gradient: 'from-violet-500 to-purple-500',
      features: ['Benchmarking', 'Estrategias', 'Oportunidades']
    }
  ];

  const socialTools = [
    { 
      id: 'instagram', 
      name: 'Instagram Manager', 
      icon: Instagram,
      description: 'Optimiza tu presencia en Instagram',
      gradient: 'from-fuchsia-500 to-pink-500',
      features: ['Programación de posts', 'Análisis de hashtags', 'Engagement']
    },
    { 
      id: 'facebook', 
      name: 'Facebook Manager', 
      icon: Facebook,
      description: 'Maximiza tu impacto en Facebook',
      gradient: 'from-blue-600 to-indigo-500',
      features: ['Gestión de páginas', 'Análisis de alcance', 'Interacción']
    },
    { 
      id: 'global', 
      name: 'Global Publisher', 
      icon: Globe,
      description: 'Publica en todas tus redes desde un solo lugar',
      gradient: 'from-teal-500 to-emerald-500',
      features: ['Multi-plataforma', 'Calendario unificado', 'Analytics']
    }
  ];

  const comingSoonTools = [
    { 
      id: 'elevenlabs', 
      name: 'Eleven Labs', 
      icon: Mic,
      description: 'Síntesis de voz con IA de última generación',
      gradient: 'from-gray-500 to-gray-600',
      features: ['Voces naturales', 'Múltiples idiomas', 'Personalización'],
      comingSoon: true
    },
    { 
      id: 'videoeditor', 
      name: 'Editor de Video IA', 
      icon: Video,
      description: 'Edición de video automatizada e inteligente',
      gradient: 'from-gray-500 to-gray-600',
      features: ['Cortes automáticos', 'Efectos IA', 'Subtítulos'],
      comingSoon: true
    }
  ];

  const handleToolClick = (toolId: string) => {
    setChatTool(toolId);
    setShowChat(true);
  };

  const ToolCard = ({ tool, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-6 rounded-xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer relative overflow-hidden`}
      onClick={() => !tool.comingSoon && handleToolClick(tool.id)}
      onMouseEnter={() => setHoveredTool(tool.id)}
      onMouseLeave={() => setHoveredTool('')}
    >
      {tool.comingSoon && (
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            Próximamente
          </span>
        </div>
      )}
      
      <div className={`p-4 rounded-full bg-gradient-to-r ${tool.gradient} w-16 h-16 flex items-center justify-center mb-4 transform transition-transform duration-300 ${hoveredTool === tool.id ? 'scale-110' : ''}`}>
        <tool.icon className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
        {tool.description}
      </p>
      
      <div className="space-y-2">
        {tool.features.map((feature, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mainTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
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
            <Brain className="w-8 h-8 mr-3 text-green-500" />
            <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
              Análisis de Marketing
            </span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketingTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        </div>

        {/* Herramientas Sociales */}
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold mb-8 flex items-center"
          >
            <Share2 className="w-8 h-8 mr-3 text-orange-500" />
            <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
              Gestión de Redes Sociales
            </span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socialTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        </div>

        {/* Próximamente */}
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold mb-8 flex items-center"
          >
            <Zap className="w-8 h-8 mr-3 text-yellow-500" />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent">
              Próximamente
            </span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comingSoonTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        </div>

        {/* Chat Modal */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`relative w-full max-w-4xl h-[80vh] ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } rounded-2xl shadow-2xl overflow-hidden`}
              >
                <Button
                  variant="danger"
                  onClick={() => setShowChat(false)}
                  className="absolute top-4 right-4 z-10"
                >
                  <X className="w-5 h-5" />
                </Button>
                <AIChat toolId={chatTool} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContentPublishingPage;