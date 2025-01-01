import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Image as ImageIcon, MessageSquare, X, Mic, Share2, 
  TrendingUp, Target, Users, Globe, Instagram, Facebook,
  Video, Wand2, Zap, Brain, Rocket, BarChart, Mail, Search,
  Snowflake, Gift, TreeDeciduous, Star, Home, Briefcase
} from 'lucide-react';
import Button from '../components/Common/Button';
import AIChat from '../components/ContentPublishing/AIChat';
import ToolCard from '../components/ContentPublishing/ToolCard';
import { chatService } from '../services/chatService';

const ContentPublishingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useTheme();
  const [showChat, setShowChat] = useState(false);
  const [selectedChat, setSelectedChat] = useState<number>(0);
  const [showSnow, setShowSnow] = useState(true);

  // Estilos navideños
  const christmasStyles = {
    container: `min-h-screen p-8 relative ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-gray-900 via-green-900/10 to-gray-900 text-white' 
        : 'bg-gradient-to-b from-red-50 via-green-50/30 to-red-50 text-gray-800'
    }`,
    title: 'text-5xl font-bold mb-4 flex items-center justify-center gap-4',
    titleGradient: theme === 'dark'
      ? 'bg-gradient-to-r from-red-400 via-green-400 to-red-400'
      : 'bg-gradient-to-r from-red-600 via-green-600 to-red-600',
    snowflake: 'absolute animate-fall pointer-events-none',
    toolCard: `transform transition-all duration-300 hover:scale-105 ${
      theme === 'dark' 
        ? 'hover:shadow-lg hover:shadow-green-500/20' 
        : 'hover:shadow-lg hover:shadow-red-500/20'
    }`
  };

  // Generar copos de nieve
  const snowflakes = showSnow ? Array.from({ length: 30 }).map((_, i) => ({
    style: {
      position: 'absolute',
      left: `${Math.random() * 100}%`,
      top: `-20px`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 2}s`,
      opacity: Math.random() * 0.5 + 0.5
    }
  })) : [];

  useEffect(() => {
    const styles = `
      @keyframes fall {
        0% {
          transform: translateY(-10vh) rotate(0deg);
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
        }
      }
      
      .animate-fall {
        animation: fall linear infinite;
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const mainTools = [
    { 
      id: 'posts', 
      chatId: 1,
      name: 'Generador de publicaciones con IA', 
      icon: Sparkles,
      description: 'Genera posts virales para tus redes sociales con IA avanzada',
      gradient: 'from-purple-500 to-pink-500',
      features: ['Optimización SEO', 'Análisis de tendencias', 'Personalización automática']
    },
    { 
      id: 'stories', 
      chatId: 2,
      name: 'Generador de HISTORIAS CON IA', 
      icon: ImageIcon,
      description: 'Diseña historias cautivadoras que conecten con tu audiencia',
      gradient: 'from-blue-500 to-cyan-500',
      features: ['Plantillas dinámicas', 'Efectos visuales', 'Programación automática']
    },
    { 
      id: 'content-strategy', 
      chatId: 3,
      name: 'Content Strategy', 
      icon: Brain,
      description: 'Desarrolla estrategias efectivas de contenido',
      gradient: 'from-violet-500 to-purple-500',
      features: ['Planificación', 'Calendario editorial', 'Optimización']
    }
  ];

  const fitnessTools = [
    {
      id: 'express-plans',
      chatId: 4,
      name: 'Generador de Planes Exprés',
      icon: Zap,
      description: 'Crea planes de entrenamiento rápidos y efectivos',
      gradient: 'from-green-500 to-emerald-500',
      features: ['Personalización', 'Objetivos específicos', 'Rutinas rápidas']
    },
    {
      id: 'injury-diagnosis',
      chatId: 5,
      name: 'Diagnóstico de Lesiones y Adaptaciones',
      icon: Target,
      description: 'Analiza y adapta entrenamientos según lesiones',
      gradient: 'from-red-500 to-orange-500',
      features: ['Evaluación', 'Recomendaciones', 'Ejercicios alternativos']
    },
    {
      id: 'lifestyle-guide',
      chatId: 6,
      name: 'Guía de Estilo de Vida y Hábitos Diarios',
      icon: TreeDeciduous,
      description: 'Optimiza tus hábitos diarios para mejor rendimiento',
      gradient: 'from-teal-500 to-cyan-500',
      features: ['Rutinas diarias', 'Nutrición', 'Descanso']
    }
  ];

  const performanceTools = [
    {
      id: 'plateau-strategies',
      chatId: 7,
      name: 'Planificador de Estrategias para Superar Estancamientos',
      icon: Rocket,
      description: 'Supera mesetas en tu rendimiento',
      gradient: 'from-indigo-500 to-blue-500',
      features: ['Análisis', 'Soluciones', 'Seguimiento']
    },
    {
      id: 'smart-goals',
      chatId: 8,
      name: 'Constructor de Metas SMART',
      icon: Target,
      description: 'Define objetivos específicos y alcanzables',
      gradient: 'from-purple-500 to-indigo-500',
      features: ['Específico', 'Medible', 'Alcanzable']
    },
    {
      id: 'social-content',
      chatId: 9,
      name: 'Creador de Contenido en Redes Sociales',
      icon: Instagram,
      description: 'Genera contenido atractivo para redes sociales',
      gradient: 'from-pink-500 to-rose-500',
      features: ['Posts', 'Stories', 'Reels']
    }
  ];

  const engagementTools = [
    {
      id: 'challenges',
      chatId: 10,
      name: 'Creador de Retos y Competencias',
      icon: Gift,
      description: 'Diseña retos motivadores para tus clientes',
      gradient: 'from-yellow-500 to-orange-500',
      features: ['Gamificación', 'Premios', 'Seguimiento']
    },
    {
      id: 'progress-simulator',
      chatId: 11,
      name: 'Simulador de Escenarios de Avance',
      icon: TrendingUp,
      description: 'Visualiza diferentes escenarios de progreso',
      gradient: 'from-green-500 to-teal-500',
      features: ['Proyecciones', 'Variables', 'Análisis']
    },
    {
      id: 'home-equipment',
      chatId: 12,
      name: 'Orientador de Equipamiento Casero',
      icon: Home,
      description: 'Optimiza tu entrenamiento en casa',
      gradient: 'from-blue-500 to-purple-500',
      features: ['Recomendaciones', 'Alternativas', 'Presupuesto']
    }
  ];

  const specializedTools = [
    {
      id: 'office-breaks',
      chatId: 13,
      name: 'Diseño de Pausas Activas en la Oficina',
      icon: Briefcase,
      description: 'Ejercicios y rutinas para el trabajo',
      gradient: 'from-cyan-500 to-blue-500',
      features: ['Ejercicios cortos', 'Ergonomía', 'Productividad']
    },
    {
      id: 'personal-marketing',
      chatId: 14,
      name: 'Generador de Estrategias de Marketing Personal',
      icon: Users,
      description: 'Mejora tu presencia profesional',
      gradient: 'from-violet-500 to-purple-500',
      features: ['Branding', 'Redes', 'Posicionamiento']
    },
    {
      id: 'travel-training',
      chatId: 15,
      name: 'Chat de Entrenamiento para Viajeros',
      icon: Globe,
      description: 'Mantén tu rutina mientras viajas',
      gradient: 'from-amber-500 to-orange-500',
      features: ['Adaptabilidad', 'Equipamiento mínimo', 'Nutrición']
    }
  ];

  const groupTools = [
    {
      id: 'group-classes',
      chatId: 16,
      name: 'Gestor de Clases Grupales o Bootcamps',
      icon: Users,
      description: 'Organiza y gestiona sesiones grupales',
      gradient: 'from-pink-500 to-rose-500',
      features: ['Planificación', 'Niveles', 'Progresión']
    },
    {
      id: 'micro-habits',
      chatId: 17,
      name: 'Constructor de Micro-Hábitos Saludables',
      icon: Star,
      description: 'Desarrolla hábitos sostenibles',
      gradient: 'from-emerald-500 to-green-500',
      features: ['Paso a paso', 'Seguimiento', 'Recordatorios']
    },
    {
      id: 'audience-analyzer',
      chatId: 18,
      name: 'Audience Analyzer',
      icon: BarChart,
      description: 'Analiza y comprende tu audiencia',
      gradient: 'from-blue-500 to-indigo-500',
      features: ['Demografía', 'Intereses', 'Comportamiento']
    }
  ];

  const handleToolClick = (tool: Tool) => {
    console.log('ContentPublishingPage - handleToolClick llamado con tool:', tool);
    console.log('ContentPublishingPage - chatId del tool:', tool.chatId);
    
    if (tool.id === 'posts') {
      navigate('/ai-post-creator');
      return;
    }

    if (tool.id === 'stories') {
      navigate('/ai-story-creator');
      return;
    }
    
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
    <div className={christmasStyles.container}>
      {showSnow && snowflakes.map((snowflake, i) => (
        <div key={i} className={christmasStyles.snowflake} style={snowflake.style}>
          <Snowflake size={16} className={`${theme === 'dark' ? 'text-gray-300' : 'text-red-200'}`} />
        </div>
      ))}
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={christmasStyles.title}>
            <TreeDeciduous className="w-10 h-10 text-green-500" />
            <span className={`${christmasStyles.titleGradient} bg-clip-text text-transparent`}>
              Centro de Creación de Contenido
            </span>
            <Gift className="w-10 h-10 text-red-500" />
          </h1>
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setShowSnow(!showSnow)}
              className={`p-2 rounded-full ${
                theme === 'dark'
                  ? 'bg-gray-800 text-green-400 hover:bg-gray-700'
                  : 'bg-white text-red-500 hover:bg-red-50'
              } transition-colors duration-200`}
            >
              <Snowflake size={20} />
            </button>
          </div>
          <p className={`text-xl mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            🎄 Crea contenido mágico para estas fiestas 🎅
          </p>
        </motion.div>

        {/* Herramientas Principales */}
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold mb-8 flex items-center"
          >
            <Star className="w-8 h-8 mr-3 text-yellow-500 animate-pulse" />
            <span className={`${christmasStyles.titleGradient} bg-clip-text text-transparent`}>
              Creación de Contenido Navideño
            </span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainTools.map((tool) => (
              <motion.div
                key={tool.id}
                className={christmasStyles.toolCard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ToolCard 
                  key={tool.id}
                  tool={tool}
                  onClick={() => handleToolClick(tool)}
                  theme={theme}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Herramientas de Fitness */}
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold mb-8 flex items-center"
          >
            <Gift className="w-8 h-8 mr-3 text-red-500 animate-bounce" />
            <span className={`${christmasStyles.titleGradient} bg-clip-text text-transparent`}>
              Fitness y Entrenamiento
            </span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fitnessTools.map((tool) => (
              <motion.div
                key={tool.id}
                className={christmasStyles.toolCard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ToolCard 
                  key={tool.id}
                  tool={tool}
                  onClick={() => handleToolClick(tool)}
                  theme={theme}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Herramientas de Rendimiento */}
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold mb-8 flex items-center"
          >
            <TreeDeciduous className="w-8 h-8 mr-3 text-green-500 animate-pulse" />
            <span className={`${christmasStyles.titleGradient} bg-clip-text text-transparent`}>
              Rendimiento y Progreso
            </span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {performanceTools.map((tool) => (
              <motion.div
                key={tool.id}
                className={christmasStyles.toolCard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ToolCard 
                  key={tool.id}
                  tool={tool}
                  onClick={() => handleToolClick(tool)}
                  theme={theme}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Herramientas de Compromiso */}
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold mb-8 flex items-center"
          >
            <Gift className="w-8 h-8 mr-3 text-red-500 animate-bounce" />
            <span className={`${christmasStyles.titleGradient} bg-clip-text text-transparent`}>
              Compromiso y Participación
            </span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {engagementTools.map((tool) => (
              <motion.div
                key={tool.id}
                className={christmasStyles.toolCard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ToolCard 
                  key={tool.id}
                  tool={tool}
                  onClick={() => handleToolClick(tool)}
                  theme={theme}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Herramientas Especializadas */}
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold mb-8 flex items-center"
          >
            <TreeDeciduous className="w-8 h-8 mr-3 text-green-500 animate-pulse" />
            <span className={`${christmasStyles.titleGradient} bg-clip-text text-transparent`}>
              Herramientas Especializadas
            </span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specializedTools.map((tool) => (
              <motion.div
                key={tool.id}
                className={christmasStyles.toolCard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ToolCard 
                  key={tool.id}
                  tool={tool}
                  onClick={() => handleToolClick(tool)}
                  theme={theme}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Herramientas de Grupo */}
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold mb-8 flex items-center"
          >
            <Gift className="w-8 h-8 mr-3 text-red-500 animate-bounce" />
            <span className={`${christmasStyles.titleGradient} bg-clip-text text-transparent`}>
              Herramientas de Grupo
            </span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupTools.map((tool) => (
              <motion.div
                key={tool.id}
                className={christmasStyles.toolCard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ToolCard 
                  key={tool.id}
                  tool={tool}
                  onClick={() => handleToolClick(tool)}
                  theme={theme}
                />
              </motion.div>
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