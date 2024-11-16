import React, { useState } from 'react';
import Table from '../../Common/Table';
import Button from '../../Common/Button';
import { Download, FileText, Calendar, Search, Filter } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import ReportesFilter, { FilterValues } from './ReportesFilter';

interface Reporte {
  id: number;
  titulo: string;
  fecha: string;
  tipo: 'Mensual' | 'Trimestral' | 'Anual';
  estado: 'Generado' | 'Pendiente' | 'En Proceso';
}

const ReportesPage: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    tipo: [],
    fechaDesde: '',
    fechaHasta: '',
    estado: [],
  });

  const reportesData: Reporte[] = [
    { id: 1, titulo: 'Reporte Mensual Agosto', fecha: '2024-08-01', tipo: 'Mensual', estado: 'Generado' },
    { id: 2, titulo: 'Reporte Mensual Julio', fecha: '2024-07-01', tipo: 'Mensual', estado: 'Pendiente' },
    { id: 3, titulo: 'Reporte Trimestral Q2', fecha: '2024-06-30', tipo: 'Trimestral', estado: 'En Proceso' },
    { id: 4, titulo: 'Reporte Mensual Junio', fecha: '2024-06-01', tipo: 'Mensual', estado: 'Generado' },
    { id: 5, titulo: 'Reporte Anual 2023', fecha: '2024-01-01', tipo: 'Anual', estado: 'Generado' },
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

  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters);
    console.log('Filtros aplicados:', filters);
  };

  const filteredReportes = reportesData.filter(reporte => {
    const matchesSearch = reporte.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = activeFilters.tipo.length === 0 || activeFilters.tipo.includes(reporte.tipo);
    const matchesEstado = activeFilters.estado.length === 0 || activeFilters.estado.includes(reporte.estado);
    const matchesFechaDesde = !activeFilters.fechaDesde || reporte.fecha >= activeFilters.fechaDesde;
    const matchesFechaHasta = !activeFilters.fechaHasta || reporte.fecha <= activeFilters.fechaHasta;

    return matchesSearch && matchesTipo && matchesEstado && matchesFechaDesde && matchesFechaHasta;
  });

  const getEstadoStyle = (estado: string) => {
    switch (estado) {
      case 'Generado':
        return 'bg-green-200 text-green-800';
      case 'Pendiente':
        return 'bg-yellow-200 text-yellow-800';
      case 'En Proceso':
        return 'bg-blue-200 text-blue-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getTipoStyle = (tipo: string) => {
    switch (tipo) {
      case 'Mensual':
        return 'bg-purple-200 text-purple-800';
      case 'Trimestral':
        return 'bg-blue-200 text-blue-800';
      case 'Anual':
        return 'bg-indigo-200 text-indigo-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
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
          <div className="relative">
            <Button 
              variant="filter" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={isFilterOpen ? 'ring-2 ring-blue-500' : ''}
            >
              <Filter className="w-4 h-4" />
            </Button>
            <ReportesFilter
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApplyFilters={handleApplyFilters}
            />
          </div>
        </div>
      </div>

      <div className={`bg-${theme === 'dark' ? 'gray-800' : 'white'} rounded-lg shadow-md overflow-hidden`}>
        <Table
          headers={['Título', 'Fecha', 'Tipo', 'Estado', 'Acciones']}
          data={filteredReportes.map(reporte => ({
            Título: (
              <div className="flex items-center">
                <FileText className={`w-5 h-5 mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                {reporte.titulo}
              </div>
            ),
            Fecha: (
              <div className="flex items-center">
                <Calendar className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                {reporte.fecha}
              </div>
            ),
            Tipo: (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTipoStyle(reporte.tipo)}`}>
                {reporte.tipo}
              </span>
            ),
            Estado: (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getEstadoStyle(reporte.estado)}`}>
                {reporte.estado}
              </span>
            ),
            Acciones: (
              <Button variant="normal" onClick={() => console.log(`Descargando reporte ${reporte.id}`)}>
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
          Mostrando {filteredReportes.length} de {reportesData.length} reportes
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