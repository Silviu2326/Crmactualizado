import React, { useState } from 'react';
import { Package, Search, Filter, Plus } from 'lucide-react';
import Table from '../common/Table';
import Button from '../common/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface Servicio {
  id: number;
  nombre: string;
  ingresos: number;
}

interface ServiciosWidgetProps {
  servicios: Servicio[];
  isEditMode: boolean;
  onRemove: () => void;
}

const ServiciosWidget: React.FC<ServiciosWidgetProps> = ({
  servicios,
  isEditMode,
  onRemove,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();
  const totalIngresos = servicios.reduce(
    (sum, servicio) => sum + servicio.ingresos,
    0
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    // Implementar lógica de filtrado
    console.log('Filtrar servicios');
  };

  const handleCreate = () => {
    // Implementar lógica para crear nuevo servicio
    console.log('Crear nuevo servicio');
  };

  return (
    <div
      className={`p-4 h-full flex flex-col justify-between ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-pink-50 text-gray-800'
      } rounded-lg`}
    >
      {isEditMode && (
        <button
          onClick={onRemove}
          className={`absolute top-2 right-2 ${
            theme === 'dark'
              ? 'text-pink-400 hover:text-pink-300'
              : 'text-pink-500 hover:text-pink-700'
          } bg-white rounded-full p-1 shadow-md`}
        >
          <Package className="w-4 h-4" />
        </button>
      )}
      <div className="flex items-center justify-between mb-2">
        <h3
          className={`text-sm font-semibold ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          Servicios
        </h3>
        <div
          className={`${
            theme === 'dark' ? 'bg-pink-900' : 'bg-pink-100'
          } p-2 rounded-full`}
        >
          <Package
            className={`w-5 h-5 ${
              theme === 'dark' ? 'text-pink-400' : 'text-pink-500'
            }`}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full px-3 py-2 border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-800'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500`}
          />
          <Search
            className={`absolute right-3 top-2.5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}
          />
        </div>
        <Button variant="filter" onClick={handleFilter}>
          <Filter className="w-4 h-4" />
        </Button>
        <Button variant="create" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-1" />
          Crear
        </Button>
      </div>
      <div className="flex-grow overflow-auto custom-scrollbar">
        <Table
          headers={['Servicio', 'Ingresos']}
          data={servicios.map((servicio) => ({
            Servicio: servicio.nombre,
            Ingresos: servicio.ingresos.toLocaleString('es-ES', {
              style: 'currency',
              currency: 'EUR',
            }),
          }))}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      </div>
      <div
        className={`text-sm font-semibold mt-2 ${
          theme === 'dark' ? 'text-pink-300' : 'text-pink-600'
        }`}
      >
        Total ingresos:{' '}
        {totalIngresos.toLocaleString('es-ES', {
          style: 'currency',
          currency: 'EUR',
        })}
      </div>
      <div
        className={`text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        } mt-1`}
      >
        {servicios.length} servicios activos
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === 'dark' ? '#2D3748' : '#F7FAFC'};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? '#4A5568' : '#CBD5E0'};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? '#718096' : '#A0AEC0'};
        }
      `}</style>
    </div>
  );
};

export default ServiciosWidget;
