import React, { useState, useEffect, useRef } from 'react';
import { User, Dumbbell, Bell, Search } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface Alert {
  _id: string;
  nombre: string;
  tipo: string;
  fechaExpiracion: string;
  estado: string;
  trainer: {
    _id: string;
    nombre: string;
    email: string;
  };
  fechaFinalizacion: string;
  createdAt: string;
  updatedAt: string;
}

const Header: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const displayName = user?.name || user?.email || 'Usuario';

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com//api/economic-alerts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Error en la petición');
        }

        const data = await response.json();
        if (data.status === 'success') {
          setAlerts(data.data.alerts);
        }
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-full transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Bell className="w-5 h-5 text-white" />
                {alerts.length > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Dropdown de notificaciones */}
              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } z-50`}>
                  <div className="p-4">
                    <h3 className={`text-lg font-semibold mb-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      Notificaciones
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {alerts.length > 0 ? (
                        alerts.map((alert) => (
                          <div 
                            key={alert._id}
                            className={`p-3 rounded-lg ${
                              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                            }`}
                          >
                            <h4 className={`font-medium ${
                              theme === 'dark' ? 'text-white' : 'text-gray-800'
                            }`}>
                              {alert.nombre}
                            </h4>
                            <p className={`text-sm ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              Tipo: {alert.tipo}
                            </p>
                            <p className={`text-sm ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              Vence: {formatDate(alert.fechaExpiracion)}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              alert.estado === 'Finalizada' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-yellow-500 text-white'
                            }`}>
                              {alert.estado}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className={`text-center py-3 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          No hay notificaciones
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

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
                <span className="text-white font-medium">{displayName}</span>
                <span className="text-xs text-gray-300">Trainer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;