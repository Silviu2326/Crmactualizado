import React from 'react';
import { motion } from 'framer-motion';
import LicenciasWidget from './LicenciasWidget';
import ContratosWidget from './ContratosWidget';
import OtrosDocumentosWidget from './OtrosDocumentosWidget';
import AlertasLicenciasWidget from './AlertasLicenciasWidget';
import { useTheme } from '../../../contexts/ThemeContext';
import { FileText, FileSignature, File, AlertTriangle } from 'lucide-react';

const DocumentosPage: React.FC = () => {
  const { theme } = useTheme();

  const stats = {
    licencias: 15,
    contratos: 23,
    otrosDocumentos: 42
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const StatCard = ({ title, value, icon: Icon }) => (
    <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md flex items-center space-x-4`}>
      <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'}`}>
        <Icon className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} />
      </div>
      <div>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={`p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
    >
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
        Gestión de Documentos
      </h2>

      {/* Mini sección de estadísticas */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatCard title="Total Licencias" value={stats.licencias} icon={FileText} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Total Contratos" value={stats.contratos} icon={FileSignature} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Otros Documentos" value={stats.otrosDocumentos} icon={File} />
        </motion.div>
      </motion.div>

      {/* AlertasLicenciasWidget con diseño mejorado */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg mb-8`}
      >
        <div className="flex items-center mb-4">
          <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-yellow-800' : 'bg-yellow-200'} mr-4`}>
            <AlertTriangle className={`w-6 h-6 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`} />
          </div>
          <h3 className="text-2xl font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text">
            Alertas de Licencias
          </h3>
        </div>
        <AlertasLicenciasWidget />
      </motion.div>

      {/* Otros widgets */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <motion.div variants={itemVariants} className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
          <LicenciasWidget />
        </motion.div>
        <motion.div variants={itemVariants} className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
          <ContratosWidget />
        </motion.div>
        <motion.div variants={itemVariants} className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
          <OtrosDocumentosWidget />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DocumentosPage;
