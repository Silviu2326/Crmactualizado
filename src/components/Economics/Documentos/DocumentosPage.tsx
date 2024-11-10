import React from 'react';
import { motion } from 'framer-motion';
import LicenciasWidget from './LicenciasWidget';
import ContratosWidget from './ContratosWidget';
import OtrosDocumentosWidget from './OtrosDocumentosWidget';
import AlertasLicenciasWidget from './AlertasLicenciasWidget';
import { useTheme } from '../../../contexts/ThemeContext';
import { FileText, FileSignature, File, AlertTriangle, BarChart2 } from 'lucide-react';

const DocumentosPage: React.FC = () => {
  const { theme } = useTheme();

  // Datos de ejemplo para las estadísticas
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
    visible: {
      y: 0,
      opacity: 1
    }
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

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <motion.div
          variants={itemVariants}
          className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1`}
        >
          <div className="flex items-center mb-4">
            <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'} mr-4`}>
              <FileText className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} />
            </div>
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">Licencias</h3>
          </div>
          <LicenciasWidget />
        </motion.div>
        <motion.div
          variants={itemVariants}
          className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1`}
        >
          <div className="flex items-center mb-4">
            <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-green-900' : 'bg-green-100'} mr-4`}>
              <FileSignature className={`w-6 h-6 ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`} />
            </div>
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text">Contratos</h3>
          </div>
          <ContratosWidget />
        </motion.div>
        <motion.div
          variants={itemVariants}
          className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1`}
        >
          <div className="flex items-center mb-4">
            <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-100'} mr-4`}>
              <File className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`} />
            </div>
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">Otros Documentos</h3>
          </div>
          <OtrosDocumentosWidget />
        </motion.div>
        <motion.div
          variants={itemVariants}
          className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1`}
        >
          <div className="flex items-center mb-4">
            <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-yellow-900' : 'bg-yellow-100'} mr-4`}>
              <AlertTriangle className={`w-6 h-6 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`} />
            </div>
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text">Alertas de Licencias</h3>
          </div>
          <AlertasLicenciasWidget />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DocumentosPage;