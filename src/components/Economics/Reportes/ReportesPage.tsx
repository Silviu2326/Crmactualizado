import React, { useState, useEffect } from 'react';
import Table from '../../Common/Table';
import Button from '../../Common/Button';
import { Download, FileText, Calendar, Search, Filter, Trash2 } from 'lucide-react';
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
  const [reportesData, setReportesData] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    tipo: [],
    fechaDesde: '',
    fechaHasta: '',
    estado: [],
  });

  // Datos de ejemplo para reportes
  const sampleReportes: Reporte[] = [
    {
      id: 1,
      titulo: 'Reporte Mensual de Ingresos - Enero 2024',
      fecha: '2024-01-31',
      tipo: 'Mensual',
      estado: 'Generado'
    },
    {
      id: 2,
      titulo: 'Reporte Trimestral Q4 2023',
      fecha: '2023-12-31',
      tipo: 'Trimestral',
      estado: 'Generado'
    },
    {
      id: 3,
      titulo: 'Reporte Anual 2023',
      fecha: '2023-12-31',
      tipo: 'Anual',
      estado: 'Generado'
    },
    {
      id: 4,
      titulo: 'Reporte Mensual de Ingresos - Febrero 2024',
      fecha: '2024-02-29',
      tipo: 'Mensual',
      estado: 'En Proceso'
    },
    {
      id: 5,
      titulo: 'Reporte de Gastos Q1 2024',
      fecha: '2024-03-31',
      tipo: 'Trimestral',
      estado: 'Pendiente'
    },
    {
      id: 6,
      titulo: 'Reporte de KPIs - Enero 2024',
      fecha: '2024-01-31',
      tipo: 'Mensual',
      estado: 'Generado'
    },
    {
      id: 7,
      titulo: 'Reporte de Ventas por Región - Q4 2023',
      fecha: '2023-12-31',
      tipo: 'Trimestral',
      estado: 'Generado'
    },
    {
      id: 8,
      titulo: 'Análisis de Rendimiento 2023',
      fecha: '2023-12-31',
      tipo: 'Anual',
      estado: 'Generado'
    }
  ];

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        setLoading(true);
        // Simulamos una llamada a la API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay de red
        setReportesData(sampleReportes);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los reportes');
        setLoading(false);
      }
    };

    fetchReportes();
  }, []);

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

  const handleDeleteReport = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Mock API call para eliminar el reporte
      const response = await fetch(`https://api.ejemplo.com/reportes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el reporte');
      }

      // Actualizar la lista de reportes después de eliminar
      setReportesData(prevReportes => prevReportes.filter(reporte => reporte.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el reporte');
      console.error('Error deleting report:', err);
    }
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

  const handleDownloadReport = async (reporteId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/reports/${reporteId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al descargar el reporte');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${reporteId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar el reporte:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Reportes Detallados</h2>
        <div className="text-center">Cargando...</div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Reportes Detallados</h2>
        <div className="text-center text-red-500">{error}</div>
      </motion.div>
    );
  }

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
              <div className="flex space-x-2">
                <Button
                  variant="normal"
                  onClick={() => handleDownloadReport(reporte.id)}
                  className="px-2 py-1 text-sm flex items-center"
                  disabled={reporte.estado !== 'Generado'}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Descargar PDF
                </Button>
                <button
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
                      handleDeleteReport(reporte.id);
                    }
                  }}
                  className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
                  title="Eliminar reporte"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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