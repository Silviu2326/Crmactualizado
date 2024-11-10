import React, { useState } from 'react'; 
import FacturasWidget from '../FacturasWidget';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { FileText, Plus, Search, Filter, Download } from 'lucide-react';
import FacturaPopup from '../../modals/FacturaPopup';
import EscanearFacturaPopup from '../../modals/EscanearFacturaPopup';

interface FacturasPageProps {
  isFacturaPopupOpen: boolean;
  setIsFacturaPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleFacturaSubmit: (formData: any) => void;
  isEscanearFacturaPopupOpen: boolean;
  setIsEscanearFacturaPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleEscanearFacturaSubmit: (formData: any) => void;
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    console.log('Filtrar facturas');
    // Implementar lógica de filtrado
  };

  const handleExport = () => {
    console.log('Exportar facturas');
    // Implementar lógica de exportación
  };

  // Datos de ejemplo para el resumen
  const resumenFacturas = {
    totalFacturas: 150,
    facturasPagadas: 120,
    facturasPendientes: 30,
    montoTotal: 15000,
    montoPagado: 12000,
    montoPendiente: 3000,
  };

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Facturas</h2>
        <div className="flex space-x-2">
          <Button variant="create" onClick={() => setIsEscanearFacturaPopupOpen(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Escanear Factura
          </Button>
          <Button variant="create" onClick={() => setIsFacturaPopupOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Factura
          </Button>
        </div>
      </div>

      {/* Resumen de Facturas */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md`}>
        <div>
          <h3 className="text-lg font-semibold mb-2">Total Facturas</h3>
          <p className="text-2xl font-bold">{resumenFacturas.totalFacturas}</p>
          <div className="flex justify-between mt-2">
            <span className="text-green-500">Pagadas: {resumenFacturas.facturasPagadas}</span>
            <span className="text-red-500">Pendientes: {resumenFacturas.facturasPendientes}</span>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Monto Total</h3>
          <p className="text-2xl font-bold">${resumenFacturas.montoTotal.toLocaleString()}</p>
          <div className="flex justify-between mt-2">
            <span className="text-green-500">Pagado: ${resumenFacturas.montoPagado.toLocaleString()}</span>
            <span className="text-red-500">Pendiente: ${resumenFacturas.montoPendiente.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <Button variant="normal" onClick={handleExport} className="mb-2">
            <Download className="w-4 h-4 mr-2" />
            Exportar Facturas
          </Button>
        </div>
      </div>

      {/* Barra de búsqueda y filtro */}
      <div className="flex mb-6">
        <div className="relative flex-grow mr-2">
          <input
            type="text"
            placeholder="Buscar facturas..."
            value={searchTerm}
            onChange={handleSearch}
            className={`w-full px-4 py-2 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
            } border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" />
        </div>
        <Button variant="filter" onClick={handleFilter}>
          <Filter className="w-4 h-4 mr-2" />
          Filtrar
        </Button>
      </div>

      {/* Widget de Facturas */}
      <FacturasWidget 
        facturas={[
            { id: 1, numero: "F-001", monto: 1500, estado: "Pagada" },
            { id: 2, numero: "F-002", monto: 2000, estado: "Pendiente" },
            { id: 3, numero: "F-003", monto: 1800, estado: "Pagada" },
            { id: 4, numero: "F-004", monto: 2200, estado: "Pendiente" },
            { id: 5, numero: "F-005", monto: 1600, estado: "Pagada" },
        ]}
        isEditMode={false}
        onRemove={() => {}}
        setIsEscanearFacturaPopupOpen={setIsEscanearFacturaPopupOpen} // Agregamos la prop faltante
      />

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
    </div>
  );
};

export default FacturasPage;
