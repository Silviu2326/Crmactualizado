import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Image as ImageIcon, MessageSquare, X, Mic, Share2, 
  TrendingUp, Target, Users, Globe, Instagram, Facebook,
  Video, Wand2, Zap, Brain, Rocket, BarChart, Mail, Search,
  Home, Briefcase, Layout, Settings, Activity, LineChart,
  Calendar, BarChart2, Trophy, Book, Layers, UserPlus
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

  const styles = {
    container: `min-h-screen p-8 relative ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-gray-900 via-blue-900/10 to-gray-900 text-white' 
        : 'bg-gradient-to-b from-blue-50 via-indigo-50/30 to-blue-50 text-gray-800'
    }`,
    title: 'text-5xl font-bold mb-4 flex items-center justify-center gap-4',
    titleGradient: theme === 'dark'
      ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400'
      : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600',
    toolCard: `transform transition-all duration-300 hover:scale-105 ${
      theme === 'dark' 
        ? 'hover:shadow-lg hover:shadow-blue-500/20' 
        : 'hover:shadow-lg hover:shadow-indigo-500/20'
    }`
  };

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
      icon: Activity,
      description: 'Optimiza tus hábitos diarios para mejor rendimiento',
      gradient: 'from-teal-500 to-cyan-500',
      features: ['Rutinas diarias', 'Nutrición', 'Descanso']
    }
  ];

  const performanceTools: Tool[] = [
    {
      id: 'plateau-strategies',
      name: 'Planificador de Estrategias para Superar Estancamientos',
      icon: LineChart,
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
      name: 'Creador de Contenido Social',
      icon: Layout,
      description: 'Genera contenido atractivo para redes sociales',
      gradient: 'from-pink-500 to-rose-500',
      features: ['Plantillas', 'Programación', 'Analytics']
    }
  ];

  const engagementTools: Tool[] = [
    {
      id: 'challenges',
      name: 'Creador de Retos y Competencias',
      icon: Trophy,
      description: 'Diseña retos motivadores para tus clientes',
      gradient: 'from-yellow-500 to-orange-500',
      features: ['Gamificación', 'Premios', 'Seguimiento']
    },
    {
      id: 'progress-simulator',
      name: 'Simulador de Escenarios de Avance',
      icon: BarChart2,
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
      icon: Calendar,
      description: 'Ejercicios y rutinas para el trabajo',
      gradient: 'from-cyan-500 to-blue-500',
      features: ['Ejercicios cortos', 'Ergonomía', 'Productividad']
    },
    {
      id: 'personal-marketing',
      name: 'Generador de Estrategias de Marketing Personal',
      icon: UserPlus,
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
      icon: Layers,
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

  const handleToolClick = (toolId: string) => {
    setSelectedTool(toolId);
    switch (toolId) {
      case 'content-strategy':
        setIsContentStrategyOpen(true);
        break;
      case 'audience':
        setIsAudienceAnalyzerOpen(true);
        break;
      case 'express-plans':
        setIsExpressPlansOpen(true);
        break;
      case 'injury-diagnosis':
        setIsInjuryDiagnosisOpen(true);
        break;
      case 'lifestyle-guide':
        setIsLifestyleGuideOpen(true);
        break;
      case 'plateau-strategies':
        setIsPlateauStrategiesOpen(true);
        break;
      case 'smart-goals':
        setIsSmartGoalsOpen(true);
        break;
      case 'social-content':
        setIsSocialContentOpen(true);
        break;
      default:
        setIsModalOpen(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className="max-w-7xl mx-auto">
        <div className={styles.title}>
          <BarChart className="h-12 w-12 text-blue-600" />
          <h1 className={`bg-clip-text text-transparent ${styles.titleGradient}`}>
            Centro de Contenido
          </h1>
          <BarChart className="h-12 w-12 text-blue-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {mainTools.map((tool) => (
            <motion.div
              key={tool.id}
              className={styles.toolCard}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ToolCard
                tool={tool}
                onClick={() => handleToolClick(tool.id)}
              />
            </motion.div>
          ))}
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6">Herramientas de Fitness</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fitnessTools.map((tool) => (
            <motion.div
              key={tool.id}
              className={styles.toolCard}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ToolCard
                tool={tool}
                onClick={() => handleToolClick(tool.id)}
              />
            </motion.div>
          ))}
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6">Herramientas de Rendimiento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {performanceTools.map((tool) => (
            <motion.div
              key={tool.id}
              className={styles.toolCard}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ToolCard
                tool={tool}
                onClick={() => handleToolClick(tool.id)}
              />
            </motion.div>
          ))}
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6">Herramientas de Compromiso</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {engagementTools.map((tool) => (
            <motion.div
              key={tool.id}
              className={styles.toolCard}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ToolCard
                tool={tool}
                onClick={() => handleToolClick(tool.id)}
              />
            </motion.div>
          ))}
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6">Herramientas Especializadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specializedTools.map((tool) => (
            <motion.div
              key={tool.id}
              className={styles.toolCard}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ToolCard
                tool={tool}
                onClick={() => handleToolClick(tool.id)}
              />
            </motion.div>
          ))}
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6">Herramientas de Grupo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupTools.map((tool) => (
            <motion.div
              key={tool.id}
              className={styles.toolCard}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ToolCard
                tool={tool}
                onClick={() => handleToolClick(tool.id)}
              />
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {isContentStrategyOpen && (
            <ContentStrategy onClose={() => setIsContentStrategyOpen(false)} />
          )}
          {isAudienceAnalyzerOpen && (
            <AudienceAnalyzer onClose={() => setIsAudienceAnalyzerOpen(false)} />
          )}
          {isExpressPlansOpen && (
            <ExpressPlansGenerator onClose={() => setIsExpressPlansOpen(false)} />
          )}
          {isInjuryDiagnosisOpen && (
            <InjuryDiagnosisAnalyzer onClose={() => setIsInjuryDiagnosisOpen(false)} />
          )}
          {isLifestyleGuideOpen && (
            <LifestyleGuideAnalyzer onClose={() => setIsLifestyleGuideOpen(false)} />
          )}
          {isPlateauStrategiesOpen && (
            <PlateauStrategiesPlanner onClose={() => setIsPlateauStrategiesOpen(false)} />
          )}
          {isSmartGoalsOpen && (
            <SmartGoalsBuilder onClose={() => setIsSmartGoalsOpen(false)} />
          )}
          {isSocialContentOpen && (
            <SocialContentCreator onClose={() => setIsSocialContentOpen(false)} />
          )}
        </AnimatePresence>

        {showChat && (
          <AIChat onClose={() => setShowChat(false)} />
        )}
      </div>
    </div>
  );
};

export default ContentPublishingPage;