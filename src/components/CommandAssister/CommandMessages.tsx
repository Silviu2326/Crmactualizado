import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

const CommandMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡https://fitoffice2-f70b52bef77e.herokuapp.com/! ¿En qué puedo ayudarte hoy?',
      sender: 'assistant',
      timestamp: new Date(),
      status: 'sent',
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simular envío del mensaje
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'sent' } 
            : msg
        )
      );

      // Simular respuesta del asistente
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: '¡Gracias por tu mensaje! Estoy procesando tu solicitud.',
          sender: 'assistant',
          timestamp: new Date(),
          status: 'sent',
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1500);
    }, 500);
  };

  const renderMessageStatus = (status?: string) => {
    if (status === 'sending') {
      return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />;
    }
    return null;
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`
                flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} 
                items-end space-x-2 animate-fadeIn
              `}
            >
              {message.sender === 'assistant' && (
                <div className={`
                  p-2 rounded-lg
                  ${theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-100'}
                  transition-colors duration-300
                  animate-bounce-subtle
                `}>
                  <Bot size={16} className="text-blue-500" />
                </div>
              )}
              <div className={`
                max-w-[80%] group
                ${message.sender === 'user' ? 'order-1' : 'order-2'}
              `}>
                <div className={`
                  p-4 rounded-2xl
                  ${message.sender === 'user'
                    ? theme === 'dark'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-700/50'
                    : 'bg-gray-100'
                  }
                  shadow-sm
                  transition-all duration-300
                  group-hover:shadow-md
                  ${message.sender === 'user' 
                    ? 'group-hover:shadow-blue-500/20' 
                    : 'group-hover:shadow-gray-500/20'
                  }
                  relative
                  before:content-[''] before:absolute before:-inset-1 
                  before:bg-gradient-to-r before:from-blue-500/20 
                  before:via-purple-500/20 before:to-pink-500/20 
                  before:rounded-3xl before:blur-xl before:opacity-0 
                  before:group-hover:opacity-100 before:transition-opacity 
                  before:duration-500 before:-z-10
                `}>
                  {message.text}
                </div>
                <div className="flex items-center justify-end mt-1 space-x-2">
                  <div className={`
                    text-xs
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                    ${message.sender === 'user' ? 'text-right' : 'text-left'}
                  `}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  {renderMessageStatus(message.status)}
                </div>
              </div>
              {message.sender === 'user' && (
                <div className={`
                  p-2 rounded-lg order-3
                  ${theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-100'}
                  transition-colors duration-300
                  animate-bounce-subtle
                `}>
                  <User size={16} className="text-blue-500" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Bot size={16} className="text-blue-500" />
              <span>Escribiendo</span>
              <span className="flex space-x-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
              </span>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className={`
        p-6 border-t relative
        ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'}
        after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 
        after:h-px after:bg-gradient-to-r after:from-transparent 
        after:via-blue-500/50 after:to-transparent
      `}>
        <div className="flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe un mensaje..."
            className={`
              flex-1 px-4 py-3 rounded-xl
              ${theme === 'dark'
                ? 'bg-gray-700/50 text-white placeholder-gray-400'
                : 'bg-gray-100 text-gray-800 placeholder-gray-500'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500/50
              border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}
              hover:border-blue-500/30
              transition-all duration-300
              group-hover:shadow-lg
            `}
          />
          <button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim()}
            className={`
              p-3 rounded-xl
              ${currentMessage.trim()
                ? theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600'
                : theme === 'dark'
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-gray-200 cursor-not-allowed'
              }
              text-white
              transition-all duration-300
              transform hover:scale-105 active:scale-95
              disabled:opacity-50 disabled:hover:scale-100
              shadow-sm hover:shadow-lg hover:shadow-blue-500/20
              relative
              before:content-[''] before:absolute before:-inset-1 
              before:bg-gradient-to-r before:from-blue-500/20 
              before:via-purple-500/20 before:to-pink-500/20 
              before:rounded-3xl before:blur-xl before:opacity-0 
              before:hover:opacity-100 before:transition-opacity 
              before:duration-500 before:-z-10
            `}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandMessages;