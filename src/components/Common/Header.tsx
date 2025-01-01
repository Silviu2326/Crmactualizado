import React, { useState, useEffect, useRef } from 'react';
import { User, Bell, Search, Snowflake, Gift, Star, Candy } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationsPortal from './NotificationsPortal';

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
  const notificationButtonRef = useRef<HTMLButtonElement>(null);

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

        const response = await fetch('http://localhost:3000/api/economic-alerts', {
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
      if (notificationButtonRef.current && !notificationButtonRef.current.contains(event.target as Node)) {
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
    <>
      <header className={`bg-[#E61D2B] shadow-xl transition-all duration-300 relative overflow-hidden z-20`}>
        <style>
          {`
            @keyframes fall {
              0% {
                transform: translateY(-20px) rotate(0deg);
              }
              100% {
                transform: translateY(100vh) rotate(360deg);
              }
            }
            @keyframes twinkle {
              0%, 100% {
                opacity: 0.3;
                transform: scale(1);
              }
              50% {
                opacity: 0.8;
                transform: scale(1.2);
              }
            }
            .animate-fall {
              animation: fall linear infinite;
            }
            .animate-twinkle {
              animation: twinkle ease-in-out infinite;
            }
          `}
        </style>
        {/* Decoración navideña */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Copos de nieve */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`snow-${i}`}
              className="absolute text-white/20 animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animation: `fall ${Math.random() * 3 + 2}s linear infinite`,
                animationDelay: `${Math.random() * 3}s`
              }}
            >
              <Snowflake size={20} />
            </div>
          ))}
          
          {/* Estrellas brillantes */}
          {[...Array(10)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute text-yellow-300/30 animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkle ${Math.random() * 2 + 1}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              <Star size={16} />
            </div>
          ))}

          {/* Bastones de caramelo */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`candy-${i}`}
              className="absolute text-white/20"
              style={{
                left: `${i * 25}%`,
                top: '0',
                transform: 'rotate(45deg)',
                opacity: 0.2
              }}
            >
              <Candy size={32} />
            </div>
          ))}
        </div>
        
        <div className="container mx-auto px-6 py-4 relative">
          <div className="flex justify-between items-center">
            {/* Logo y Nombre */}
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="absolute -inset-1 bg-white/20 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative p-2 rounded-full bg-white/10 backdrop-blur-sm">
                  <Gift className="w-6 h-6 text-white transform group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  FitOffice
                  <div className="flex items-center space-x-1">
                    <Snowflake className="w-5 h-5 text-white animate-pulse" />
                    <Star className="w-4 h-4 text-yellow-300 animate-bounce" />
                  </div>
                </h1>
                <span className="text-xs text-white/70 flex items-center gap-1">
                  Felices Fiestas
                  <Gift className="w-3 h-3 text-white animate-bounce" />
                </span>
              </div>
            </div>

            {/* Búsqueda y Notificaciones */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 w-64 border border-white/20"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-white/70" />
              </div>

              <div className="relative">
                <button
                  ref={notificationButtonRef}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-300 relative"
                >
                  <Bell className="w-6 h-6 text-white" />
                  {alerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-[#E61D2B] rounded-full text-xs flex items-center justify-center font-bold">
                      {alerts.length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <NotificationsPortal
                    alerts={alerts}
                    onClose={() => setShowNotifications(false)}
                    formatDate={formatDate}
                    buttonRef={notificationButtonRef}
                  />
                )}
              </div>

              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-3 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-300"
              >
                <User className="w-6 h-6 text-white" />
                <span className="text-white font-medium">{displayName}</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;