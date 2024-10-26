import React from 'react';
import { User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-md transition-colors duration-200`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold">TrainerHead</h1>
        <div 
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200" 
          onClick={handleProfileClick}
        >
          <User className="w-6 h-6 mr-2" />
          <span>John Doe</span>
        </div>
      </div>
    </header>
  );
};

export default Header;