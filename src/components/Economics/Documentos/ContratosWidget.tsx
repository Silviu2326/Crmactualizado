import React, { useState, useEffect, useMemo } from 'react';
import { FileSignature, Search, Filter, Plus, Eye, Edit2, Trash2, Calendar } from 'lucide-react';
import Table from '../../Common/Table';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import AddDocumentoModal from './AddDocumentoModal';
import EditContratoModal from './EditContratoModal';

interface Contrato {
  _id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'Activo' | 'Finalizado' | 'Cancelado' | 'Pendiente';
  trainer?: string;
  cliente?: string;
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  status: string;
  results: number;
  data: {
    contracts: Contrato[];
  };
}

const ContratosWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    fetchContratos();
  }, []);

  const fetchContratos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get<ApiResponse>(
        'https://fitoffice2-f70b52bef77e.herokuapp.com/api/contracts',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setContratos(response.data.data.contracts);
    } catch (error) {
      console.error('Error al obtener contratos:', error);
      setError('Error al cargar los contratos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setIsFilterOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredContratos = useMemo(() => {
    return contratos.filter(contrato => {
      const matchesSearch = contrato.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contrato.notas?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (selectedFilter === 'todos') return matchesSearch;
      return matchesSearch && contrato.estado === selectedFilter;
    });
  }, [contratos, searchTerm, selectedFilter]);

  const getStatusColor = (estado: Contrato['estado']) => {
    switch (estado) {
      case 'Activo':
        return theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-200 text-green-800';
      case 'Pendiente':
        return theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-200 text-yellow-800';
      case 'Cancelado':
        return theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-200 text-red-800';
      case 'Finalizado':
        return theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800';
      default:
        return theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800';
    }
  };

  const handleView = async (contrato: Contrato) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/contracts/${contrato._id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', contrato.nombre);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error al descargar el contrato:', err);
      setError('Error al descargar el contrato');
    }
  };

  const handleEdit = (contrato: Contrato) => {
    setSelectedContrato(contrato);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (contratoId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este contrato?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/contracts/${contratoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setContratos(contratos.filter(contrato => contrato._id !== contratoId));
    } catch (err) {
      console.error('Error al eliminar el contrato:', err);
      setError('Error al eliminar el contrato');
    }
  };

  if (isLoading) {
    return (
      <div className={`text-center py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        Cargando contratos...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
        {error}
      </div>
    );
  }

  return (
    <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-md`}>
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-grow">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
            Contratos
          </h3>
          <input
            type="text"
            placeholder="Buscar contratos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full pl-4 pr-10 py-2 rounded-full ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
          />
          <Search className={`absolute right-3 top-[50%] transform translate-y-[-50%] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <div className="relative">
          <Button variant="filter" onClick={handleFilter}>
            <Filter className="w-4 h-4" />
          </Button>
          {isFilterOpen && (
            <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } ring-1 ring-black ring-opacity-5 z-50`}>
              <div className="py-1">
                {['todos', 'Activo', 'Pendiente', 'Finalizado', 'Cancelado'].map((estado) => (
                  <button
                    key={estado}
                    onClick={() => handleFilterSelect(estado)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      theme === 'dark'
                        ? 'text-gray-200 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    } ${selectedFilter === estado ? 'bg-blue-100 text-blue-600' : ''}`}
                  >
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            theme === 'dark' ? 'focus:ring-offset-gray-800' : ''
          }`}
        >
          <Plus className="w-4 h-4 mr-1" />
          Añadir
        </motion.button>
      </div>
      {filteredContratos.length === 0 ? (
        <div className={`text-center py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          No hay contratos disponibles
        </div>
      ) : (
        <Table
          headers={['Nombre', 'Fecha de Inicio', 'Fecha de Fin', 'Estado', 'Acciones']}
          data={filteredContratos.map(contrato => ({
            Nombre: (
              <div className="flex items-center">
                <FileSignature className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                {contrato.nombre}
              </div>
            ),
            'Fecha de Inicio': (
              <div className="flex items-center">
                <Calendar className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                {formatDate(contrato.fechaInicio)}
              </div>
            ),
            'Fecha de Fin': (
              <div className="flex items-center">
                <Calendar className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                {formatDate(contrato.fechaFin)}
              </div>
            ),
            Estado: (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(contrato.estado)}`}>
                {contrato.estado}
              </span>
            ),
            Acciones: (
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleView(contrato)}
                  className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                  }`}
                  title="Ver contrato"
                >
                  <Eye size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEdit(contrato)}
                  className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                  }`}
                  title="Modificar"
                >
                  <Edit2 size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(contrato._id)}
                  className={`p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors ${
                    theme === 'dark' ? 'text-red-400' : 'text-red-600'
                  }`}
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            )
          }))}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      )}
      <AddDocumentoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onDocumentoAdded={fetchContratos}
      />
      {selectedContrato && (
        <EditContratoModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          contrato={selectedContrato}
          onContratoUpdated={fetchContratos}
        />
      )}
    </div>
  );
};

export default ContratosWidget;
