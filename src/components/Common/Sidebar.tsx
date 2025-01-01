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
  Snowflake,
  Gift,
  Star
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
    { to: '/content', icon: Share2, label: 'Contenido' },
    { to: '/publications', icon: Share2, label: 'Publicaciones' },
    { to: '/settings', icon: Settings, label: 'Ajustes' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`bg-[#E61D2B] text-white ${
        isExpanded ? 'w-72' : 'w-20'
      } min-h-screen p-6 transition-all duration-300 ease-in-out relative shadow-xl border-r border-white/10 overflow-hidden`}
    >
      {/* Copos de nieve animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/10 animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              animation: `fall ${Math.random() * 3 + 2}s linear infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          >
            <Snowflake size={16} />
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-10 relative">
        {isExpanded && (
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-white/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                <Star className="w-6 h-6 text-white transform group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                FitOffice
                <Gift className="w-5 h-5 text-white animate-bounce" />
              </h2>
              <span className="text-xs text-white/70">
                Gestión Profesional
              </span>
            </div>
          </div>
        )}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
        >
          {theme === 'dark' ? <Sun size={20} className="text-white" /> : <Moon size={20} className="text-white" />}
        </button>
      </div>

      <div className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group relative ${
              isActive(item.to)
                ? 'bg-white text-[#E61D2B] font-medium shadow-lg'
                : 'hover:bg-white/10 text-white'
            }`}
          >
            <item.icon className={`w-6 h-6 ${
              isActive(item.to)
                ? 'text-[#E61D2B]'
                : 'text-white group-hover:scale-110 transition-transform duration-300'
            }`} />
            {isExpanded && (
              <span className="transition-colors duration-300">
                {item.label}
              </span>
            )}
            {isActive(item.to) && (
              <Snowflake className="absolute right-2 w-4 h-4 text-[#E61D2B] animate-spin" />
            )}
          </Link>
        ))}
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute bottom-6 -right-4 p-2 rounded-full bg-white text-[#E61D2B] shadow-lg hover:scale-110 transition-transform duration-300"
      >
        {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </nav>
  );
};

export default Sidebar;

<style jsx>{`
  @keyframes fall {
    0% {
      transform: translateY(-20px) rotate(0deg);
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
    }
  }
  .animate-fall {
    animation: fall linear infinite;
  }
`}</style>
