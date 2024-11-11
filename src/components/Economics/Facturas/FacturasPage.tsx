// src/pages/FacturasPage.tsx
import React, { useState } from 'react';
import FacturasWidget from '../FacturasWidget';
import Button from '../../Common/Button';
import Checkbox from '../../Common/Checkbox'; // Importa el Checkbox
import { useTheme } from '../../../contexts/ThemeContext';
import { FileText, Plus, Download } from 'lucide-react';
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

interface Factura {
  id: number;
  numero: string;
  monto: number;
  estado: 'Pagada' | 'Pendiente';
  tipo: 'Escaneada' | 'Emitida';
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

  const [facturas, setFacturas] = useState<Factura[]>([
    { id: 1, numero: 'F-001', monto: 1500, estado: 'Pagada', tipo: 'Escaneada' },
    { id: 2, numero: 'F-002', monto: 2000, estado: 'Pendiente', tipo: 'Emitida' },
    { id: 3, numero: 'F-003', monto: 1800, estado: 'Pagada', tipo: 'Emitida' },
    { id: 4, numero: 'F-004', monto: 2200, estado: 'Pendiente', tipo: 'Escaneada' },
    { id: 5, numero: 'F-005', monto: 1600, estado: 'Pagada', tipo: 'Emitida' },
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    // Implementa la lógica de filtrado según el searchTerm
    console.log('Filtrar facturas con término:', searchTerm);
  };

  const handleExport = () => {
    if (!isExportMode) {
      // Activar el modo de exportación mostrando los checkboxes
      setIsExportMode(true);
    } else {
      // Exportar las facturas seleccionadas
      exportSelectedInvoicesToCSV();
      setIsExportMode(false);
      setSelectedInvoices([]);
    }
  };

  const exportSelectedInvoicesToCSV = () => {
    const invoicesToExport = facturas.filter(factura =>
      selectedInvoices.includes(factura.id)
    );
    if (invoicesToExport.length === 0) {
      alert('No hay facturas seleccionadas para exportar.');
      return;
    }
    const csvContent = generateCSVContent(invoicesToExport);
    downloadCSV(csvContent, 'facturas.csv');
  };

  const generateCSVContent = (invoices: Factura[]) => {
    const header = ['ID', 'Número', 'Monto', 'Estado', 'Tipo'];
    const rows = invoices.map(factura => [
      factura.id,
      factura.numero,
      factura.monto,
      factura.estado,
      factura.tipo,
    ]);

    const csvRows = [
      header.join(','), // Encabezados
      ...rows.map(row => row.join(',')), // Filas de datos
    ];

    return csvRows.join('\n');
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    if ((navigator as any).msSaveBlob) {
      // Para IE 10+
      (navigator as any).msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // Detección de soporte
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  // Datos de ejemplo para el resumen
  const resumenFacturas = {
    totalFacturas: facturas.length,
    facturasPagadas: facturas.filter(f => f.estado === 'Pagada').length,
    facturasPendientes: facturas.filter(f => f.estado === 'Pendiente').length,
    montoTotal: facturas.reduce((acc, f) => acc + f.monto, 0),
    montoPagado: facturas
      .filter(f => f.estado === 'Pagada')
      .reduce((acc, f) => acc + f.monto, 0),
    montoPendiente: facturas
      .filter(f => f.estado === 'Pendiente')
      .reduce((acc, f) => acc + f.monto, 0),
  };

  const toggleSelectFactura = (id: number) => {
    setSelectedInvoices(prev =>
      prev.includes(id) ? prev.filter(facturaId => facturaId !== id) : [...prev, id]
    );
  };

  const seleccionarTodas = () => {
    if (selectedInvoices.length === facturas.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(facturas.map(factura => factura.id));
    }
  };

  // Filtrar facturas según el término de búsqueda
  const facturasFiltradas = facturas.filter(factura =>
    factura.numero.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`p-6 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Facturas</h2>
        <div className="flex space-x-2">
          <Button
            variant="create"
            onClick={() => setIsEscanearFacturaPopupOpen(true)}
          >
            <FileText className="w-4 h-4 mr-2" />
            Escanear Factura
          </Button>
        </div>
      </div>

      {/* Resumen de Facturas */}
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-6 rounded-lg shadow-xl ${
          theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
        }`}
      >
        {/* Total Facturas */}
        <div className="flex flex-col justify-between items-start p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-indigo-500">
          <div className="flex items-center space-x-3">
            <FileText className="w-7 h-7 text-indigo-500 dark:text-indigo-300" />
            <h3 className="text-xl font-semibold tracking-wide">Total Facturas</h3>
          </div>
          <p className="text-5xl font-extrabold mt-4 text-indigo-600 dark:text-indigo-300">
            {resumenFacturas.totalFacturas}
          </p>
          <div className="flex justify-between w-full text-sm mt-4">
            <span className="text-green-500 font-medium">Pagadas: {resumenFacturas.facturasPagadas}</span>
            <span className="text-red-500 font-medium">Pendientes: {resumenFacturas.facturasPendientes}</span>
          </div>
        </div>

        {/* Monto Total */}
        <div className="flex flex-col justify-between items-start p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-indigo-500">
          <div className="flex items-center space-x-3">
            <FileText className="w-7 h-7 text-indigo-500 dark:text-indigo-300" />
            <h3 className="text-xl font-semibold tracking-wide">Monto Total</h3>
          </div>
          <p className="text-5xl font-extrabold mt-4 text-indigo-600 dark:text-indigo-300">
            €{resumenFacturas.montoTotal.toLocaleString()}
          </p>
          <div className="flex justify-between w-full text-sm mt-4">
            <span className="text-green-500 font-medium">Pagado: €{resumenFacturas.montoPagado.toLocaleString()}</span>
            <span className="text-red-500 font-medium">Pendiente: €{resumenFacturas.montoPendiente.toLocaleString()}</span>
          </div>
        </div>

        {/* Exportar Facturas */}
        <div className="flex flex-col justify-between items-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-indigo-500">
          <div className="flex items-center space-x-3">
            <Download className="w-7 h-7 text-indigo-500 dark:text-indigo-300" />
            <h3 className="text-xl font-semibold tracking-wide">Acciones</h3>
          </div>
          <Button
            variant="normal"
            onClick={handleExport}
            className="mt-6 w-full text-indigo-700 hover:text-white bg-indigo-100 hover:bg-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-500 dark:text-white rounded-lg transition-all duration-300"
          >
            <Download className="w-5 h-5 mr-2" />
            {isExportMode ? 'Exportar Seleccionadas' : 'Exportar Facturas'}
          </Button>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtro */}
      {/* Widget de Facturas */}
      <FacturasWidget
        facturas={facturasFiltradas}
        isEditMode={false}
        onRemove={() => {}}
        setIsFacturaPopupOpen={setIsFacturaPopupOpen} // Actualiza esta línea
        isExportMode={isExportMode}
        selectedInvoices={selectedInvoices}
        setSelectedInvoices={setSelectedInvoices}
        toggleSelectFactura={toggleSelectFactura}
        seleccionarTodas={seleccionarTodas}
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
