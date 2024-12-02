import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../Common/Button';

interface InfoItemProps {
  icon: LucideIcon;
  text: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, text }) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center space-x-3 group">
      <div className={`
        p-2 rounded-lg transition-colors duration-200
        ${theme === 'dark' ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700'}
      `}>
        <Icon className="w-5 h-5" />
      </div>
      <span className={`
        transition-colors duration-200
        ${theme === 'dark' ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'}
      `}>
        {text}
      </span>
    </div>
  );
};

interface InfoCardProps {
  title: string;
  items: Array<{ icon: LucideIcon; text: string }>;
  delay?: number;
  actionButton?: {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    className?: string;
  };
  titleButton?: {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    className?: string;
  };
}

const InfoCard: React.FC<InfoCardProps> = ({ title, items, delay = 0, actionButton, titleButton }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`
        ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white hover:bg-gray-50'}
        p-6 rounded-xl shadow-lg backdrop-blur-sm
        transform transition-all duration-300
        border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}
      `}
    >
      <div className={`
        flex justify-between items-center mb-4 pb-2
        border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
      `}>
        <h4 className="text-lg font-semibold">
          {title}
        </h4>
        {titleButton && (
          <Button
            variant="create"
            onClick={titleButton.onClick}
            className={`px-3 py-1.5 text-sm ${titleButton.className || 'bg-green-500 hover:bg-green-600 text-white'}`}
          >
            <titleButton.icon className="w-4 h-4 mr-2" />
            <span>{titleButton.label}</span>
          </Button>
        )}
      </div>
      <div className="space-y-4 mb-4">
        {items.map((item, index) => (
          <InfoItem key={index} icon={item.icon} text={item.text} />
        ))}
      </div>
      {actionButton && (
        <Button
          variant="create"
          onClick={actionButton.onClick}
          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 
            hover:from-blue-600 hover:to-blue-700 text-white
            transform transition-all duration-300 hover:scale-105"
        >
          <actionButton.icon className="w-4 h-4 mr-2" />
          <span>{actionButton.label}</span>
        </Button>
      )}
    </motion.div>
  );
};

export default InfoCard;