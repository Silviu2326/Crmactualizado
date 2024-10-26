import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Send, Bot, User, Loader, Sparkles, Image as ImageIcon, Wand2 } from 'lucide-react';
import Button from '../Common/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  toolId: string;
}

const AIChat: React.FC<AIChatProps> = ({ toolId }) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isThinking, setIsThinking] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initialMessage = {
      id: '1',
      type: 'bot' as const,
      content: `¡Hola! 👋 Soy tu asistente de IA para ${getToolName(toolId)}. ¿En qué puedo ayudarte hoy?`,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, [toolId]);

  const getToolName = (id: string) => {
    const toolNames: { [key: string]: string } = {
      posts: 'Creación de Posts',
      stories: 'Creación de Historias',
      'image-gen': 'Generación de Imágenes',
      audience: 'Análisis de Audiencia',
      trends: 'Detección de Tendencias',
      competitor: 'Análisis de Competencia',
      instagram: 'Gestión de Instagram',
      facebook: 'Gestión de Facebook',
      global: 'Publicación Global'
    };
    return toolNames[id] || id;
  };

  const getToolIcon = () => {
    const icons = {
      posts: Sparkles,
      stories: ImageIcon,
      'image-gen': ImageIcon,
      audience: User,
      trends: Wand2,
    };
    return icons[toolId] || Sparkles;
  };

  const ToolIcon = getToolIcon();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);
    setIsTyping(true);

    // Simulación de respuesta del bot con tiempo variable
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `He analizado tu solicitud para ${getToolName(toolId)}: "${input}". Aquí está mi respuesta personalizada basada en las últimas tendencias y mejores prácticas de marketing digital.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      setIsThinking(false);
    }, Math.random() * 1000 + 1500);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-500 to-purple-500'} border-b flex items-center justify-between`}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-white bg-opacity-20'}`}>
            <ToolIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{getToolName(toolId)}</h2>
            <p className="text-sm text-gray-200">Potenciado por IA</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-white bg-opacity-20'} text-white text-sm`}>
          En línea
        </div>
      </motion.div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`p-2 rounded-full ${
                    message.type === 'user'
                      ? 'bg-blue-500'
                      : theme === 'dark'
                      ? 'bg-purple-600'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}
                >
                  {message.type === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-800 text-white'
                      : 'bg-white text-gray-800'
                  } shadow-lg`}
                >
                  <p className="text-sm md:text-base">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2"
          >
            <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className={`p-6 border-t ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
      >
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Escribe tu mensaje para ${getToolName(toolId)}...`}
            className={`flex-1 p-4 rounded-xl ${
              theme === 'dark'
                ? 'bg-gray-700 text-white placeholder-gray-400'
                : 'bg-gray-100 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
            disabled={isThinking}
          />
          <Button
            type="submit"
            variant="create"
            disabled={!input.trim() || isThinking}
            className="px-6 rounded-xl"
          >
            {isThinking ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default AIChat;