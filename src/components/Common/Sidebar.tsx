import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  BookOpen
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Sidebar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/clients', icon: Users, label: 'Clientes' },
    { to: '/routines', icon: Dumbbell, label: 'Rutinas' },
    { to: '/diets', icon: Salad, label: 'Dietas' },
    { to: '/classes', icon: BookOpen, label: 'Clases' },
    { to: '/economics', icon: DollarSign, label: 'Economía' },
    { to: '/marketing/campaigns', icon: Megaphone, label: 'Campañas' },
    { to: '/marketing/analytics', icon: BarChart2, label: 'Análisis' },
    { to: '/content', icon: Share2, label: 'Contenido' },
    { to: '/settings', icon: Settings, label: 'Ajustes' },
  ];

  return (
    <nav
      className={`${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
      } ${
        isExpanded ? 'w-64' : 'w-20'
      } min-h-screen p-4 transition-all duration-300 ease-in-out relative`}
    >
      <div className="flex justify-between items-center mb-8">
        {isExpanded && <h1 className="text-2xl font-bold">Trainerhead</h1>}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${
            theme === 'dark'
              ? 'bg-gray-800 text-yellow-400'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className={`flex items-center space-x-2 p-2 rounded-lg ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              } transition-colors duration-200`}
            >
              <item.icon className="w-5 h-5" />
              {isExpanded && <span>{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute bottom-4 right-4 bg-blue-500 text-white rounded-full p-1 ${
          isExpanded ? 'transform rotate-180' : ''
        }`}
      >
        <ChevronLeft size={20} />
      </button>
    </nav>
  );
};

export default Sidebar;