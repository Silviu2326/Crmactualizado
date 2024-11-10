import React, { useState } from 'react';
import { Search, Plus, Calendar, List, Grid, Instagram, Youtube, Music } from 'lucide-react';
import NewPublicationModal from '../components/modals/NewPublicationModal';
import YouTubeModal from '../components/modals/YouTubeModal';
import InstagramModal from '../components/modals/InstagramModal';
import TikTokModal from '../components/modals/TikTokModal';
import GridView from '../components/views/GridView';
import ListView from '../components/views/ListView';
import CalendarView from '../components/views/CalendarView';

const Publications: React.FC = () => {
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
      scheduled: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
    const labels = {
      scheduled: 'Programada',
      published: 'Publicada',
      pending: 'En Cola'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${badges[status as keyof typeof badges]}`}>
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
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          GESTIÓN DE PUBLICACIONES
        </h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <button
              className={`px-4 py-2 rounded-full transition-all duration-200 ${
                filter === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
              onClick={() => setFilter('all')}
            >
              Todas
            </button>
            <button
              className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center space-x-2 ${
                filter === 'instagram' 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
              onClick={() => setFilter('instagram')}
            >
              <Instagram size={16} />
              <span>Instagram</span>
            </button>
            <button
              className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center space-x-2 ${
                filter === 'tiktok' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
              onClick={() => setFilter('tiktok')}
            >
              <Music size={16} />
              <span>TikTok</span>
            </button>
            <button
              className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center space-x-2 ${
                filter === 'youtube' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
              onClick={() => setFilter('youtube')}
            >
              <Youtube size={16} />
              <span>YouTube</span>
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar publicaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setIsNewPublicationModalOpen(true)}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              <span>Nueva Publicación</span>
            </button>
            <button
              onClick={() => setIsYouTubeModalOpen(true)}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
            >
              <Youtube size={20} />
              <span>Subir a YouTube</span>
            </button>
            <button
              onClick={() => setIsInstagramModalOpen(true)}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
            >
              <Instagram size={20} />
              <span>Subir a Instagram</span>
            </button>
            <button
              onClick={() => setIsTikTokModalOpen(true)}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-all shadow-md hover:shadow-lg dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <Music size={20} />
              <span>Subir a TikTok</span>
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded transition-colors ${
                  view === 'grid' 
                    ? 'bg-white dark:bg-gray-600 text-blue-500' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded transition-colors ${
                  view === 'list' 
                    ? 'bg-white dark:bg-gray-600 text-blue-500' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`p-2 rounded transition-colors ${
                  view === 'calendar' 
                    ? 'bg-white dark:bg-gray-600 text-blue-500' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <Calendar size={20} />
              </button>
            </div>
            <select className="px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Todos los Estados</option>
              <option>Programadas</option>
              <option>Publicadas</option>
              <option>En Cola</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-8">
        {renderView()}
      </div>

      <NewPublicationModal
        isOpen={isNewPublicationModalOpen}
        onClose={() => setIsNewPublicationModalOpen(false)}
      />
      <YouTubeModal
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
      />
      <InstagramModal
        isOpen={isInstagramModalOpen}
        onClose={() => setIsInstagramModalOpen(false)}
      />
      <TikTokModal
        isOpen={isTikTokModalOpen}
        onClose={() => setIsTikTokModalOpen(false)}
      />
    </div>
  );
};

export default Publications;