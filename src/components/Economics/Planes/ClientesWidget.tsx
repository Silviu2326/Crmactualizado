import React, { useState } from 'react';
import { Users, Search, Filter, Plus } from 'lucide-react';
import Table from '../../common/Table';
import Button from '../../common/Button';
import { useTheme } from '../../../contexts/ThemeContext';

interface Cliente {
  id: number;
  nombre: string;
  plan: string;
  fechaInicio: string;
}

const ClientesWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();

  const clientes: Cliente[] = [
    { id: 1, nombre: "Juan Pérez", plan: "Premium", fechaInicio: "2023-01-15" },
    { id: 2, nombre: "María García", plan: "Básico", fechaInicio: "2023-02-01" },
    { id: 3, nombre: "Carlos López", plan: "Estándar", fechaInicio: "2023-03-10" },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    console.log('Filtrar clientes');
  };

  const handleAddCliente = () => {
    console.log('Añadir nuevo cliente');
  };

  return (
    <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Clientes</h3>
        <div className={`${theme === 'dark' ? 'bg-green-900' : 'bg-green-100'} p-2 rounded-full`}>
          <Users className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full px-3 py-2 border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          <Search className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <Button variant="filter" onClick={handleFilter}>
          <Filter className="w-4 h-4" />
        </Button>
        <Button variant="create" onClick={handleAddCliente}>
          <Plus className="w-4 h-4 mr-1" />
          Añadir
        </Button>
      </div>
      <Table
        headers={['Nombre', 'Plan', 'Fecha de Inicio']}
        data={clientes.map(cliente => ({
          Nombre: cliente.nombre,
          Plan: cliente.plan,
          'Fecha de Inicio': cliente.fechaInicio
        }))}
        variant={theme === 'dark' ? 'dark' : 'white'}
      />
    </div>
  );
};

export default ClientesWidget;