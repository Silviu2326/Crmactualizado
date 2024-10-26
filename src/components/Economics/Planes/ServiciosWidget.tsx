import React, { useState } from 'react';
import { Package, Search, Filter, Plus } from 'lucide-react';
import Table from '../../common/Table';
import Button from '../../common/Button';
import { useTheme } from '../../../contexts/ThemeContext';

interface Servicio {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
}

const ServiciosWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();

  const servicios: Servicio[] = [
    { id: 1, nombre: "Entrenamiento Personal", precio: 50, categoria: "Fitness" },
    { id: 2, nombre: "Clase de Yoga", precio: 20, categoria: "Bienestar" },
    { id: 3, nombre: "Nutrición Personalizada", precio: 80, categoria: "Salud" },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    console.log('Filtrar servicios');
  };

  const handleAddServicio = () => {
    console.log('Añadir nuevo servicio');
  };

  return (
    <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Servicios</h3>
        <div className={`${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'} p-2 rounded-full`}>
          <Package className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
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
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <Search className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <Button variant="filter" onClick={handleFilter}>
          <Filter className="w-4 h-4" />
        </Button>
        <Button variant="create" onClick={handleAddServicio}>
          <Plus className="w-4 h-4 mr-1" />
          Añadir
        </Button>
      </div>
      <Table
        headers={['Nombre', 'Precio', 'Categoría']}
        data={servicios.map(servicio => ({
          Nombre: servicio.nombre,
          Precio: `${servicio.precio}€`,
          Categoría: servicio.categoria
        }))}
        variant={theme === 'dark' ? 'dark' : 'white'}
      />
    </div>
  );
};

export default ServiciosWidget;