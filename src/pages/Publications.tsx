import React, { useState } from 'react';
import { Search, Plus, Calendar, List, Grid, Instagram, Youtube, Music } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import NewPublicationModal from '../components/modals/NewPublicationModal';
import YouTubeModal from '../components/modals/YouTubeModal';
import InstagramModal from '../components/modals/InstagramModal';
import TikTokModal from '../components/modals/TikTokModal';
import GridView from '../components/views/GridView';
import ListView from '../components/views/ListView';
import CalendarView from '../components/views/CalendarView';

const Publications: React.FC = () => {
  const { theme } = useTheme();
  const [view, setView] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewPublicationModalOpen, setIsNewPublicationModalOpen] = useState(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [isTikTokModalOpen, setIsTikTokModalOpen] = useState(false);

  const publications = [
    {
      id: 1,
      title: 'Mi primer video de TikTok',
      date: '2023-10-01 10:00',
      status: 'scheduled',
      platform: 'tiktok'
    },
    {
      id: 2,
      title: 'Nuevo post en Instagram',
      date: '2023-10-02 12:00',
      status: 'published',
      platform: 'instagram'
    },
    {
      id: 3,
      title: 'Tutorial de React en YouTube',
      date: '2023-10-03 15:00',
      status: 'pending',
      platform: 'youtube'
    }
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
    <div className={`p-8 min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            GESTIÓN DE PUBLICACIONES
          </h1>
        </div>
        
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}>
          <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <button
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  filter === 'all' 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : `${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`
                }`}
                onClick={() => setFilter('all')}
              >
                Todas
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
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                <span>Nueva Publicación</span>
              </button>
              <button
                onClick={() => setIsYouTubeModalOpen(true)}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <Youtube size={20} />
                <span>Subir a YouTube</span>
              </button>
              <button
                onClick={() => setIsInstagramModalOpen(true)}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <Instagram size={20} />
                <span>Subir a Instagram</span>
              </button>
              <button
                onClick={() => setIsTikTokModalOpen(true)}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all shadow-md hover:shadow-lg text-white ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-black hover:bg-gray-900'
                }`}
              >
                <Music size={20} />
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