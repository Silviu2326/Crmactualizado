import React, { useState, useEffect } from 'react';
import { Search, Plus, Calendar, List, Grid, Instagram, Youtube, Music, Link, 
  Snowflake, Gift, TreeDeciduous, Star, Bell } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import NewPublicationModal from '../components/modals/NewPublicationModal';
import YouTubeModal from '../components/modals/YouTubeModal';
import InstagramModal from '../components/modals/InstagramModal';
import TikTokModal from '../components/modals/TikTokModal';
import GridView from '../components/views/GridView';
import ListView from '../components/views/ListView';
import CalendarView from '../components/views/CalendarView';
import { youtubeService } from '../services/youtubeService';
import { instagramService } from '../services/instagramService';
import toast from 'react-hot-toast';

const Publications: React.FC = () => {
  const { theme } = useTheme();
  const [view, setView] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSnow, setShowSnow] = useState(true);
  const [isNewPublicationModalOpen, setIsNewPublicationModalOpen] = useState(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [isTikTokModalOpen, setIsTikTokModalOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Estilos navideños
  const christmasStyles = {
    container: `p-8 min-h-screen relative ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-green-900/20 to-red-900/20'
        : 'bg-gradient-to-br from-red-50 via-green-50 to-red-50'
    }`,
    card: `${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'} rounded-xl shadow-lg p-6 mb-8 backdrop-blur-sm`,
    title: `text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`,
    snowflake: 'absolute animate-fall pointer-events-none',
  };

  // Generar copos de nieve
  const snowflakes = showSnow ? Array.from({ length: 30 }).map((_, i) => ({
    style: {
      position: 'absolute',
      left: `${Math.random() * 100}%`,
      top: `-20px`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 2}s`,
      opacity: Math.random() * 0.5 + 0.5
    }
  })) : [];

  useEffect(() => {
    const styles = `
      @keyframes fall {
        0% {
          transform: translateY(-10vh) rotate(0deg);
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
        }
      }
      
      .animate-fall {
        animation: fall linear infinite;
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleYouTubeAuth = async () => {
    try {
      setIsAuthenticating(true);
      const { url } = await youtubeService.getAuthUrl();
      window.location.href = url;
    } catch (error) {
      toast.error('Error al obtener la URL de autorización de YouTube');
      console.error('Error getting YouTube auth URL:', error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleInstagramAuth = async () => {
    try {
      setIsAuthenticating(true);
      const { url } = await instagramService.getAuthUrl();
      window.location.href = url;
    } catch (error) {
      toast.error('Error al obtener la URL de autorización de Instagram');
      console.error('Error getting Instagram auth URL:', error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const publications = [
    
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      scheduled: theme === 'dark' ? 'bg-yellow-800/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
      published: theme === 'dark' ? 'bg-green-800/30 text-green-300' : 'bg-green-100 text-green-800',
      pending: theme === 'dark' ? 'bg-blue-800/30 text-blue-300' : 'bg-blue-100 text-blue-800'
    };
    const labels = {
      scheduled: 'Programada',
      published: 'Publicada',
      pending: 'En Cola'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const filteredPublications = publications.filter(pub => {
    if (filter !== 'all' && pub.platform !== filter) return false;
    if (searchTerm && !pub.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const renderView = () => {
    switch (view) {
      case 'list':
        return <ListView publications={filteredPublications} getStatusBadge={getStatusBadge} />;
      case 'calendar':
        return <CalendarView publications={filteredPublications} />;
      default:
        return <GridView publications={filteredPublications} getStatusBadge={getStatusBadge} />;
    }
  };

  return (
    <div className={christmasStyles.container}>
      {showSnow && snowflakes.map((snowflake, i) => (
        <div key={i} className={christmasStyles.snowflake} style={snowflake.style}>
          <Snowflake size={16} className={`${theme === 'dark' ? 'text-gray-300' : 'text-red-200'}`} />
        </div>
      ))}

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <TreeDeciduous className="w-8 h-8 text-green-500 animate-bounce" />
            <h1 className={christmasStyles.title}>
              GESTIÓN DE PUBLICACIONES
            </h1>
            <Gift className="w-8 h-8 text-red-500 animate-bounce" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleYouTubeAuth}
              disabled={isAuthenticating}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Youtube size={20} />
              <span className="hidden sm:inline">Conectar YouTube</span>
              <Link size={16} className="ml-1" />
            </button>
            <button
              onClick={handleInstagramAuth}
              disabled={isAuthenticating}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg transition-colors"
            >
              <Instagram size={20} />
              <span className="hidden sm:inline">Conectar Instagram</span>
              <Link size={16} className="ml-1" />
            </button>
            <button
              onClick={() => setShowSnow(!showSnow)}
              className={`p-2 rounded-full ${
                theme === 'dark'
                  ? 'bg-gray-700 text-green-400 hover:bg-gray-600'
                  : 'bg-white text-red-500 hover:bg-red-50'
              } transition-colors duration-200`}
            >
              <Snowflake size={20} />
            </button>
          </div>
        </div>
        
        <div className={christmasStyles.card}>
          <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <button
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  filter === 'all' 
                    ? 'bg-gradient-to-r from-red-500 to-green-500 hover:from-red-600 hover:to-green-600 text-white' 
                    : `${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}` 
                }`}
                onClick={() => setFilter('all')}
              >
                <div className="flex items-center gap-2">
                  <Star size={16} />
                  <span>Todas</span>
                </div>
              </button>
              <button
                className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center space-x-2 ${
                  filter === 'instagram' 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white' 
                    : `${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}` 
                }`}
                onClick={() => setFilter('instagram')}
              >
                <Instagram size={16} />
                <span>Instagram</span>
              </button>
              <button
                className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center space-x-2 ${
                  filter === 'tiktok' 
                    ? `${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-black hover:bg-gray-900'} text-white` 
                    : `${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}` 
                }`}
                onClick={() => setFilter('tiktok')}
              >
                <Music size={16} />
                <span>TikTok</span>
              </button>
              <button
                className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center space-x-2 ${
                  filter === 'youtube' 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : `${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}` 
                }`}
                onClick={() => setFilter('youtube')}
              >
                <Youtube size={16} />
                <span>YouTube</span>
              </button>
            </div>

            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Buscar publicaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setIsNewPublicationModalOpen(true)}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-green-500 hover:from-red-600 hover:to-green-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <Gift size={20} />
                <span>Nueva Publicación</span>
              </button>
              <button
                onClick={() => setIsYouTubeModalOpen(true)}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg group"
              >
                <Youtube size={20} className="group-hover:animate-bounce" />
                <span>Subir a YouTube</span>
              </button>
              <button
                onClick={() => setIsInstagramModalOpen(true)}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg group"
              >
                <Instagram size={20} className="group-hover:animate-bounce" />
                <span>Subir a Instagram</span>
              </button>
              <button
                onClick={() => setIsTikTokModalOpen(true)}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all shadow-md hover:shadow-lg text-white group ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-black hover:bg-gray-900'
                }`}
              >
                <Music size={20} className="group-hover:animate-bounce" />
                <span>Subir a TikTok</span>
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div className={`flex space-x-2 p-1 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded transition-colors ${
                    view === 'grid'
                      ? `${theme === 'dark' ? 'bg-gray-600' : 'bg-white'} text-blue-500`
                      : `${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded transition-colors ${
                    view === 'list'
                      ? `${theme === 'dark' ? 'bg-gray-600' : 'bg-white'} text-blue-500`
                      : `${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                  }`}
                >
                  <List size={20} />
                </button>
                <button
                  onClick={() => setView('calendar')}
                  className={`p-2 rounded transition-colors ${
                    view === 'calendar'
                      ? `${theme === 'dark' ? 'bg-gray-600' : 'bg-white'} text-blue-500`
                      : `${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                  }`}
                >
                  <Calendar size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {renderView()}

        {isNewPublicationModalOpen && (
          <NewPublicationModal onClose={() => setIsNewPublicationModalOpen(false)} />
        )}
        {isYouTubeModalOpen && (
          <YouTubeModal onClose={() => setIsYouTubeModalOpen(false)} />
        )}
        {isInstagramModalOpen && (
          <InstagramModal onClose={() => setIsInstagramModalOpen(false)} />
        )}
        {isTikTokModalOpen && (
          <TikTokModal onClose={() => setIsTikTokModalOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default Publications;