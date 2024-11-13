import React from 'react';
import { User, Dumbbell, Bell, Search } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className={`${
      theme === 'dark' 
        ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
    } shadow-xl transition-all duration-300`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo y Nombre */}
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className={`relative p-2 rounded-full ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <Dumbbell className={`w-7 h-7 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                } transform group-hover:rotate-12 transition-transform duration-300`} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wider bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                FitOffice
              </h1>
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-blue-100'
              }`}>Professional Fitness Management</span>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-12">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar..."
                className={`w-full px-4 py-2 pl-10 rounded-xl ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 text-gray-200 placeholder-gray-400 border-gray-700'
                    : 'bg-white/10 text-white placeholder-blue-100 border-white/20'
                } border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300`}
              />
              <Search className={`absolute left-3 top-2.5 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-blue-100'
              }`} />
            </div>
          </div>

          {/* Acciones del usuario */}
          <div className="flex items-center space-x-4">
            {/* Notificaciones */}
            <button className={`relative p-2 rounded-full transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-white/10 hover:bg-white/20'
            }`}>
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Perfil */}
            <div 
              onClick={handleProfileClick}
              className={`flex items-center space-x-3 px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white/10 hover:bg-white/20'
              } hover:transform hover:scale-105`}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-75"></div>
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center ring-2 ring-white/20">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-medium">John Doe</span>
                <span className="text-xs text-gray-300">Administrador</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;