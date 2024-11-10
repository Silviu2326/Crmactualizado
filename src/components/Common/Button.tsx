import React, { ButtonHTMLAttributes } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

type ButtonVariant = 'filter' | 'create' | 'normal' | 'danger' | 'warning' | 'success';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'normal', 
  children, 
  className = '', 
  ...props 
}) => {
  const { theme } = useTheme();
  
  const baseStyles = 'px-4 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const getVariantStyles = () => {
    const darkModeStyles = {
      filter: 'bg-gradient-to-r from-red-900 to-pink-900 hover:from-red-950 hover:to-pink-950 text-white focus:ring-pink-700',
      create: 'bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-950 hover:to-indigo-950 text-white focus:ring-purple-700',
      normal: 'bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-950 hover:to-blue-900 text-white focus:ring-blue-700',
      danger: 'bg-gradient-to-r from-red-800 to-red-700 hover:from-red-900 hover:to-red-800 text-white focus:ring-red-600',
      warning: 'bg-gradient-to-r from-yellow-700 to-amber-700 hover:from-yellow-800 hover:to-amber-800 text-white focus:ring-yellow-600',
      success: 'bg-gradient-to-r from-green-800 to-emerald-800 hover:from-green-900 hover:to-emerald-900 text-white focus:ring-green-600'
    };

    const lightModeStyles = {
      filter: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white focus:ring-pink-400',
      create: 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white focus:ring-purple-400',
      normal: 'bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white focus:ring-blue-400',
      danger: 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white focus:ring-red-400',
      warning: 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white focus:ring-yellow-400',
      success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white focus:ring-green-400'
    };

    return theme === 'dark' ? darkModeStyles[variant] : lightModeStyles[variant];
  };

  const combinedClassName = `${baseStyles} ${getVariantStyles()} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;