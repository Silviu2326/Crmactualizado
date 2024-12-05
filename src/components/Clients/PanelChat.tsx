import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Send, Paperclip, Image, Smile, MoreVertical, Search } from 'lucide-react';
import Button from '../Common/Button';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'client';
  timestamp: Date;
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  }[];
}

interface PanelChatProps {
  clienteId: string;
  clienteName: string;
}

const PanelChat: React.FC<PanelChatProps> = ({ clienteId, clienteName }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAttaching, setIsAttaching] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simular algunos mensajes iniciales
  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: '¡http://localhost:3000/! ¿Cómo va el entrenamiento?',
        sender: 'client',
        timestamp: new Date(Date.now() - 86400000) // 24 horas atrás
      },
      {
        id: '2',
        text: 'Todo va muy bien, he completado todos los ejercicios programados',
        sender: 'user',
        timestamp: new Date(Date.now() - 82800000) // 23 horas atrás
      }
    ]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { 
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div className={`flex flex-col h-[600px] rounded-lg ${
      isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    } shadow-lg`}>
      {/* Header */}
      <div className={`flex justify-between items-center p-4 border-b ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isDark ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            {clienteName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold">{clienteName}</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Cliente
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log('Buscar en el chat')}
          >
            <Search size={20} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log('Más opciones')}
          >
            <MoreVertical size={20} />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? isDark
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : isDark
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="break-words">{message.text}</p>
              {message.attachments?.map((attachment, index) => (
                <div
                  key={index}
                  className={`mt-2 p-2 rounded ${
                    isDark ? 'bg-gray-600' : 'bg-gray-200'
                  }`}
                >
                  {attachment.type === 'image' ? (
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      className="max-w-full rounded"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Paperclip size={16} />
                      <span>{attachment.name}</span>
                    </div>
                  )}
                </div>
              ))}
              <p className={`text-xs mt-1 ${
                message.sender === 'user'
                  ? 'text-blue-200'
                  : isDark
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}>
                {formatTimestamp(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje..."
              className={`w-full p-3 rounded-lg resize-none ${
                isDark
                  ? 'bg-gray-700 text-white placeholder-gray-400'
                  : 'bg-gray-100 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <div className="flex space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => console.log('Archivo seleccionado:', e.target.files)}
              multiple
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAttachClick}
            >
              <Paperclip size={20} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log('Adjuntar imagen')}
            >
              <Image size={20} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log('Insertar emoji')}
            >
              <Smile size={20} />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`${
                !newMessage.trim()
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelChat;
