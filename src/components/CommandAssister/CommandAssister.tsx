import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Command, X, Search, Settings, Users, Dumbbell, Salad, DollarSign, 
  Megaphone, BarChart2, Share2, MessageSquare, HelpCircle, Send, Bot,
  Keyboard, Zap, Sparkles, FileText, Bell, Calendar, PlusCircle,
  Filter, Download, Upload, Trash2, Edit, Save, RefreshCw, Copy,
  Calculator
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface CommandOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string[];
  context?: string[];
}

type Mode = 'shortcuts' | 'messages' | 'assistant';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface QuickAction {
  id: string;
  text: string;
  icon: React.ReactNode;
  context?: string[];
}

const CommandAssister: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMode, setCurrentMode] = useState<Mode>('shortcuts');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const currentContext = location.pathname.split('/')[1] || 'dashboard';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getContextSpecificActions = (context: string): QuickAction[] => {
    const commonActions = [
      { id: 'refresh', text: 'Actualizar datos', icon: <RefreshCw className="w-4 h-4" /> },
      { id: 'help', text: 'Ayuda de sección', icon: <HelpCircle className="w-4 h-4" /> },
    ];

    const contextActions: Record<string, QuickAction[]> = {
      clients: [
        { id: 'newClient', text: 'Nuevo cliente', icon: <PlusCircle className="w-4 h-4" /> },
        { id: 'exportClients', text: 'Exportar clientes', icon: <Download className="w-4 h-4" /> },
        { id: 'importClients', text: 'Importar clientes', icon: <Upload className="w-4 h-4" /> },
        { id: 'filterClients', text: 'Filtrar clientes', icon: <Filter className="w-4 h-4" /> },
      ],
      routines: [
        { id: 'newRoutine', text: 'Nueva rutina', icon: <PlusCircle className="w-4 h-4" /> },
        { id: 'copyRoutine', text: 'Duplicar rutina', icon: <Copy className="w-4 h-4" /> },
        { id: 'templateRoutine', text: 'Usar plantilla', icon: <FileText className="w-4 h-4" /> },
      ],
      diets: [
        { id: 'newDiet', text: 'Nueva dieta', icon: <PlusCircle className="w-4 h-4" /> },
        { id: 'mealPlanner', text: 'Planificador de comidas', icon: <Calendar className="w-4 h-4" /> },
        { id: 'nutritionCalc', text: 'Calculadora nutricional', icon: <Calculator className="w-4 h-4" /> },
      ],
      economics: [
        { id: 'newInvoice', text: 'Nueva factura', icon: <PlusCircle className="w-4 h-4" /> },
        { id: 'exportReport', text: 'Exportar informe', icon: <Download className="w-4 h-4" /> },
        { id: 'payments', text: 'Gestionar pagos', icon: <DollarSign className="w-4 h-4" /> },
      ],
    };

    return [...(contextActions[context] || []), ...commonActions];
  };

  const quickCommandActions = getContextSpecificActions(currentContext);

  const quickAssistantActions: QuickAction[] = [
    { id: '1', text: '¿Cómo crear una rutina personalizada?', icon: <Sparkles className="w-4 h-4" />, context: ['routines'] },
    { id: '2', text: '¿Cómo gestionar los pagos?', icon: <DollarSign className="w-4 h-4" />, context: ['economics'] },
    { id: '3', text: '¿Cómo exportar datos?', icon: <Share2 className="w-4 h-4" /> },
    { id: '4', text: '¿Cómo configurar notificaciones?', icon: <Bell className="w-4 h-4" /> },
    { id: '5', text: '¿Cómo crear un plan nutricional?', icon: <Salad className="w-4 h-4" />, context: ['diets'] },
    { id: '6', text: '¿Cómo hacer seguimiento de clientes?', icon: <Users className="w-4 h-4" />, context: ['clients'] },
  ].filter(action => !action.context || action.context.includes(currentContext));

  const commandOptions: CommandOption[] = [
    {
      id: 'clients',
      title: 'Gestionar Clientes',
      description: 'Ver y administrar clientes',
      icon: <Users className="w-5 h-5" />,
      action: () => navigate('/clients'),
      shortcut: ['Ctrl', 'C']
    },
    {
      id: 'routines',
      title: 'Rutinas',
      description: 'Gestionar rutinas de entrenamiento',
      icon: <Dumbbell className="w-5 h-5" />,
      action: () => navigate('/routines'),
      shortcut: ['Ctrl', 'R']
    },
    {
      id: 'diets',
      title: 'Dietas',
      description: 'Gestionar planes nutricionales',
      icon: <Salad className="w-5 h-5" />,
      action: () => navigate('/diets'),
      shortcut: ['Ctrl', 'D']
    },
    {
      id: 'economics',
      title: 'Economía',
      description: 'Gestionar finanzas y pagos',
      icon: <DollarSign className="w-5 h-5" />,
      action: () => navigate('/economics'),
      shortcut: ['Ctrl', 'E']
    },
    {
      id: 'marketing',
      title: 'Marketing',
      description: 'Gestionar campañas y análisis',
      icon: <Megaphone className="w-5 h-5" />,
      action: () => navigate('/marketing/campaigns'),
      shortcut: ['Ctrl', 'M']
    },
    {
      id: 'settings',
      title: 'Configuración',
      description: 'Ajustes del sistema',
      icon: <Settings className="w-5 h-5" />,
      action: () => navigate('/settings'),
      shortcut: ['Ctrl', 'S']
    },
    {
      id: 'new',
      title: 'Crear Nuevo',
      description: 'Crear nuevo elemento en la sección actual',
      icon: <PlusCircle className="w-5 h-5" />,
      action: () => handleNewItem(),
      shortcut: ['Ctrl', 'N'],
      context: ['clients', 'routines', 'diets', 'economics']
    },
    {
      id: 'save',
      title: 'Guardar',
      description: 'Guardar cambios actuales',
      icon: <Save className="w-5 h-5" />,
      action: () => handleSave(),
      shortcut: ['Ctrl', 'S'],
      context: ['routines', 'diets', 'economics']
    },
    {
      id: 'delete',
      title: 'Eliminar',
      description: 'Eliminar elemento seleccionado',
      icon: <Trash2 className="w-5 h-5" />,
      action: () => handleDelete(),
      shortcut: ['Ctrl', 'Del'],
      context: ['clients', 'routines', 'diets']
    },
    {
      id: 'edit',
      title: 'Editar',
      description: 'Editar elemento seleccionado',
      icon: <Edit className="w-5 h-5" />,
      action: () => handleEdit(),
      shortcut: ['Ctrl', 'E'],
      context: ['clients', 'routines', 'diets']
    }
  ];

  const handleNewItem = () => {
    console.log('Crear nuevo en:', currentContext);
  };

  const handleSave = () => {
    console.log('Guardar en:', currentContext);
  };

  const handleDelete = () => {
    console.log('Eliminar en:', currentContext);
  };

  const handleEdit = () => {
    console.log('Editar en:', currentContext);
  };

  const filteredOptions = commandOptions.filter(option => 
    (!option.context || option.context.includes(currentContext)) &&
    (option.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderContent = () => {
    switch (currentMode) {
      case 'shortcuts':
        return (
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredOptions.map((option) => (
              <button
                key={option.id}
                onClick={option.action}
                className={`w-full text-left p-4 rounded-xl mb-2 flex items-center justify-between ${
                  theme === 'dark'
                    ? 'bg-gray-700/50 hover:bg-gray-600/50'
                    : 'bg-gray-50 hover:bg-gray-100'
                } transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm`}
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-white'
                  } mr-3`}>
                    {option.icon}
                  </div>
                  <div>
                    <div className="font-medium">{option.title}</div>
                    <div className="text-sm text-gray-500">{option.description}</div>
                  </div>
                </div>
                {option.shortcut && (
                  <div className="flex space-x-1">
                    {option.shortcut.map((key, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded-lg text-xs ${
                          theme === 'dark'
                            ? 'bg-gray-600 text-gray-300'
                            : 'bg-white text-gray-700'
                        } shadow-sm`}
                      >
                        {key}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        );

      case 'messages':
        return (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-4 rounded-2xl max-w-[80%] ${
                      message.sender === 'user'
                        ? theme === 'dark'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-700'
                        : 'bg-gray-100'
                    } shadow-md`}
                  >
                    {message.text}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className={`flex-1 px-4 py-3 rounded-xl ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white placeholder-gray-400'
                      : 'bg-gray-100 text-gray-800 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  className={`p-3 rounded-xl ${
                    theme === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white transition-colors duration-300 transform hover:scale-105`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'assistant':
        return (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid gap-4">
              {quickAssistantActions.map((action) => (
                <button
                  key={action.id}
                  className={`p-4 rounded-xl ${
                    theme === 'dark'
                      ? 'bg-gray-700/50 hover:bg-gray-600/50'
                      : 'bg-gray-50 hover:bg-gray-100'
                  } transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm flex items-center space-x-3`}
                >
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-white'
                  }`}>
                    {action.icon}
                  </div>
                  <span>{action.text}</span>
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded ? (
        <div className={`${
          theme === 'dark' 
            ? 'bg-gray-800/90 backdrop-blur-lg' 
            : 'bg-white/90 backdrop-blur-lg'
        } rounded-2xl shadow-2xl w-96 h-[32rem] flex flex-col transition-all duration-300 transform hover:shadow-blue-500/20`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Command Assister
              </h2>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setCurrentMode('shortcuts')}
                className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 ${
                  currentMode === 'shortcuts'
                    ? theme === 'dark'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                } transform hover:scale-105`}
              >
                <Keyboard className="w-5 h-5 mx-auto" />
              </button>
              <button
                onClick={() => setCurrentMode('messages')}
                className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 ${
                  currentMode === 'messages'
                    ? theme === 'dark'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                } transform hover:scale-105`}
              >
                <MessageSquare className="w-5 h-5 mx-auto" />
              </button>
              <button
                onClick={() => setCurrentMode('assistant')}
                className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 ${
                  currentMode === 'assistant'
                    ? theme === 'dark'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                } transform hover:scale-105`}
              >
                <HelpCircle className="w-5 h-5 mx-auto" />
              </button>
            </div>
            {currentMode === 'shortcuts' && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar atajo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl ${
                    theme === 'dark' 
                      ? 'bg-gray-700/50 focus:bg-gray-600/50' 
                      : 'bg-gray-100 focus:bg-gray-200'
                  } outline-none transition-colors focus:ring-2 focus:ring-blue-500/50`}
                />
              </div>
            )}
          </div>
          {renderContent()}
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:rotate-12`}
        >
          <Command className={`w-6 h-6 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
          }`} />
        </button>
      )}
    </div>
  );
};

export default CommandAssister;