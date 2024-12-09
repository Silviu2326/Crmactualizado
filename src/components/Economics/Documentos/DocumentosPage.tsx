import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LicenciasWidget from './LicenciasWidget';
import ContratosWidget from './ContratosWidget';
import OtrosDocumentosWidget from './OtrosDocumentosWidget';
import AlertasLicenciasWidget from './AlertasLicenciasWidget';
import { useTheme } from '../../../contexts/ThemeContext';
import { FileText, FileSignature, File, AlertTriangle, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Stats {
  licencias: number;
  contratos: number;
  otrosDocumentos: number;
}

interface Licencia {
  id: number;
  nombre: string;
  fechaExpiracion: string;
  estado: 'Activa' | 'Expirada' | 'Por renovar';
}

const DocumentosPage: React.FC = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState<Stats>({
    licencias: 0,
    contratos: 0,
    otrosDocumentos: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`
        };

        const [licenciasRes, contratosRes, documentosRes] = await Promise.all([
          axios.get('https://fitoffice2-f70b52bef77e.herokuapp.com/api/licenses', { headers }),
          axios.get('https://fitoffice2-f70b52bef77e.herokuapp.com/api/contracts', { headers }),
          axios.get('https://fitoffice2-f70b52bef77e.herokuapp.com/api/otros-documentos', { headers })
        ]);

        setStats({
          licencias: licenciasRes.data.results || licenciasRes.data.data?.licencias?.length || 0,
          contratos: contratosRes.data.results || contratosRes.data.data?.contratos?.length || 0,
          otrosDocumentos: documentosRes.data.results || documentosRes.data.data?.documentos?.length || 0
        });
      } catch (err) {
        console.error('Error al cargar estadísticas:', err);
        setError('Error al cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  const StatCard = ({ title, value, icon: Icon, loading = false }) => (
    <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md flex items-center space-x-4`}>
      <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'} mr-4`}>
        <Icon className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} />
      </div>
      <div>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
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

      {error && (
        <div className={`mb-4 p-4 rounded-lg text-center ${
          theme === 'dark' ? 'bg-red-900/20 text-red-200' : 'bg-red-100 text-red-800'
        }`}>
          {error}
        </div>
      )}

      {/* Mini sección de estadísticas */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatCard title="Total Licencias" value={stats.licencias} icon={FileText} loading={loading} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Total Contratos" value={stats.contratos} icon={FileSignature} loading={loading} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Otros Documentos" value={stats.otrosDocumentos} icon={File} loading={loading} />
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

      {/* Grid de widgets principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
          <LicenciasWidget />
        </div>
        <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
          <ContratosWidget />
        </div>
        <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
          <OtrosDocumentosWidget />
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentosPage;
