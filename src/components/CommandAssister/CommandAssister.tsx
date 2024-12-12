import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Command, X, Wand2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import CommandShortcuts from './CommandShortcuts';
import CommandMessages from './CommandMessages';
import CommandAssistant from './CommandAssistant';
import { CommandModeSelector } from './CommandModeSelector';
import { motion, AnimatePresence } from 'framer-motion';

type Mode = 'shortcuts' | 'messages' | 'assistant';

interface CommandAssisterProps {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

const CommandAssister: React.FC<CommandAssisterProps> = ({
  isExpanded,
  setIsExpanded,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMode, setCurrentMode] = useState<Mode>('shortcuts');
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const currentContext = location.pathname.split('/')[1] || 'dashboard';

  // Determinar si estamos en la ruta "/edit-planning/:id"
  const isOnEditPlanningPage = location.pathname.startsWith('/edit-planning/');

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
      // Reiniciar el modo al valor por defecto cuando se cierra
      setCurrentMode('shortcuts');
    }, 400);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isExpanded]);

  // Efecto para cambiar el modo al abrirse según la ruta
  useEffect(() => {
    if (isExpanded) {
      if (isOnEditPlanningPage) {
        setCurrentMode('messages');
      } else {
        setCurrentMode('shortcuts');
      }
    }
  }, [isExpanded, isOnEditPlanningPage]);

  const renderContent = () => {
    switch (currentMode) {
      case 'shortcuts':
        return (
          <CommandShortcuts
            searchTerm={searchTerm}
            currentContext={currentContext}
            navigate={navigate}
          />
        );
      case 'messages':
        return <CommandMessages />;
      case 'assistant':
        return <CommandAssistant currentContext={currentContext} />;
      default:
        return null;
    }
  };

  // Clases de posición para el botón y el asistente
  const buttonPositionClasses = 'fixed bottom-5 right-4 z-50';
  const assistantPositionClasses = isExpanded
    ? isOnEditPlanningPage
      ? 'fixed inset-0 left-0 z-50 h-screen w-1/3 border-r'
      : 'fixed bottom-4 right-4 w-[400px] h-[500px] z-50'
    : '';

  return (
    <>
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className={`${buttonPositionClasses} ${
            theme === 'dark'
              ? 'bg-gray-800 hover:bg-gray-700'
              : 'bg-white hover:bg-gray-100'
          } p-3 rounded-full shadow-lg transition-all duration-200`}
        >
          <Command className="w-6 h-6" />
        </button>
      )}
      {isExpanded && (
        <div className={`${assistantPositionClasses}`}>
          <AnimatePresence>
            <motion.div
              key="assistant"
              initial={{
                opacity: 0,
                x: isOnEditPlanningPage ? -50 : 0,
                y: isOnEditPlanningPage ? 0 : 50,
              }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{
                opacity: 0,
                x: isOnEditPlanningPage ? -50 : 0,
                y: isOnEditPlanningPage ? 0 : 50,
              }}
              transition={{ duration: 0.5 }}
              className={`${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              } relative ${
                isOnEditPlanningPage ? '' : 'rounded-3xl'
              } shadow-2xl flex flex-col transition-all duration-500 ease-out transform border ${
                isClosing ? 'animate-slideDown' : 'animate-slideUp'
              } hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] backdrop-filter backdrop-blur-sm ${
                isOnEditPlanningPage ? 'w-full h-full' : 'w-96 h-[32rem]'
              } overflow-hidden`}
            >
              {/* Contenido del Command Assister */}
              <div
                className={`p-6 border-b ${
                  theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                } relative flex-shrink-0`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Wand2
                        className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                        } animate-pulse`}
                      />
                      <div
                        className={`absolute -inset-1 bg-blue-500/20 rounded-full blur-sm animate-pulse`}
                      />
                    </div>
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
                      Command Assister
                    </h2>
                  </div>
                  <button
                    onClick={handleClose}
                    className={`p-2.5 rounded-xl ${
                      theme === 'dark'
                        ? 'hover:bg-gray-800 active:bg-gray-700'
                        : 'hover:bg-gray-100 active:bg-gray-200'
                    } transition-all duration-300 transform hover:scale-110 hover:rotate-90 active:scale-95 group`}
                    aria-label="Cerrar Command Assister"
                  >
                    <X
                      className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      } group-hover:text-red-500 transition-colors duration-300`}
                    />
                  </button>
                </div>
                <CommandModeSelector
                  currentMode={currentMode}
                  setCurrentMode={setCurrentMode}
                />
              </div>
              {/* Ajustes para evitar scroll y ocupar todo el alto */}
              <div
                className={`flex-1 ${
                  isOnEditPlanningPage ? 'overflow-hidden' : 'overflow-auto'
                } p-4`}
              >
                {renderContent()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default CommandAssister;
