import React from 'react';
import { Instagram, Youtube, Music, Plus } from 'lucide-react';

interface Publication {
  id: number;
  title: string;
  date: string;
  status: string;
  platform: string;
}

interface GridViewProps {
  publications: Publication[];
  getStatusBadge: (status: string) => JSX.Element;
}

const GridView: React.FC<GridViewProps> = ({ publications, getStatusBadge }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {publications.map((pub) => (
        <div key={pub.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all hover:scale-[1.02]">
          {getStatusBadge(pub.status)}
          <h3 className="text-lg font-semibold mt-4 text-gray-900 dark:text-white">{pub.title}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{pub.date}</p>
          <div className="flex justify-between items-center mt-4">
            {pub.platform === 'instagram' && <Instagram className="text-pink-500 dark:text-pink-400" size={24} />}
            {pub.platform === 'youtube' && <Youtube className="text-red-500 dark:text-red-400" size={24} />}
            {pub.platform === 'tiktok' && <Music className="text-gray-900 dark:text-white" size={24} />}
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Plus size={16} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridView;