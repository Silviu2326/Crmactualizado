import React, { useState } from 'react';
import ClientList from '../components/Clients/ClientList';
import CalendarioLista from '../components/Clients/CalendarioLista';
import CuestionariosLista from '../components/Clients/CuestionariosLista';
import { Users, Calendar, ClipboardList, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/Common/Button';

const ClientsPage: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'clientes' | 'cuestionarios' | 'calendario'>('clientes');

  const tabs = [
    { id: 'clientes', label: 'Clientes', icon: Users, color: 'from-blue-500 to-indigo-500' },
    { id: 'cuestionarios', label: 'Cuestionarios', icon: ClipboardList, color: 'from-purple-500 to-pink-500' },
    { id: 'calendario', label: 'Calendario', icon: Calendar, color: 'from-amber-500 to-orange-500' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        type: "spring",
        stiffness: 150,
        damping: 15
      }
    })
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className={`container mx-auto px-4 py-8 min-h-screen ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <motion.div 
        variants={contentVariants}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <LayoutDashboard className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Gestión de Clientes
              </h1>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Administra y organiza toda la información de tus clientes
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="flex justify-center md:justify-end space-x-3 overflow-x-auto scrollbar-thin pb-2">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  custom={index}
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex items-center px-5 py-3 rounded-full font-medium transition-all duration-300 ${
                    isActive 
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform hover:scale-105` 
                      : `${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'} hover:bg-opacity-90`
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-2 ${
                    isActive ? 'animate-bounce' : ''
                  }`} />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={contentVariants}
          className={`rounded-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg p-6`}
        >
          {activeTab === 'clientes' && <ClientList />}
          {activeTab === 'cuestionarios' && <CuestionariosLista />}
          {activeTab === 'calendario' && <CalendarioLista />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ClientsPage;
