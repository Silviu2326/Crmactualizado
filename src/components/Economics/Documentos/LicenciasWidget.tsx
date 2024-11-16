import React, { useState } from 'react';
import { FileText, Search, Filter, Plus, Calendar } from 'lucide-react';
import Table from '../../Common/Table';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';

interface Licencia {
  id: number;
  nombre: string;
  fechaExpiracion: string;
  estado: 'Activa' | 'Expirada' | 'Por renovar';
}

const LicenciasWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();

  const licencias: Licencia[] = [
    { id: 1, nombre: "Licencia de Operación", fechaExpiracion: "2024-12-31", estado: "Activa" },
    { id: 2, nombre: "Licencia de Software", fechaExpiracion: "2023-10-15", estado: "Por renovar" },
    { id: 3, nombre: "Certificación de Seguridad", fechaExpiracion: "2023-08-01", estado: "Expirada" },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    console.log('Filtrar licencias');
  };

  const handleAddLicencia = () => {
    console.log('Añadir nueva licencia');
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
            className={`w-full px-4 py-2 rounded-full ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
          />
          <Search className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <Button variant="filter" onClick={handleFilter}>
          <Filter className="w-4 h-4" />
        </Button>
        <Button variant="create" onClick={handleAddLicencia}>
          <Plus className="w-4 h-4 mr-1" />
          Añadir
        </Button>
      </div>
      <Table
        headers={['Nombre', 'Fecha de Expiración', 'Estado']}
        data={licencias.map(licencia => ({
          Nombre: licencia.nombre,
          'Fecha de Expiración': (
            <div className="flex items-center">
              <Calendar className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              {licencia.fechaExpiracion}
            </div>
          ),
          Estado: (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              licencia.estado === 'Activa' ? 'bg-green-200 text-green-800' :
              licencia.estado === 'Por renovar' ? 'bg-yellow-200 text-yellow-800' :
              'bg-red-200 text-red-800'
            }`}>
              {licencia.estado}
            </span>
          )
        }))}
        variant={theme === 'dark' ? 'dark' : 'white'}
      />
    </motion.div>
  );
};

export default LicenciasWidget;
