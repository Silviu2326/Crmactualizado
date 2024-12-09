import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface ToolCardProps {
  tool: {
    id: string;
    chatId: number;
    name: string;
    icon: React.ElementType;
    description: string;
    gradient: string;
    features: string[];
    comingSoon?: boolean;
  };
  onClick: () => void;
  theme: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick, theme }) => {
  const Icon = tool.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
      layoutId={tool.id}
      className={`p-6 rounded-xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer relative overflow-hidden group`}
      onClick={() => !tool.comingSoon && onClick()}
    >
      {tool.comingSoon && (
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            Próximamente
          </span>
        </div>
      )}
      
      <div className={`p-4 rounded-full bg-gradient-to-r ${tool.gradient} w-16 h-16 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
        {tool.description}
      </p>
      
      <div className="space-y-2">
        {tool.features.map((feature, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {feature}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ToolCard;