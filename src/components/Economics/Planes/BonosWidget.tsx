import React, { useState } from 'react';
import { Gift, Search, Filter, Plus } from 'lucide-react';
import Table from '../../common/Table';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';

interface Bono {
  id: number;
  nombre: string;
  valor: number;
  estado: 'Activo' | 'Inactivo';
}

const BonosWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();

  const bonos: Bono[] = [
    { id: 1, nombre: "Bono de Bienvenida", valor: 50, estado: "Activo" },
    { id: 2, nombre: "Bono de Referidos", valor: 30, estado: "Activo" },
    { id: 3, nombre: "Bono de Fidelidad", valor: 100, estado: "Inactivo" },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    console.log('Filtrar bonos');
  };

  const handleAddBono = () => {
    console.log('Añadir nuevo bono');
  };

  return (
    <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Bonos</h3>
        <div className={`${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-100'} p-2 rounded-full`}>
          <Gift className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar bonos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full px-3 py-2 border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          <Search className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <Button variant="filter" onClick={handleFilter}>
          <Filter className="w-4 h-4" />
        </Button>
        <Button variant="create" onClick={handleAddBono}>
          <Plus className="w-4 h-4 mr-1" />
          Añadir
        </Button>
      </div>
      <Table
        headers={['Nombre', 'Valor', 'Estado']}
        data={bonos.map(bono => ({
          Nombre: bono.nombre,
          Valor: `${bono.valor}€`,
          Estado: bono.estado
        }))}
        variant={theme === 'dark' ? 'dark' : 'white'}
      />
    </div>
  );
};

export default BonosWidget;