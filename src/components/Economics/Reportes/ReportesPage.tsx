import React, { useState } from 'react';
import Table from '../../common/Table';
import Button from '../../common/Button';
import { Download, FileText, Calendar, Search, Filter } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';

const ReportesPage: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const reportesData = [
    { id: 1, titulo: 'Reporte Mensual Agosto', fecha: '2024-08-01', tipo: 'Mensual' },
    { id: 2, titulo: 'Reporte Mensual Julio', fecha: '2024-07-01', tipo: 'Mensual' },
    { id: 3, titulo: 'Reporte Trimestral Q2', fecha: '2024-06-30', tipo: 'Trimestral' },
    { id: 4, titulo: 'Reporte Mensual Junio', fecha: '2024-06-01', tipo: 'Mensual' },
    { id: 5, titulo: 'Reporte Anual 2023', fecha: '2024-01-01', tipo: 'Anual' },
  ];

  const handleGenerateRecurringReport = () => {
    console.log('Generando reporte recurrente');
  };

  const handleGenerateCurrentReport = () => {
    console.log('Generando reporte actual');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    console.log('Filtrar reportes');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
    >
      <h2 className="text-3xl font-bold mb-8 text-center">Reportes Detallados</h2>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex space-x-4">
          <Button variant="create" onClick={handleGenerateRecurringReport}>
            <Calendar className="w-4 h-4 mr-2" />
            Generar Reporte Recurrente
          </Button>
          <Button variant="create" onClick={handleGenerateCurrentReport}>
            <FileText className="w-4 h-4 mr-2" />
            Generar Reporte Actual
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar reportes..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={`w-full px-4 py-2 rounded-full ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
            />
            <Search className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <Button variant="filter" onClick={handleFilter}>
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className={`bg-${theme === 'dark' ? 'gray-800' : 'white'} rounded-lg shadow-md overflow-hidden`}>
        <Table
          headers={['Título', 'Fecha', 'Tipo', 'Acciones']}
          data={reportesData.map(report => ({
            Título: (
              <div className="flex items-center">
                <FileText className={`w-5 h-5 mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                {report.titulo}
              </div>
            ),
            Fecha: (
              <div className="flex items-center">
                <Calendar className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                {report.fecha}
              </div>
            ),
            Tipo: (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                report.tipo === 'Mensual' ? 'bg-green-200 text-green-800' :
                report.tipo === 'Trimestral' ? 'bg-blue-200 text-blue-800' :
                'bg-purple-200 text-purple-800'
              }`}>
                {report.tipo}
              </span>
            ),
            Acciones: (
              <Button variant="normal" onClick={() => console.log(`Descargando reporte ${report.id}`)}>
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
            )
          }))}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm">
          Mostrando 5 de 5 reportes
        </div>
        <div className="space-x-2">
          <Button variant="normal" disabled>Anterior</Button>
          <Button variant="normal" disabled>Siguiente</Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportesPage;