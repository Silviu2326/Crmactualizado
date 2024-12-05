import React, { useState, useEffect, useMemo } from 'react';
import { File, Search, Filter, Plus, Calendar, Loader2, AlertCircle } from 'lucide-react';
import Table from '../../Common/Table';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import AddDocumentoModal from './AddDocumentoModal';

interface Trainer {
  _id: string;
  nombre: string;
  email: string;
}

interface OtroDocumento {
  _id: string;
  nombre: string;
  tipo: string;
  fechaCreacion: string;
  fechaFinalizacion?: string;
  trainer?: Trainer;
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  status: string;
  results: number;
  data: {
    documentos: OtroDocumento[];
  };
}

const OtrosDocumentosWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<string>('');
  const [documentos, setDocumentos] = useState<OtroDocumento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useTheme();

  const fetchDocumentos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<ApiResponse>('http://localhost:3000/api/otros-documentos', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.status === 'success' && Array.isArray(response.data.data.documentos)) {
        setDocumentos(response.data.data.documentos);
      } else {
        setDocumentos([]);
      }
      setError('');
    } catch (err) {
      setError('Error al cargar los documentos');
      console.error('Error fetching documentos:', err);
      setDocumentos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const filteredDocumentos = useMemo(() => {
    if (!Array.isArray(documentos)) return [];
    
    return documentos.filter(doc => {
      if (!doc) return false;
      
      const matchesSearch = 
        doc.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.notas?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      const matchesTipo = !tipoFilter || doc.tipo === tipoFilter;
      
      return matchesSearch && matchesTipo;
    });
  }, [documentos, searchTerm, tipoFilter]);

  const tiposUnicos = useMemo(() => {
    if (!Array.isArray(documentos)) return [];
    return Array.from(new Set(documentos.map(doc => doc.tipo).filter(Boolean)));
  }, [documentos]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    const nextTipo = tiposUnicos[(tiposUnicos.indexOf(tipoFilter) + 1) % (tiposUnicos.length + 1)];
    setTipoFilter(nextTipo || '');
  };

  const handleAddDocumento = () => {
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center p-4 rounded-lg ${
        theme === 'dark' ? 'bg-red-900/20 text-red-200' : 'bg-red-100 text-red-800'
      }`}>
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-grow">
            <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
              Otros Documentos {tipoFilter && `- ${tipoFilter}`}
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className={`w-full pl-10 pr-4 py-2 rounded-full ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                } border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300`}
              />
              <Search className={`absolute left-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
            </div>
          </div>
          <Button 
            variant="filter" 
            onClick={handleFilter}
            className={tipoFilter ? 'bg-orange-500 text-white' : ''}
          >
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="create" onClick={handleAddDocumento}>
            <Plus className="w-4 h-4 mr-1" />
            Añadir
          </Button>
        </div>
        
        {filteredDocumentos.length === 0 ? (
          <div className={`text-center p-8 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
          }`}>
            No se encontraron documentos
          </div>
        ) : (
          <Table
            headers={['Nombre', 'Tipo', 'Fecha de Creación', 'Trainer', 'Notas']}
            data={filteredDocumentos.map(doc => ({
              Nombre: (
                <div className="flex items-center">
                  <File className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
                  {doc.nombre}
                </div>
              ),
              Tipo: (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  doc.tipo === 'Legal' ? 'bg-blue-200 text-blue-800' :
                  doc.tipo === 'RRHH' ? 'bg-green-200 text-green-800' :
                  doc.tipo === 'Procedimiento' ? 'bg-purple-200 text-purple-800' :
                  'bg-yellow-200 text-yellow-800'
                }`}>
                  {doc.tipo}
                </span>
              ),
              'Fecha de Creación': (
                <div className="flex items-center">
                  <Calendar className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
                  {formatDate(doc.fechaCreacion)}
                </div>
              ),
              'Trainer': doc.trainer ? (
                <div className="text-sm">
                  {doc.trainer.nombre}
                </div>
              ) : (
                <span className="text-gray-400">-</span>
              ),
              'Notas': doc.notas ? (
                <div className="max-w-xs truncate">
                  {doc.notas}
                </div>
              ) : (
                <span className="text-gray-400">-</span>
              )
            }))}
            variant={theme === 'dark' ? 'dark' : 'white'}
          />
        )}
      </motion.div>

      <AddDocumentoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDocumentoAdded={fetchDocumentos}
      />
    </>
  );
};

export default OtrosDocumentosWidget;
