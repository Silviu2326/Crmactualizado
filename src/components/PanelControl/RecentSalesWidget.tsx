import React, { useState } from 'react';
import Table from '../common/Table';
import Button from '../common/Button';
import { Search, Filter } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const RecentSalesWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();

  const salesData = [
    { Estado: 'Completado', 'Correo Electrónico': 'cliente1@example.com', Dinero: '100€' },
    { Estado: 'Pendiente', 'Correo Electrónico': 'cliente2@example.com', Dinero: '150€' },
    { Estado: 'Completado', 'Correo Electrónico': 'cliente3@example.com', Dinero: '200€' },
    { Estado: 'Cancelado', 'Correo Electrónico': 'cliente4@example.com', Dinero: '75€' },
    { Estado: 'Completado', 'Correo Electrónico': 'cliente5@example.com', Dinero: '180€' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    // Implementar lógica de filtrado aquí
    console.log('Filtrar ventas recientes');
  };

  return (
    <div className={`h-full flex flex-col p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <h3 className="text-lg font-semibold mb-4">Ventas Recientes</h3>
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar ventas..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full px-3 py-2 pr-10 border ${
              theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-800'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <Search className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <Button variant="filter" onClick={handleFilter}>
          <Filter className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex-grow overflow-auto">
        <Table
          headers={['Estado', 'Correo Electrónico', 'Dinero']}
          data={salesData}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      </div>
    </div>
  );
};

export default RecentSalesWidget;