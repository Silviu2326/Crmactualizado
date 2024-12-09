import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  Dumbbell,
  Salad,
  DollarSign,
  Megaphone,
  BarChart2,
  Share2,
  Home,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Settings,
  BookOpen,
  Layout,
  MailPlus,
  FileText,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Sidebar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/clients', icon: Users, label: 'Clientes' },
    { to: '/services', icon: Layout, label: 'Servicios' },
    { to: '/reportesweb', icon: FileText, label: 'Reportes Web' },
    { to: '/routines', icon: Dumbbell, label: 'Entrenamiento' },
    { to: '/diets', icon: Salad, label: 'Dietas' },
    { to: '/classes', icon: BookOpen, label: 'Clases' },
    { to: '/economics', icon: DollarSign, label: 'Finanzas' },
    { to: '/marketing/campaigns', icon: MailPlus , label: 'Campañas de Correo' },
    { to: '/marketing/analytics', icon: BarChart2, label: 'Análisis' },
    { to: '/content', icon: Share2, label: 'Contenido' },
    { to: '/publications', icon: Share2, label: 'Publicaciones' },
    { to: '/settings', icon: Settings, label: 'Ajustes' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`${
        theme === 'dark' 
          ? 'bg-gray-900 text-gray-300' 
          : 'bg-white text-gray-800'
      } ${
        isExpanded ? 'w-72' : 'w-20'
      } min-h-screen p-6 transition-all duration-300 ease-in-out relative shadow-xl border-r ${
        theme === 'dark' ? 'border-gray-800' : 'border-gray-100'
      }`}
    >
      <div className="flex justify-between items-center mb-10">
        {isExpanded && (
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className={`relative p-2 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <Dumbbell className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                } transform group-hover:rotate-12 transition-transform duration-300`} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                FitOffice
              </h2>
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Gestión Profesional
              </span>
            </div>
          </div>
        )}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl ${
            theme === 'dark'
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          } transition-all duration-300 hover:scale-110`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group ${
              isActive(item.to)
                ? theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20'
                : theme === 'dark'
                ? 'hover:bg-gray-800'
                : 'hover:bg-gray-100'
            } ${!isExpanded && 'justify-center'}`}
          >
            <div className={`relative ${isActive(item.to) ? 'transform scale-110' : ''}`}>
              <item.icon className={`w-5 h-5 ${
                isActive(item.to) 
                  ? 'text-white' 
                  : theme === 'dark' 
                    ? 'text-gray-400 group-hover:text-gray-200' 
                    : 'text-gray-600 group-hover:text-gray-900'
              } transition-all duration-300`} />
            </div>
            {isExpanded && (
              <span className={`font-medium ${
                isActive(item.to)
                  ? 'text-white'
                  : theme === 'dark'
                  ? 'text-gray-300 group-hover:text-white'
                  : 'text-gray-700 group-hover:text-gray-900'
              } transition-colors duration-300`}>
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute -right-4 top-1/2 p-2.5 rounded-full ${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        } shadow-lg hover:scale-110 transition-all duration-300 border ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      {/* Footer del Sidebar */}
      <div className={`absolute bottom-6 left-0 right-0 px-6 ${!isExpanded && 'hidden'}`}>
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
        } transition-all duration-300`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-white'
            }`}>
              <Layout className={`w-5 h-5 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
              }`} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">Layout Compacto</h3>
              <p className="text-xs text-gray-500">Optimiza tu espacio</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
