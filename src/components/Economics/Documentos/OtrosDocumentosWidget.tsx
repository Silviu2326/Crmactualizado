import React, { useState } from 'react';
import { File, Search, Filter, Plus, Calendar } from 'lucide-react';
import Table from '../../common/Table';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';

interface Documento {
  id: number;
  nombre: string;
  tipo: string;
  fechaCreacion: string;
}

const OtrosDocumentosWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();

  const documentos: Documento[] = [
    { id: 1, nombre: "Política de Privacidad", tipo: "Legal", fechaCreacion: "2023-01-15" },
    { id: 2, nombre: "Manual de Empleado", tipo: "RRHH", fechaCreacion: "2023-03-01" },
    { id: 3, nombre: "Plan de Emergencia", tipo: "Seguridad", fechaCreacion: "2023-02-20" },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    console.log('Filtrar otros documentos');
  };

  const handleAddDocumento = () => {
    console.log('Añadir nuevo documento');
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
            placeholder="Buscar documentos..."
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
        <Button variant="create" onClick={handleAddDocumento}>
          <Plus className="w-4 h-4 mr-1" />
          Añadir
        </Button>
      </div>
      <Table
        headers={['Nombre', 'Tipo', 'Fecha de Creación']}
        data={documentos.map(doc => ({
          Nombre: doc.nombre,
          Tipo: (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              doc.tipo === 'Legal' ? 'bg-blue-200 text-blue-800' :
              doc.tipo === 'RRHH' ? 'bg-green-200 text-green-800' :
              'bg-yellow-200 text-yellow-800'
            }`}>
              {doc.tipo}
            </span>
          ),
          'Fecha de Creación': (
            <div className="flex items-center">
              <Calendar className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              {doc.fechaCreacion}
            </div>
          )
        }))}
        variant={theme === 'dark' ? 'dark' : 'white'}
      />
    </motion.div>
  );
};

export default OtrosDocumentosWidget;