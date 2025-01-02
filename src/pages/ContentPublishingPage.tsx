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
import ContentStrategy from '../components/ContentStrategy/ContentStrategy';
import AudienceAnalyzer from '../components/AudienceAnalyzer/AudienceAnalyzer';
import ExpressPlansGenerator from '../components/ExpressPlans/ExpressPlansGenerator';
import InjuryDiagnosisAnalyzer from '../components/InjuryDiagnosis/InjuryDiagnosisAnalyzer';
import LifestyleGuideAnalyzer from '../components/LifestyleGuide/LifestyleGuideAnalyzer';
import PlateauStrategiesPlanner from '../components/PlateauStrategies/PlateauStrategiesPlanner';
import SmartGoalsBuilder from '../components/SmartGoals/SmartGoalsBuilder';
import SocialContentCreator from '../components/SocialContent/SocialContentCreator';
import ChallengesCreator from '../components/Challenges/ChallengesCreator';
import ProgressSimulator from '../components/ProgressSimulator/ProgressSimulator';
import HomeEquipmentAdvisor from '../components/HomeEquipment/HomeEquipmentAdvisor';
import OfficeBreaksDesigner from '../components/OfficeBreaks/OfficeBreaksDesigner';
import PersonalMarketingGenerator from '../components/PersonalMarketing/PersonalMarketingGenerator';
import TravelTrainingChat from '../components/TravelTraining/TravelTrainingChat';
import GroupClassesManager from '../components/GroupClasses/GroupClassesManager';
import MicroHabitsBuilder from '../components/MicroHabits/MicroHabitsBuilder';
import { chatService } from '../services/chatService';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  features: string[];
}

const ContentPublishingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContentStrategyOpen, setIsContentStrategyOpen] = useState(false);
  const [isAudienceAnalyzerOpen, setIsAudienceAnalyzerOpen] = useState(false);
  const [isExpressPlansOpen, setIsExpressPlansOpen] = useState(false);
  const [isInjuryDiagnosisOpen, setIsInjuryDiagnosisOpen] = useState(false);
  const [isLifestyleGuideOpen, setIsLifestyleGuideOpen] = useState(false);
  const [isPlateauStrategiesOpen, setIsPlateauStrategiesOpen] = useState(false);
  const [isSmartGoalsOpen, setIsSmartGoalsOpen] = useState(false);
  const [isSocialContentOpen, setIsSocialContentOpen] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showProgressSimulator, setShowProgressSimulator] = useState(false);
  const [showHomeEquipment, setShowHomeEquipment] = useState(false);
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

  const mainTools: Tool[] = [
    { 
      id: 'posts', 
      name: 'Generador de publicaciones con IA', 
      icon: Sparkles,
      description: 'Genera posts virales para tus redes sociales con IA avanzada',
      gradient: 'from-purple-500 to-pink-500',
      features: [
        'Genera posts optimizados para cada red social',
        'Incluye hashtags relevantes',
        'Optimiza el engagement'
      ]
    },
    {
      id: 'content-strategy',
      name: 'Content Strategy',
      icon: Brain,
      description: 'Desarrolla estrategias efectivas de contenido',
      gradient: 'from-violet-500 to-purple-500',
      features: [
        'Planificación',
        'Calendario editorial',
        'Optimización'
      ]
    },
    {
      id: 'audience',
      name: 'Analizador de Audiencia',
      icon: Users,
      description: 'Comprende y analiza tu audiencia para mejorar tu contenido',
      gradient: 'from-blue-500 to-cyan-500',
      features: [
        'Análisis demográfico detallado',
        'Intereses y comportamiento',
        'Recomendaciones personalizadas'
      ]
    },
    { 
      id: 'stories', 
      name: 'Generador de HISTORIAS CON IA', 
      icon: ImageIcon,
      description: 'Diseña historias cautivadoras que conecten con tu audiencia',
      gradient: 'from-blue-500 to-cyan-500',
      features: ['Plantillas dinámicas', 'Efectos visuales', 'Programación automática']
    }
  ];

  const fitnessTools: Tool[] = [
    {
      id: 'express-plans',
      name: 'Generador de Planes Exprés',
      icon: Zap,
      description: 'Crea planes de entrenamiento rápidos y efectivos',
      gradient: 'from-green-500 to-emerald-500',
      features: ['Personalización', 'Objetivos específicos', 'Rutinas rápidas']
    },
    {
      id: 'injury-diagnosis',
      name: 'Diagnóstico de Lesiones y Adaptaciones',
      icon: Target,
      description: 'Analiza y adapta entrenamientos según lesiones',
      gradient: 'from-red-500 to-orange-500',
      features: ['Evaluación', 'Recomendaciones', 'Ejercicios alternativos']
    },
    {
      id: 'lifestyle-guide',
      name: 'Guía de Estilo de Vida y Hábitos Diarios',
      icon: TreeDeciduous,
      description: 'Optimiza tus hábitos diarios para mejor rendimiento',
      gradient: 'from-teal-500 to-cyan-500',
      features: ['Rutinas diarias', 'Nutrición', 'Descanso']
    }
  ];

  const performanceTools: Tool[] = [
    {
      id: 'plateau-strategies',
      name: 'Planificador de Estrategias para Superar Estancamientos',
      icon: Rocket,
      description: 'Supera mesetas en tu rendimiento',
      gradient: 'from-indigo-500 to-blue-500',
      features: ['Análisis', 'Soluciones', 'Seguimiento']
    },
    {
      id: 'smart-goals',
      name: 'Constructor de Metas SMART',
      icon: Target,
      description: 'Define objetivos específicos y alcanzables',
      gradient: 'from-purple-500 to-indigo-500',
      features: ['Específico', 'Medible', 'Alcanzable']
    },
    {
      id: 'social-content',
      name: 'Creador de Contenido en Redes Sociales',
      icon: Instagram,
      description: 'Genera contenido atractivo para redes sociales',
      gradient: 'from-pink-500 to-rose-500',
      features: ['Posts', 'Stories', 'Reels']
    }
  ];

  const engagementTools: Tool[] = [
    {
      id: 'challenges',
      name: 'Creador de Retos y Competencias',
      icon: Gift,
      description: 'Diseña retos motivadores para tus clientes',
      gradient: 'from-yellow-500 to-orange-500',
      features: ['Gamificación', 'Premios', 'Seguimiento']
    },
    {
      id: 'progress-simulator',
      name: 'Simulador de Escenarios de Avance',
      icon: TrendingUp,
      description: 'Visualiza diferentes escenarios de progreso',
      gradient: 'from-green-500 to-teal-500',
      features: ['Proyecciones', 'Variables', 'Análisis']
    },
    {
      id: 'home-equipment',
      name: 'Orientador de Equipamiento Casero',
      icon: Home,
      description: 'Optimiza tu entrenamiento en casa',
      gradient: 'from-blue-500 to-purple-500',
      features: ['Recomendaciones', 'Alternativas', 'Presupuesto']
    }
  ];

  const specializedTools: Tool[] = [
    {
      id: 'office-breaks',
      name: 'Diseño de Pausas Activas en la Oficina',
      icon: Briefcase,
      description: 'Ejercicios y rutinas para el trabajo',
      gradient: 'from-cyan-500 to-blue-500',
      features: ['Ejercicios cortos', 'Ergonomía', 'Productividad']
    },
    {
      id: 'personal-marketing',
      name: 'Generador de Estrategias de Marketing Personal',
      icon: Users,
      description: 'Mejora tu presencia profesional',
      gradient: 'from-violet-500 to-purple-500',
      features: ['Branding', 'Redes', 'Posicionamiento']
    },
    {
      id: 'travel-training',
      name: 'Chat de Entrenamiento para Viajeros',
      icon: Globe,
      description: 'Mantén tu rutina mientras viajas',
      gradient: 'from-amber-500 to-orange-500',
      features: ['Adaptabilidad', 'Equipamiento mínimo', 'Nutrición']
    }
  ];

  const groupTools: Tool[] = [
    {
      id: 'group-classes',
      name: 'Gestor de Clases Grupales o Bootcamps',
      icon: Users,
      description: 'Organiza y gestiona sesiones grupales',
      gradient: 'from-pink-500 to-rose-500',
      features: ['Planificación', 'Niveles', 'Progresión']
    },
    {
      id: 'micro-habits',
      name: 'Constructor de Micro-Hábitos Saludables',
      icon: Star,
      description: 'Desarrolla hábitos sostenibles',
      gradient: 'from-emerald-500 to-green-500',
      features: ['Paso a paso', 'Seguimiento', 'Recordatorios']
    },
    {
      id: 'audience-analyzer',
      name: 'Audience Analyzer',
      icon: BarChart,
      description: 'Analiza y comprende tu audiencia',
      gradient: 'from-blue-500 to-indigo-500',
      features: ['Demografía', 'Intereses', 'Comportamiento']
    }
  ];

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool.id);
    if (tool.id === 'challenges') {
      setShowChallenges(true);
    } else if (tool.id === 'progress-simulator') {
      setShowProgressSimulator(true);
    } else if (tool.id === 'home-equipment') {
      setShowHomeEquipment(true);
    } else if (tool.id === 'plateau-strategies') {
      setIsPlateauStrategiesOpen(true);
    } else if (tool.id === 'smart-goals') {
      setIsSmartGoalsOpen(true);
    } else if (tool.id === 'social-content') {
      setIsSocialContentOpen(true);
    } else if (tool.id === 'express-plans') {
      setIsExpressPlansOpen(true);
    } else if (tool.id === 'injury-diagnosis') {
      setIsInjuryDiagnosisOpen(true);
    } else if (tool.id === 'lifestyle-guide') {
      setIsLifestyleGuideOpen(true);
    }
  };

  const handleCloseTools = () => {
    setSelectedTool(null);
    setShowChallenges(false);
    setShowProgressSimulator(false);
    setShowHomeEquipment(false);
    setIsPlateauStrategiesOpen(false);
    setIsSmartGoalsOpen(false);
    setIsSocialContentOpen(false);
    setIsExpressPlansOpen(false);
    setIsInjuryDiagnosisOpen(false);
    setIsLifestyleGuideOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTool(null);
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedTool) {
      console.error('ContentPublishingPage - No hay herramienta seleccionada');
      return;
    }

    try {
      const response = await chatService.sendMessage(selectedTool, message);
      console.log('ContentPublishingPage - Respuesta del servidor:', response);
      return response;
    } catch (error) {
      console.error('ContentPublishingPage - Error al enviar mensaje:', error);
      throw error;
    }
  };

  const handleContentStrategyClick = () => {
    setIsContentStrategyOpen(true);
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

        {/* Herramienta de Estrategia de Contenido */}
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold mb-8 flex items-center"
          >
            <Target className="w-8 h-8 mr-3 text-blue-500 animate-pulse" />
            <span className={`${christmasStyles.titleGradient} bg-clip-text text-transparent`}>
              Estrategia de Contenido
            </span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              className={christmasStyles.toolCard}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-white hover:bg-gray-50'
                } shadow-md hover:shadow-lg`}
                onClick={handleContentStrategyClick}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'
                  }`}>
                    <Target className={`w-6 h-6 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-medium">Audience Analyzer</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Analiza tu audiencia y planifica tu contenido
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Componentes de herramientas */}
        <OfficeBreaksDesigner 
          isVisible={selectedTool === 'office-breaks'} 
          onClose={handleCloseTools} 
        />
        <PersonalMarketingGenerator 
          isVisible={selectedTool === 'personal-marketing'} 
          onClose={handleCloseTools} 
        />
        <TravelTrainingChat 
          isVisible={selectedTool === 'travel-training'} 
          onClose={handleCloseTools} 
        />
        <GroupClassesManager 
          isVisible={selectedTool === 'group-classes'} 
          onClose={handleCloseTools} 
        />
        <MicroHabitsBuilder 
          isVisible={selectedTool === 'micro-habits'} 
          onClose={handleCloseTools} 
        />
        <ChallengesCreator 
          isVisible={showChallenges} 
          onClose={handleCloseTools} 
        />
        <ProgressSimulator 
          isVisible={showProgressSimulator} 
          onClose={handleCloseTools} 
        />
        <HomeEquipmentAdvisor 
          isVisible={showHomeEquipment} 
          onClose={handleCloseTools} 
        />
        <PlateauStrategiesPlanner 
          isVisible={isPlateauStrategiesOpen} 
          onClose={() => setIsPlateauStrategiesOpen(false)} 
        />
        <SmartGoalsBuilder 
          isVisible={isSmartGoalsOpen} 
          onClose={() => setIsSmartGoalsOpen(false)} 
        />
        <SocialContentCreator 
          isVisible={isSocialContentOpen} 
          onClose={() => setIsSocialContentOpen(false)} 
        />
        <ExpressPlansGenerator 
          isVisible={isExpressPlansOpen} 
          onClose={() => setIsExpressPlansOpen(false)} 
        />
        <InjuryDiagnosisAnalyzer 
          isVisible={isInjuryDiagnosisOpen} 
          onClose={() => setIsInjuryDiagnosisOpen(false)} 
        />
        <LifestyleGuideAnalyzer 
          isVisible={isLifestyleGuideOpen} 
          onClose={() => setIsLifestyleGuideOpen(false)} 
        />

        {/* Chat Modal */}
        <AnimatePresence>
          {isModalOpen && selectedTool && (
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
                  theme={theme}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Strategy Modal */}
        <AnimatePresence>
          {isContentStrategyOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            >
              <div className={`relative w-full max-w-4xl h-[80vh] rounded-2xl shadow-xl overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <ContentStrategy 
                  onClose={() => setIsContentStrategyOpen(false)} 
                  isVisible={isContentStrategyOpen}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Audience Analyzer Modal */}
        <AnimatePresence>
          {isAudienceAnalyzerOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            >
              <div className={`relative w-full max-w-4xl h-[80vh] rounded-2xl shadow-xl overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <AudienceAnalyzer onClose={() => setIsAudienceAnalyzerOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Express Plans Modal */}
        <AnimatePresence>
          {isExpressPlansOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            >
              <div className={`relative w-full max-w-4xl h-[80vh] rounded-2xl shadow-xl overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <ExpressPlansGenerator 
                  onClose={() => setIsExpressPlansOpen(false)} 
                  isVisible={isExpressPlansOpen}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Injury Diagnosis Modal */}
        <AnimatePresence>
          {isInjuryDiagnosisOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            >
              <div className={`relative w-full max-w-6xl h-[90vh] rounded-2xl shadow-xl overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <InjuryDiagnosisAnalyzer 
                  onClose={() => setIsInjuryDiagnosisOpen(false)} 
                  isVisible={isInjuryDiagnosisOpen}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lifestyle Guide Modal */}
        <AnimatePresence>
          {isLifestyleGuideOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            >
              <div className={`relative w-full max-w-6xl h-[90vh] rounded-2xl shadow-xl overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <LifestyleGuideAnalyzer 
                  onClose={() => setIsLifestyleGuideOpen(false)} 
                  isVisible={isLifestyleGuideOpen}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plateau Strategies Modal */}
        <AnimatePresence>
          {isPlateauStrategiesOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            >
              <div className={`relative w-full max-w-6xl h-[90vh] rounded-2xl shadow-xl overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <PlateauStrategiesPlanner 
                  onClose={() => setIsPlateauStrategiesOpen(false)} 
                  isVisible={isPlateauStrategiesOpen}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Smart Goals Modal */}
        <AnimatePresence>
          {isSmartGoalsOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            >
              <div className={`relative w-full max-w-6xl h-[90vh] rounded-2xl shadow-xl overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <SmartGoalsBuilder 
                  onClose={() => setIsSmartGoalsOpen(false)} 
                  isVisible={isSmartGoalsOpen}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Social Content Modal */}
        <AnimatePresence>
          {isSocialContentOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            >
              <div className={`relative w-full max-w-6xl h-[90vh] rounded-2xl shadow-xl overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <SocialContentCreator 
                  onClose={() => setIsSocialContentOpen(false)} 
                  isVisible={isSocialContentOpen}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showChat && (
          <AIChat
            isOpen={showChat}
            onClose={() => {
              setShowChat(false);
              setIsModalOpen(false);
            }}
            tool={selectedTool}
          />
        )}
      </div>
    </div>
  );
};

export default ContentPublishingPage;