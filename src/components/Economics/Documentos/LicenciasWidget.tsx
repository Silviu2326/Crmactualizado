import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FileText, Search, Filter, Plus, Calendar, ChevronDown } from 'lucide-react';
import Table from '../../Common/Table';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import AddLicenciaModal from './AddLicenciaModal';

interface Licencia {
  _id: string;
  nombre: string;
  fechaExpiracion: string;
  estado: 'Activa' | 'Expirada' | 'Suspendida' | 'En Proceso';
  descripcion: string;
  campo: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  status: string;
  results: number;
  data: {
    licenses: Licencia[];
  };
}

const LicenciasWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [licencias, setLicencias] = useState<Licencia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');
  const { theme } = useTheme();

  useEffect(() => {
    fetchLicencias();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const fetchLicencias = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get<ApiResponse>(
        'https://fitoffice2-f70b52bef77e.herokuapp.com/api/licenses',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const licenciasData = response.data.data.licenses || [];
      setLicencias(licenciasData);
    } catch (error) {
      console.error('Error al obtener licencias:', error);
      setLicencias([]);
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

  const filteredLicencias = useMemo(() => {
    return licencias.filter(licencia => {
      const matchesSearch = licencia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          licencia.campo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          licencia.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (selectedFilter === 'todos') return matchesSearch;
      return matchesSearch && licencia.estado === selectedFilter;
    });
  }, [licencias, searchTerm, selectedFilter]);

  const handleAddLicencia = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-grow">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
            Licencias
          </h3>
          <input
            type="text"
            placeholder="Buscar licencias..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full pl-4 pr-10 py-2 rounded-full ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
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
                {['todos', 'Activa', 'Expirada', 'Suspendida', 'En Proceso'].map((estado) => (
                  <button
                    key={estado}
                    onClick={() => handleFilterSelect(estado)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      theme === 'dark'
                        ? 'text-gray-200 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    } ${selectedFilter === estado ? 'bg-purple-100 text-purple-600' : ''}`}
                  >
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <Button variant="create" onClick={handleAddLicencia}>
          <Plus className="w-4 h-4 mr-1" />
          Añadir
        </Button>
      </div>
      {isLoading ? (
        <div className={`text-center py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Cargando licencias...
        </div>
      ) : filteredLicencias.length === 0 ? (
        <div className={`text-center py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          No hay licencias disponibles
        </div>
      ) : (
        <Table
          headers={['Nombre', 'Fecha de Expiración', 'Estado']}
          data={filteredLicencias.map(licencia => ({
            Nombre: licencia.nombre,
            'Fecha de Expiración': (
              <div className="flex items-center">
                <Calendar className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                {formatDate(licencia.fechaExpiracion)}
              </div>
            ),
            Estado: (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                licencia.estado === 'Activa' ? 'bg-green-200 text-green-800' :
                licencia.estado === 'En Proceso' ? 'bg-blue-200 text-blue-800' :
                licencia.estado === 'Suspendida' ? 'bg-yellow-200 text-yellow-800' :
                'bg-red-200 text-red-800'
              }`}>
                {licencia.estado}
              </span>
            )
          }))}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      )}
      <AddLicenciaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onLicenciaAdded={fetchLicencias}
      />
    </motion.div>
  );
};

export default LicenciasWidget;
