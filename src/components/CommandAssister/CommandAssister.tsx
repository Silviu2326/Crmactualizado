import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Command, X, Sparkles, Wand2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import CommandShortcuts from './CommandShortcuts';
import CommandMessages from './CommandMessages';
import CommandAssistant from './CommandAssistant';
import { CommandModeSelector } from './CommandModeSelector';
import { commandOptions } from './commandOptions';

type Mode = 'shortcuts' | 'messages' | 'assistant';

const CommandAssister: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMode, setCurrentMode] = useState<Mode>('shortcuts');
  const [isWaitingForSecondKey, setIsWaitingForSecondKey] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const currentContext = location.pathname.split('/')[1] || 'dashboard';

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
    }, 400);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        handleClose();
        return;
      }

      // Handle 'f' key press
      if (e.key.toLowerCase() === 'f' && !isWaitingForSecondKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsWaitingForSecondKey(true);
        // Set a timeout to reset the waiting state after 2 seconds
        setTimeout(() => setIsWaitingForSecondKey(false), 2000);
        return;
      }

      // Handle second key press if waiting
      if (isWaitingForSecondKey) {
        const secondKey = e.key.toLowerCase();
        const matchingOption = commandOptions.find(
          option => option.shortcut && 
          option.shortcut[1].toLowerCase() === secondKey &&
          (!option.context || option.context.includes(currentContext))
        );

        if (matchingOption) {
          e.preventDefault();
          matchingOption.action(navigate);
          setIsWaitingForSecondKey(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isExpanded, isWaitingForSecondKey, navigate, currentContext]);

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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isWaitingForSecondKey && (
        <div className={`
          fixed top-4 right-4 px-4 py-2 rounded-lg
          ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'}
          text-white
          animate-fadeIn
          shadow-lg
        `}>
          Presione la segunda tecla del atajo...
        </div>
      )}
      {isExpanded ? (
        <div 
          className={`
            ${theme === 'dark' 
              ? 'bg-gray-900 border-gray-800' 
              : 'bg-white border-gray-200'
            } 
            relative
            rounded-3xl shadow-2xl w-96 h-[32rem] flex flex-col 
            transition-all duration-500 ease-out transform 
            border
            ${isClosing ? 'animate-slideDown' : 'animate-slideUp'}
            hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
            dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
            backdrop-filter backdrop-blur-sm
          `}
        >
          <div className={`
            p-6 border-b
            ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}
            relative
          `}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Wand2 className={`
                    w-5 h-5 
                    ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}
                    animate-pulse
                  `} />
                  <div className={`
                    absolute -inset-1 
                    bg-blue-500/20 
                    rounded-full 
                    blur-sm
                    animate-pulse
                  `} />
                </div>
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
                  Command Assister
                </h2>
              </div>
              <button
                onClick={handleClose}
                className={`
                  p-2.5 rounded-xl 
                  ${theme === 'dark' 
                    ? 'hover:bg-gray-800 active:bg-gray-700' 
                    : 'hover:bg-gray-100 active:bg-gray-200'
                  }
                  transition-all duration-300 
                  transform hover:scale-110 hover:rotate-90
                  active:scale-95
                  group
                `}
              >
                <X className={`
                  w-5 h-5
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                  group-hover:text-red-500
                  transition-colors duration-300
                `} />
              </button>
            </div>
            <CommandModeSelector 
              currentMode={currentMode} 
              setCurrentMode={setCurrentMode} 
            />
          </div>
          <div className="flex-1 overflow-hidden">
            {renderContent()}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className={`
            ${theme === 'dark' 
              ? 'bg-gray-900 hover:bg-gray-800 border-gray-800' 
              : 'bg-white hover:bg-gray-50 border-gray-200'
            }
            p-4 rounded-2xl
            shadow-lg hover:shadow-xl
            transition-all duration-300
            transform hover:scale-110 hover:rotate-12
            active:scale-95
            border
            group
            relative
          `}
        >
          <Command className={`
            w-6 h-6
            ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}
            transition-transform duration-300
            group-hover:rotate-180
          `} />
          <div className={`
            absolute -inset-0.5
            bg-gradient-to-r from-blue-500 to-violet-500 
            rounded-2xl
            opacity-0 group-hover:opacity-20
            transition-opacity duration-300
            blur-sm
          `} />
        </button>
      )}
    </div>
  );
};

export default CommandAssister;