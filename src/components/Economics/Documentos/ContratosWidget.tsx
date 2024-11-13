import React, { useState } from 'react';
import { FileSignature, Search, Filter, Plus, Calendar } from 'lucide-react';
import Table from '../../Common/Table';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';

interface Contrato {
  id: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'Activo' | 'Finalizado' | 'En revisión';
}

const ContratosWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();

  const contratos: Contrato[] = [
    { id: 1, nombre: "Contrato de Arrendamiento", fechaInicio: "2023-01-01", fechaFin: "2024-12-31", estado: "Activo" },
    { id: 2, nombre: "Contrato de Servicios", fechaInicio: "2023-03-15", fechaFin: "2023-09-15", estado: "En revisión" },
    { id: 3, nombre: "Contrato de Mantenimiento", fechaInicio: "2022-06-01", fechaFin: "2023-05-31", estado: "Finalizado" },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    console.log('Filtrar contratos');
  };

  const handleAddContrato = () => {
    console.log('Añadir nuevo contrato');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar contratos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full px-4 py-2 rounded-full ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } border focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300`}
          />
          <Search className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <Button variant="filter" onClick={handleFilter}>
          <Filter className="w-4 h-4" />
        </Button>
        <Button variant="create" onClick={handleAddContrato}>
          <Plus className="w-4 h-4 mr-1" />
          Añadir
        </Button>
      </div>
      <Table
        headers={['Nombre', 'Fecha de Inicio', 'Fecha de Fin', 'Estado']}
        data={contratos.map(contrato => ({
          Nombre: contrato.nombre,
          'Fecha de Inicio': (
            <div className="flex items-center">
              <Calendar className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              {contrato.fechaInicio}
            </div>
          ),
          'Fecha de Fin': (
            <div className="flex items-center">
              <Calendar className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
              {contrato.fechaFin}
            </div>
          ),
          Estado: (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              contrato.estado === 'Activo' ? 'bg-green-200 text-green-800' :
              contrato.estado === 'En revisión' ? 'bg-yellow-200 text-yellow-800' :
              'bg-gray-200 text-gray-800'
            }`}>
              {contrato.estado}
            </span>
          )
        }))}
        variant={theme === 'dark' ? 'dark' : 'white'}
      />
    </motion.div>
  );
};

export default ContratosWidget;