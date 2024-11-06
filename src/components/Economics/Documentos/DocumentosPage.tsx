import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LicenciasWidget from './LicenciasWidget';
import ContratosWidget from './ContratosWidget';
import OtrosDocumentosWidget from './OtrosDocumentosWidget';
import AlertasLicenciasWidget from './AlertasLicenciasWidget';
import DocumentoPopup from '../../modals/DocumentoPopup';
import { useTheme } from '../../../contexts/ThemeContext';
import { FileText, FileSignature, File } from 'lucide-react';

const DocumentosPage: React.FC = () => {
  const { theme } = useTheme();

  // Estado para controlar el popup
  const [isDocumentoPopupOpen, setIsDocumentoPopupOpen] = useState(false);
  const [selectedDocumentoType, setSelectedDocumentoType] = useState<
    'licencia' | 'contrato' | 'otro' | null
  >(null);

  // Funciones para manejar el popup
  const openDocumentoPopup = (tipo: 'licencia' | 'contrato' | 'otro') => {
    setSelectedDocumentoType(tipo);
    setIsDocumentoPopupOpen(true);
  };

  const closeDocumentoPopup = () => {
    setIsDocumentoPopupOpen(false);
    setSelectedDocumentoType(null);
  };

  const handleDocumentoSubmit = (formData: any) => {
    // Manejar los datos del formulario según el tipo de documento
    switch (selectedDocumentoType) {
      case 'licencia':
        // Procesar datos para licencia
        console.log('Procesando licencia:', formData);
        break;
      case 'contrato':
        // Procesar datos para contrato
        console.log('Procesando contrato:', formData);
        break;
      case 'otro':
        // Procesar datos para otro tipo de documento
        console.log('Procesando otro documento:', formData);
        break;
      default:
        break;
    }

    // Cerrar el popup después de procesar
    closeDocumentoPopup();
  };

  // Definición de variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  // Datos de ejemplo para las estadísticas
  const stats = {
    licencias: 15,
    contratos: 23,
    otrosDocumentos: 42,
  };

  // Componente interno para las tarjetas de estadísticas
  const StatCard = ({
    title,
    value,
    icon: Icon,
  }: {
    title: string;
    value: string;
    icon: React.ElementType;
  }) => (
    <div
      className={`p-4 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } rounded-lg shadow-md flex items-center space-x-4`}
    >
      <div
        className={`p-3 rounded-full ${
          theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'
        }`}
      >
        <Icon
          className={`w-6 h-6 ${
            theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
          }`}
        />
      </div>
      <div>
        <p
          className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {title}
        </p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{
        type: 'tween',
        ease: 'anticipate',
        duration: 0.5,
      }}
      className={`p-6 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
      }`}
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
          <StatCard
            title="Total Licencias"
            value={stats.licencias.toString()}
            icon={FileText}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Contratos"
            value={stats.contratos.toString()}
            icon={FileSignature}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Otros Documentos"
            value={stats.otrosDocumentos.toString()}
            icon={File}
          />
        </motion.div>
      </motion.div>

      {/* Widgets */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <motion.div
          variants={itemVariants}
          className={`p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1`}
        >
          {/* Licencias Widget */}
          <LicenciasWidget onAddDocumento={() => openDocumentoPopup('licencia')} />
        </motion.div>
        <motion.div
          variants={itemVariants}
          className={`p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1`}
        >
          {/* Contratos Widget */}
          <ContratosWidget onAddDocumento={() => openDocumentoPopup('contrato')} />
        </motion.div>
        <motion.div
          variants={itemVariants}
          className={`p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1`}
        >
          {/* Otros Documentos Widget */}
          <OtrosDocumentosWidget onAddDocumento={() => openDocumentoPopup('otro')} />
        </motion.div>
        <motion.div
          variants={itemVariants}
          className={`p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1`}
        >
          {/* Alertas Licencias Widget */}
          <AlertasLicenciasWidget onAddDocumento={() => openDocumentoPopup('otro')} />
        </motion.div>
        {/* Agrega aquí otros widgets según tus necesidades */}
      </motion.div>

      {/* Renderizar DocumentoPopup */}
      {isDocumentoPopupOpen && selectedDocumentoType && (
        <DocumentoPopup
          isOpen={isDocumentoPopupOpen}
          onClose={closeDocumentoPopup}
          onSubmit={handleDocumentoSubmit}
          tipoDocumento={selectedDocumentoType}
        />
      )}
    </motion.div>
  );
};

export default DocumentosPage;
