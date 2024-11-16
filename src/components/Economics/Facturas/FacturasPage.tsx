import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Search, Filter, Plus } from 'lucide-react';
import Button from '../../Common/Button';
import Table from '../../Common/Table';
import { useTheme } from '../../../contexts/ThemeContext';
import FacturaPopup from '../../modals/FacturaPopup';
import EscanearFacturaPopup from '../../modals/EscanearFacturaPopup';
import FacturasFilter, { FilterValues } from './FacturasFilter';

interface FacturasPageProps {
  isFacturaPopupOpen: boolean;
  setIsFacturaPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleFacturaSubmit: (formData: any) => void;
  isEscanearFacturaPopupOpen: boolean;
  setIsEscanearFacturaPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleEscanearFacturaSubmit: (formData: any) => void;
}

interface Factura {
  id: number;
  numero: string;
  monto: number;
  estado: 'Pagada' | 'Pendiente';
  tipo: 'Escaneada' | 'Emitida';
  fecha: string;
}

const FacturasPage: React.FC<FacturasPageProps> = ({
  isFacturaPopupOpen,
  setIsFacturaPopupOpen,
  handleFacturaSubmit,
  isEscanearFacturaPopupOpen,
  setIsEscanearFacturaPopupOpen,
  handleEscanearFacturaSubmit,
}) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExportMode, setIsExportMode] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<number[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    estado: [],
    tipo: [],
    fechaDesde: '',
    fechaHasta: '',
    montoMin: '',
    montoMax: '',
  });

  const facturas: Factura[] = [
    { id: 1, numero: 'F-001', monto: 1500, estado: 'Pagada', tipo: 'Escaneada', fecha: '2024-03-01' },
    { id: 2, numero: 'F-002', monto: 2000, estado: 'Pendiente', tipo: 'Emitida', fecha: '2024-03-02' },
    { id: 3, numero: 'F-003', monto: 1800, estado: 'Pagada', tipo: 'Emitida', fecha: '2024-03-03' },
    { id: 4, numero: 'F-004', monto: 2200, estado: 'Pendiente', tipo: 'Escaneada', fecha: '2024-03-04' },
    { id: 5, numero: 'F-005', monto: 1600, estado: 'Pagada', tipo: 'Emitida', fecha: '2024-03-05' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleExport = () => {
    if (!isExportMode) {
      setIsExportMode(true);
    } else {
      const selectedFacturas = facturas.filter(factura => selectedInvoices.includes(factura.id));
      if (selectedFacturas.length === 0) {
        alert('No hay facturas seleccionadas para exportar.');
        return;
      }
      console.log('Exportando facturas:', selectedFacturas);
      setIsExportMode(false);
      setSelectedInvoices([]);
    }
  };

  const toggleSelectFactura = (id: number) => {
    setSelectedInvoices(prev =>
      prev.includes(id) ? prev.filter(facturaId => facturaId !== id) : [...prev, id]
    );
  };

  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters);
    console.log('Filtros aplicados:', filters);
  };

  const filteredFacturas = facturas.filter(factura => {
    const matchesSearch = factura.numero.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = activeFilters.estado.length === 0 || activeFilters.estado.includes(factura.estado);
    const matchesTipo = activeFilters.tipo.length === 0 || activeFilters.tipo.includes(factura.tipo);
    const matchesFechaDesde = !activeFilters.fechaDesde || factura.fecha >= activeFilters.fechaDesde;
    const matchesFechaHasta = !activeFilters.fechaHasta || factura.fecha <= activeFilters.fechaHasta;
    const matchesMontoMin = !activeFilters.montoMin || factura.monto >= Number(activeFilters.montoMin);
    const matchesMontoMax = !activeFilters.montoMax || factura.monto <= Number(activeFilters.montoMax);

    return matchesSearch && matchesEstado && matchesTipo && matchesFechaDesde && 
           matchesFechaHasta && matchesMontoMin && matchesMontoMax;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
    >
      <h2 className="text-3xl font-bold mb-8 text-center">Gestión de Facturas</h2>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex space-x-4">
          <Button variant="create" onClick={() => setIsFacturaPopupOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Factura
          </Button>
          <Button variant="create" onClick={() => setIsEscanearFacturaPopupOpen(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Escanear Factura
          </Button>
          <Button variant="create" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            {isExportMode ? 'Exportar Seleccionadas' : 'Exportar Facturas'}
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar facturas..."
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
            <FacturasFilter
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApplyFilters={handleApplyFilters}
            />
          </div>
        </div>
      </div>

      <div className={`bg-${theme === 'dark' ? 'gray-800' : 'white'} rounded-lg shadow-md overflow-hidden`}>
        <Table
          headers={['Número', 'Fecha', 'Monto', 'Estado', 'Tipo', 'Acciones']}
          data={filteredFacturas.map(factura => ({
            Número: (
              <div className="flex items-center">
                <FileText className={`w-5 h-5 mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                {factura.numero}
              </div>
            ),
            Fecha: factura.fecha,
            Monto: `€${factura.monto.toLocaleString()}`,
            Estado: (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                factura.estado === 'Pagada' 
                  ? 'bg-green-200 text-green-800' 
                  : 'bg-red-200 text-red-800'
              }`}>
                {factura.estado}
              </span>
            ),
            Tipo: (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                factura.tipo === 'Emitida' 
                  ? 'bg-blue-200 text-blue-800' 
                  : 'bg-purple-200 text-purple-800'
              }`}>
                {factura.tipo}
              </span>
            ),
            Acciones: (
              <div className="flex space-x-2">
                {isExportMode ? (
                  <input
                    type="checkbox"
                    checked={selectedInvoices.includes(factura.id)}
                    onChange={() => toggleSelectFactura(factura.id)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                ) : (
                  <Button variant="normal" onClick={() => console.log(`Ver factura ${factura.id}`)}>
                    <FileText className="w-4 h-4 mr-2" />
                    Ver
                  </Button>
                )}
              </div>
            ),
          }))}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm">
          Mostrando {filteredFacturas.length} de {facturas.length} facturas
        </div>
        <div className="space-x-2">
          <Button variant="normal" disabled>Anterior</Button>
          <Button variant="normal" disabled>Siguiente</Button>
        </div>
      </div>

      {/* Popups */}
      <FacturaPopup
        isOpen={isFacturaPopupOpen}
        onClose={() => setIsFacturaPopupOpen(false)}
        onSubmit={handleFacturaSubmit}
      />
      <EscanearFacturaPopup
        isOpen={isEscanearFacturaPopupOpen}
        onClose={() => setIsEscanearFacturaPopupOpen(false)}
        onSubmit={handleEscanearFacturaSubmit}
      />
    </motion.div>
  );
};

export default FacturasPage;