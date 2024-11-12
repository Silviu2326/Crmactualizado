import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Send,
  Bot,
  User,
  Loader,
  Sparkles,
  Image as ImageIcon,
  Wand2,
  Rocket,
  Brain,
  Target
} from 'lucide-react';
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
      content: `¡Hola! 👋 Soy tu asistente de IA para ${getToolName(
        toolId
      )}. ¿En qué puedo ayudarte hoy?`,
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
      global: 'Publicación Global',
    };
    return toolNames[id] || id;
  };

  const getToolIcon = () => {
    const icons: { [key: string]: React.ElementType } = {
      posts: Sparkles,
      stories: ImageIcon,
      'image-gen': Wand2,
      audience: User,
      trends: Target,
      competitor: Brain,
      instagram: ImageIcon,
      facebook: Target,
      global: Rocket,
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

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `He analizado tu solicitud para ${getToolName(
          toolId
        )}: "${input}". Aquí está mi respuesta personalizada basada en las últimas tendencias y mejores prácticas de marketing digital.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
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
        className={`p-6 ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-gray-800 to-gray-900'
            : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600'
        } border-b flex items-center space-x-4`}
      >
        <div className="flex items-center space-x-4 flex-1">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
            className={`p-3 rounded-xl ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                : 'bg-white bg-opacity-20 backdrop-blur-lg'
            } shadow-lg`}
          >
            <ToolIcon className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-white"
            >
              {getToolName(toolId)}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-gray-200 font-medium"
            >
              Asistente IA Especializado
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div
        className={`flex-1 overflow-y-auto p-6 space-y-6 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex items-start space-x-3 max-w-[80%] ${
                  message.type === 'user'
                    ? 'flex-row-reverse space-x-reverse'
                    : ''
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`p-2.5 rounded-xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                      : theme === 'dark'
                      ? 'bg-gradient-to-br from-purple-600 to-pink-600'
                      : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  } shadow-lg`}
                >
                  {message.type === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-800 text-white border border-gray-700'
                      : 'bg-white text-gray-800 shadow-md'
                  } shadow-lg backdrop-blur-lg`}
                >
                  <p className="text-sm md:text-base leading-relaxed">
                    {message.content}
                  </p>
                  <p className="text-xs opacity-70 mt-2 font-medium">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
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
            className="flex items-center space-x-3"
          >
            <div
              className={`p-2.5 rounded-xl ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600'
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600'
              } shadow-lg`}
            >
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex space-x-2 p-3 rounded-xl bg-gradient-to-r from-gray-500/10 to-gray-500/20 backdrop-blur-lg">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: 0
                }}
                className="w-2.5 h-2.5 rounded-full bg-current"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: 0.2
                }}
                className="w-2.5 h-2.5 rounded-full bg-current"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: 0.4
                }}
                className="w-2.5 h-2.5 rounded-full bg-current"
              />
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
        className={`p-6 border-t ${
          theme === 'dark'
            ? 'bg-gray-800/95 border-gray-700'
            : 'bg-white/95 border-gray-200'
        } backdrop-blur-lg`}
      >
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Escribe tu mensaje para ${getToolName(toolId)}...`}
            className={`flex-1 p-4 rounded-xl ${
              theme === 'dark'
                ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                : 'bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-200'
            } border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
            disabled={isThinking}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isThinking}
            className={`px-6 rounded-xl ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
            } text-white font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
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