import React from 'react';
import { Users, FileText, UserPlus, Clock } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import MetricCard from './MetricCard';
import BonosWidget from './BonosWidget';
import ClientesWidget from './ClientesWidget';
import ServiciosWidget from './ServiciosWidget';

const PlanesPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
    >
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
        Gestión de Planes
      </h2>
      
      {/* MetricCards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Clientes Actuales" value="+200" icon={<Users className="w-6 h-6 text-blue-500" />} />
        <MetricCard title="Planes Vendidos" value="+150" icon={<FileText className="w-6 h-6 text-green-500" />} />
        <MetricCard title="Nuevos Planes" value="+25" icon={<UserPlus className="w-6 h-6 text-purple-500" />} />
        <MetricCard title="Nuevos Clientes (30 días)" value="+40" icon={<Clock className="w-6 h-6 text-yellow-500" />} />
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4">
            <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">Bonos</h3>
            <BonosWidget />
          </div>
        </motion.div>
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="p-4">
            <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">Clientes</h3>
            <ClientesWidget />
          </div>
        </motion.div>
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="p-4">
            <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-pink-400 to-red-500 text-transparent bg-clip-text">Servicios</h3>
            <ServiciosWidget />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PlanesPage;