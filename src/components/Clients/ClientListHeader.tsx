import React from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  Trash,
  Download,
  Share2,
  Plus,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../Common/Button';
import FilterPanel from './FilterPanel';

interface Filters {
  estado: string;
  tag: string;
  tipoPlan: string;
  clase: string;
  servicio: string;
}

interface ClientListHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  selectedClientsCount: number;
  viewMode: 'table' | 'simple';
  setViewMode: (mode: 'table' | 'simple') => void;
}

const ClientListHeader: React.FC<ClientListHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  filterOpen,
  setFilterOpen,
  filters,
  setFilters,
  selectedClientsCount,
  viewMode,
  setViewMode,
}) => {
  const { theme } = useTheme();

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('simple')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'simple'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          <Button
             variant="filter"            
             onClick={() => setFilterOpen(!filterOpen)}
             className="flex items-center"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filtros
          </Button>

          <Button variant="create" className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {filterOpen && <FilterPanel filters={filters} setFilters={setFilters} />}

      {selectedClientsCount > 0 && (
        <div
          className={`flex items-center justify-between p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
          }`}
        >
          <span className="text-sm font-medium">
            {selectedClientsCount} cliente{selectedClientsCount !== 1 && 's'}{' '}
            seleccionado{selectedClientsCount !== 1 && 's'}
          </span>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm" className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button variant="secondary" size="sm" className="flex items-center">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
            <Button variant="danger" size="sm" className="flex items-center">
              <Trash className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientListHeader;
