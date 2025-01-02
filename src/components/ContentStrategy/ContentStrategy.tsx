import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertCircle } from 'lucide-react';
import '../../styles/scrollbar.css';

interface ContentStrategyProps {
  onClose: () => void;
  isVisible: boolean;
}

interface Step {
  id: number;
  question: string;
  options: string[];
  answer: string[];
  multiSelect: boolean;
  required: boolean;
}

interface StatusMessage {
  type: 'success' | 'error' | null;
  message: string;
}

const initialSteps: Step[] = [
  {
    id: 1,
    question: "¿Cuál es el principal objetivo de tu estrategia de contenidos?",
    options: [
      "Aumentar la visibilidad de mi marca",
      "Generar leads y captar nuevos clientes",
      "Retener y fidelizar a mis clientes actuales",
      "Educar a mi audiencia sobre fitness y bienestar"
    ],
    answer: [],
    multiSelect: false,
    required: true
  },
  {
    id: 2,
    question: "¿Qué tipos de contenido prefieres crear?",
    options: [
      "Artículos de blog",
      "Videos instructivos",
      "Infografías",
      "Publicaciones en redes sociales",
      "Testimonios de clientes"
    ],
    answer: [],
    multiSelect: true,
    required: true
  },
  {
    id: 3,
    question: "¿Con qué frecuencia planeas publicar contenido?",
    options: [
      "Diariamente",
      "Varias veces a la semana",
      "Semanalmente",
      "Mensualmente"
    ],
    answer: [],
    multiSelect: false,
    required: true
  },
  {
    id: 4,
    question: "¿Qué plataformas de distribución utilizas principalmente?",
    options: [
      "Instagram",
      "YouTube",
      "Facebook",
      "Blog propio",
      "Email marketing"
    ],
    answer: [],
    multiSelect: true,
    required: true
  }
];

export const ContentStrategy: React.FC<ContentStrategyProps> = ({ onClose, isVisible }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [stepsData, setStepsData] = useState<Step[]>(initialSteps);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [showQuestionnaire, setShowQuestionnaire] = useState(true);
  const [statusMessage, setStatusMessage] = useState<StatusMessage>({ type: null, message: '' });

  const generateContentStrategy = async () => {
    setIsLoading(true);
    setStatusMessage({ type: null, message: '' });
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const payload = {
        timestamp: new Date().toISOString(),
        contentStrategy: {
          objective: stepsData[0].answer,
          contentTypes: stepsData[1].answer,
          frequency: stepsData[2].answer,
          platforms: stepsData[3].answer
        },
        status: "completed",
        version: "1.0"
      };

      const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/chat/content-strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error al generar el plan de contenido');
      }

      const data = await response.json();
      console.log('Respuesta:', data);

      if (data.status === 'completed' && data.contentPlan) {
        setGeneratedContent(data.contentPlan);
        setShowQuestionnaire(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage({
        type: 'error',
        message: 'Hubo un error al generar el plan. Por favor, intenta de nuevo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === stepsData.length - 1) {
      generateContentStrategy();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (!showQuestionnaire) {
      setShowQuestionnaire(true);
      return;
    }
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleOptionSelect = (option: string) => {
    const currentStepData = stepsData[currentStep];
    let newAnswer: string[];

    if (currentStepData.multiSelect) {
      newAnswer = currentStepData.answer.includes(option)
        ? currentStepData.answer.filter(a => a !== option)
        : [...currentStepData.answer, option];
    } else {
      newAnswer = [option];
    }

    const updatedSteps = stepsData.map((step, index) =>
      index === currentStep ? { ...step, answer: newAnswer } : step
    );
    setStepsData(updatedSteps);

    if (!currentStepData.multiSelect) {
      setTimeout(() => {
        if (currentStep === stepsData.length - 1) {
          generateContentStrategy();
        } else {
          setCurrentStep(prev => prev + 1);
        }
      }, 300);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Mensaje de estado */}
        {statusMessage.type && (
          <div className={`mb-4 p-4 rounded-lg flex items-center ${
            statusMessage.type === 'success' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
          }`}>
            {statusMessage.type === 'success' ? (
              <Check className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {statusMessage.message}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : showQuestionnaire ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Estrategia de Contenido
              </h2>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / stepsData.length) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Paso {currentStep + 1} de {stepsData.length}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {stepsData[currentStep].question}
              </h3>
              <div className="space-y-2">
                {stepsData[currentStep].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      stepsData[currentStep].answer.includes(option)
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Anterior
              </button>
              {stepsData[currentStep].multiSelect && (
                <button
                  onClick={handleNext}
                  className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {currentStep === stepsData.length - 1 ? 'Generar Plan' : 'Siguiente'}
                  <Check className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Plan de Contenidos para Entrenador Personal</h2>
              <p className="text-blue-100">Tu estrategia personalizada de marketing digital</p>
            </div>
            <div className="mt-4 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
              <div className="space-y-6">
                {generatedContent.split('###').map((section, index) => {
                  if (!section.trim()) return null;
                  
                  const [title, ...content] = section.split('\n');
                  const isMainSection = title.startsWith('##');
                  const isSubSection = title.startsWith('## ');
                  
                  return (
                    <div key={index} className={`rounded-lg p-6 shadow-sm transition-all duration-300 hover:shadow-md ${
                      isMainSection 
                        ? 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800'
                        : 'bg-white dark:bg-gray-700'
                    }`}>
                      <h3 className={`font-semibold mb-4 flex items-center ${
                        isSubSection 
                          ? 'text-lg text-gray-700 dark:text-gray-300' 
                          : isMainSection 
                            ? 'text-xl text-blue-600 dark:text-blue-400' 
                            : 'text-lg text-gray-900 dark:text-white'
                      }`}>
                        {title.trim().replace(/^#+\s*/, '')}
                      </h3>
                      <div className="space-y-3">
                        {content.map((line, lineIndex) => {
                          const trimmedLine = line.trim();
                          if (!trimmedLine) return null;
                          
                          if (trimmedLine.startsWith('####')) {
                            return (
                              <h4 key={lineIndex} className="text-md font-medium text-blue-500 dark:text-blue-300 mt-6 mb-3 border-b border-blue-100 dark:border-blue-800 pb-2">
                                {trimmedLine.replace(/^####\s*/, '')}
                              </h4>
                            );
                          }
                          
                          if (trimmedLine.startsWith('-')) {
                            const textContent = trimmedLine.replace(/^-\s*/, '');
                            const formattedText = textContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                            
                            return (
                              <div key={lineIndex} className="flex items-start group hover:bg-gray-50 dark:hover:bg-gray-600 p-2 rounded-lg transition-colors">
                                <span className="text-blue-500 mr-3 group-hover:scale-110 transition-transform">•</span>
                                <p 
                                  className="text-gray-600 dark:text-gray-300"
                                  dangerouslySetInnerHTML={{ 
                                    __html: formattedText 
                                  }}
                                />
                              </div>
                            );
                          }
                          
                          if (trimmedLine.match(/^\d+\./)) {
                            const [num, ...textParts] = trimmedLine.split('.');
                            const textContent = textParts.join('.').trim();
                            const formattedText = textContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                            
                            return (
                              <div key={lineIndex} className="flex items-start group hover:bg-gray-50 dark:hover:bg-gray-600 p-2 rounded-lg transition-colors">
                                <span className="text-blue-500 font-medium mr-3 w-6 text-center group-hover:scale-110 transition-transform">
                                  {num}.
                                </span>
                                <p 
                                  className="text-gray-600 dark:text-gray-300"
                                  dangerouslySetInnerHTML={{ 
                                    __html: formattedText 
                                  }}
                                />
                              </div>
                            );
                          }
                          
                          const formattedText = trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                          return (
                            <p 
                              key={lineIndex} 
                              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                              dangerouslySetInnerHTML={{ 
                                __html: formattedText 
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-6 flex justify-between sticky bottom-0 bg-white dark:bg-gray-800 pt-4 border-t dark:border-gray-700">
              <button
                onClick={handleBack}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cerrar</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentStrategy;
