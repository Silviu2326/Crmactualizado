import React, { useState, useEffect } from 'react'; 
import { motion } from 'framer-motion';
import { FileText, Download, Search, Filter, Plus } from 'lucide-react';
import Button from '../../Common/Button';
import Table from '../../Common/Table';
import { useTheme } from '../../../contexts/ThemeContext';
import FacturaPopup from '../../modals/FacturaPopup';
import EscanearFacturaPopup from '../../modals/EscanearFacturaPopup';
import FacturasFilter, { FilterValues } from './FacturasFilter';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import FacturasPopup2 from '../../modals/FacturasPopup2';
import JSZip from 'jszip';

interface FacturasPageProps {
  isFacturaPopupOpen: boolean;
  setIsFacturaPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleFacturaSubmit: (formData: any) => void;
  isEscanearFacturaPopupOpen: boolean;
  setIsEscanearFacturaPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleEscanearFacturaSubmit: (formData: any) => void;
}

interface Factura {
  id: string;
  numero: string;
  monto: number;
  estado: string;
  tipo: string;
  fecha: string;
  currency: string;
  fechaCobro?: string;
  cliente?: string;
  fechaMaxPago?: string;
  emisor?: string;
}

type TabType = 'emitidas' | 'recibidas' | 'todas';

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
  const [exportFormat, setExportFormat] = useState<'CSV' | 'PDF'>('CSV');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    estado: [],
    tipo: [],
    fechaDesde: '',
    fechaHasta: '',
    montoMin: '',
    montoMax: '',
  });
  const [activeTab, setActiveTab] = useState<TabType>('todas');
  const [isFacturasPopup2Open, setIsFacturasPopup2Open] = useState(false);

  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [selectedFacturaId, setSelectedFacturaId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          // Manejar el caso donde no hay token (el usuario no está autenticado)
          console.error('No se encontró el token de autenticación.');
          return;
        }

        // Realizar la petición GET al backend incluyendo el token en los encabezados
        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/invoice', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
          throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const invoices = data.invoices;

        const mappedFacturas = invoices.map((invoice: any) => ({
          id: invoice._id,
          numero: invoice.numeroFactura,
          monto: invoice.totalAmount,
          estado: mapEstado(invoice.status),
          tipo: mapTipo(invoice.tipoFactura),
          fecha: formatFecha(invoice.fecha),
          currency: invoice.currency,
          fechaCobro: invoice.fechaCobro,
          cliente: invoice.cliente,
          fechaMaxPago: invoice.fechaMaxPago,
          emisor: invoice.emisor,
        }));

        setFacturas(mappedFacturas);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
      }
    };

    fetchFacturas();
  }, []);

  // Función para mapear el estado de la factura
  const mapEstado = (status: string): string => {
    switch (status) {
      case 'paid':
        return 'Pagada';
      case 'pending':
      case 'overdue':
      case 'partial':
        return 'Pendiente';
      default:
        return 'Desconocido';
    }
  };

  // Función para mapear el tipo de factura
  const mapTipo = (tipoFactura: string): string => {
    switch (tipoFactura) {
      case 'completa':
      case 'proforma':
        return 'Emitida';
      case 'simple':
        return 'Escaneada';
      default:
        return 'Otro';
    }
  };

  // Función para formatear la fecha
  const formatFecha = (fecha: string): string => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES');
  };

  const handleViewFactura = (facturaId: string) => {
    setSelectedFacturaId(facturaId);
  };

  const handleDownloadFactura = async (facturaId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/invoice/${facturaId}/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al descargar la factura');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura-${facturaId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar la factura:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const handleDeleteFactura = async (facturaId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/invoice/${facturaId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la factura');
        }

        // Actualizar la lista de facturas después de eliminar
        setFacturas(facturas.filter(factura => factura.id !== facturaId));
      } catch (error) {
        console.error('Error al eliminar la factura:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    }
  };

  const getTableColumns = () => {
    const baseColumns = activeTab === 'emitidas' 
      ? {
          headers: ['Número', 'Fecha de emisión', 'Fecha de cobro', 'Importe neto', 'Cliente', 'Acciones'],
          accessors: ['numero', 'fecha', 'fechaCobro', 'monto', 'cliente', 'acciones']
        }
      : activeTab === 'recibidas'
      ? {
          headers: ['Fecha de emisión', 'Fecha máx. de pago', 'Importe', 'Emisor', 'Estado', 'Acciones'],
          accessors: ['fecha', 'fechaMaxPago', 'monto', 'emisor', 'estado', 'acciones']
        }
      : {
          headers: ['Número', 'Fecha', 'Importe', 'Estado', 'Tipo', 'Acciones'],
          accessors: ['numero', 'fecha', 'monto', 'estado', 'tipo', 'acciones']
        };

    return baseColumns;
  };

  const formatTableData = (factura: Factura, accessors: string[]) => {
    return accessors.map(accessor => {
      if (accessor === 'acciones') {
        return (
          <div className="flex space-x-2">
            <Button
              variant="normal"
              onClick={() => handleViewFactura(factura.id)}
              className="px-2 py-1 text-sm"
            >
              <FileText className="w-4 h-4" />
              Ver
            </Button>
            <Button
              variant="normal"
              onClick={() => handleDownloadFactura(factura.id)}
              className="px-2 py-1 text-sm"
            >
              <Download className="w-4 h-4" />
              Descargar
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDeleteFactura(factura.id)}
              className="px-2 py-1 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Borrar
            </Button>
          </div>
        );
      }
      if (accessor === 'monto') {
        return `${factura.currency === 'USD' ? '$' : '€'}${factura.monto.toLocaleString()}`;
      }
      if (accessor === 'estado') {
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            factura.estado === 'Pagada' 
              ? 'bg-green-200 text-green-800' 
              : 'bg-red-200 text-red-800'
          }`}>
            {factura.estado}
          </span>
        );
      }
      if (accessor === 'tipo') {
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            factura.tipo === 'Emitida' 
              ? 'bg-blue-200 text-blue-800' 
              : 'bg-purple-200 text-purple-800'
          }`}>
            {factura.tipo}
          </span>
        );
      }
      return factura[accessor] || '-';
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleExport = () => {
    if (isExportMode && selectedInvoices.length > 0) {
      handleExportSelected();
    } else {
      setIsExportMode(!isExportMode);
      setSelectedInvoices([]);
    }
  };

  const handleExportSelected = async () => {
    if (selectedInvoices.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      
      if (exportFormat === 'PDF') {
        // Crear un nuevo objeto ZIP
        const zip = new JSZip();
        
        // Descargar todos los PDFs y añadirlos al ZIP
        for (const facturaId of selectedInvoices) {
          const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/invoice/${facturaId}/pdf`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Error al descargar la factura ${facturaId}`);
          }

          const pdfBlob = await response.blob();
          const factura = facturas.find(f => f.id === facturaId);
          const fileName = `factura-${factura?.numero || facturaId}.pdf`;
          zip.file(fileName, pdfBlob);
        }
        
        // Generar y descargar el archivo ZIP
        const zipBlob = await zip.generateAsync({type: 'blob'});
        const url = window.URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `facturas_${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } else {
        // Lógica para exportar a CSV
        const selectedFacturas = facturas.filter(factura => 
          selectedInvoices.includes(factura.id)
        );
        
        const csvContent = generateCSV(selectedFacturas);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `facturas_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }
      
      setIsExportMode(false);
      setSelectedInvoices([]);
    } catch (error) {
      console.error('Error al exportar las facturas:', error);
    }
  };

  const generateCSV = (selectedFacturas: Factura[]): string => {
    const headers = ['Número', 'Fecha', 'Importe', 'Estado', 'Tipo', 'Cliente', 'Emisor'].join(',');
    const rows = selectedFacturas.map(factura => {
      return [
        factura.numero,
        factura.fecha,
        `${factura.currency === 'USD' ? '$' : '€'}${factura.monto}`,
        factura.estado,
        factura.tipo,
        factura.cliente || '',
        factura.emisor || ''
      ].join(',');
    });
    
    return [headers, ...rows].join('\n');
  };

  const handleToggleInvoiceSelection = (facturaId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(facturaId) 
        ? prev.filter(id => id !== facturaId)
        : [...prev, facturaId]
    );
  };

  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters);
    console.log('Filtros aplicados:', filters);
  };

  const filteredFacturas = facturas.filter(factura => {
    const matchesSearch = factura.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.estado.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === 'todas' ? true :
      activeTab === 'emitidas' ? factura.tipo === 'Emitida' :
      factura.tipo === 'Recibida';

    const matchesEstado = activeFilters.estado.length === 0 || activeFilters.estado.includes(factura.estado);
    const matchesTipo = activeFilters.tipo.length === 0 || activeFilters.tipo.includes(factura.tipo);
    const matchesFechaDesde = !activeFilters.fechaDesde || factura.fecha >= activeFilters.fechaDesde;
    const matchesFechaHasta = !activeFilters.fechaHasta || factura.fecha <= activeFilters.fechaHasta;
    const matchesMontoMin = !activeFilters.montoMin || factura.monto >= Number(activeFilters.montoMin);
    const matchesMontoMax = !activeFilters.montoMax || factura.monto <= Number(activeFilters.montoMax);

    return matchesSearch && matchesTab && matchesEstado && matchesTipo && matchesFechaDesde && 
           matchesFechaHasta && matchesMontoMin && matchesMontoMax;
  });

  const handleCloseViewer = () => {
    setSelectedFacturaId(null);
  };

  const FacturasView: React.FC<{ facturaId: string; onClose: () => void }> = ({ facturaId, onClose }) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    useEffect(() => {
      const fetchPdf = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/invoice/${facturaId}/pdf`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Error al cargar la factura');
          }

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          setPdfUrl(url);
        } catch (error) {
          console.error('Error al cargar la factura:', error);
        }
      };

      fetchPdf();
      return () => {
        if (pdfUrl) {
          window.URL.revokeObjectURL(pdfUrl);
        }
      };
    }, [facturaId]);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded-lg w-4/5 h-4/5">
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              ×
            </button>
          </div>
          <div className="h-full">
            {pdfUrl && (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={pdfUrl}
                  plugins={[defaultLayoutPluginInstance]}
                />
              </Worker>
            )}
          </div>
        </div>
      </div>
    );
  };

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
          <Button variant="create" onClick={() => setIsFacturasPopup2Open(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Nueva Factura (Versión 2)
          </Button>
          <Button variant="create" onClick={() => setIsEscanearFacturaPopupOpen(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Escanear Factura
          </Button>
          <div className="flex items-center space-x-4">
            <Button
              variant="create"
              onClick={() => {
                if (isExportMode && selectedInvoices.length > 0) {
                  handleExportSelected();
                } else {
                  setIsExportMode(!isExportMode);
                  setSelectedInvoices([]);
                }
              }}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4 mr-2" />
              <span>{isExportMode ? `Exportar ${selectedInvoices.length} seleccionadas` : 'Exportar'}</span>
              {isExportMode && (
                <div className="flex items-center ml-4 bg-white/10 rounded-full p-1">
                  <button
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      exportFormat === 'CSV' 
                        ? 'bg-white text-blue-600' 
                        : 'text-white hover:bg-white/20'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExportFormat('CSV');
                    }}
                  >
                    CSV
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      exportFormat === 'PDF' 
                        ? 'bg-white text-blue-600' 
                        : 'text-white hover:bg-white/20'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExportFormat('PDF');
                    }}
                  >
                    PDF
                  </button>
                </div>
              )}
            </Button>
          </div>
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

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Facturas</h1>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`px-4 py-2 mr-2 ${activeTab === 'todas' ? 
              'border-b-2 border-blue-500 text-blue-500' : 
              'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('todas')}
          >
            Todas
          </button>
          <button
            className={`px-4 py-2 mr-2 ${activeTab === 'emitidas' ? 
              'border-b-2 border-blue-500 text-blue-500' : 
              'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('emitidas')}
          >
            Emitidas
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'recibidas' ? 
              'border-b-2 border-blue-500 text-blue-500' : 
              'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('recibidas')}
          >
            Recibidas
          </button>
        </div>

        <div className={`bg-${theme === 'dark' ? 'gray-800' : 'white'} rounded-lg shadow-md overflow-hidden`}>
          <Table
            headers={[
              ...(isExportMode ? ['Seleccionar'] : []),
              'Número',
              'Fecha',
              'Importe',
              'Estado',
              'Tipo',
              'Acciones'
            ]}
            data={filteredFacturas.map(factura => {
              const baseData = {
                ...(isExportMode ? {
                  seleccionar: (
                    <input
                      type="checkbox"
                      checked={selectedInvoices.includes(factura.id)}
                      onChange={() => handleToggleInvoiceSelection(factura.id)}
                      className="w-4 h-4"
                    />
                  )
                } : {}),
                numero: factura.numero,
                fecha: factura.fecha,
                monto: `${factura.currency === 'USD' ? '$' : '€'}${factura.monto.toLocaleString()}`,
                estado: factura.estado,
                tipo: factura.tipo,
                acciones: (
                  <div className="flex space-x-2">
                    <Button
                      variant="normal"
                      onClick={() => handleViewFactura(factura.id)}
                      className="px-2 py-1 text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Ver
                    </Button>
                    <Button
                      variant="normal"
                      onClick={() => handleDownloadFactura(factura.id)}
                      className="px-2 py-1 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Descargar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteFactura(factura.id)}
                      className="px-2 py-1 text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Borrar
                    </Button>
                  </div>
                )
              };
              return baseData;
            })}
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
        <FacturasPopup2
          isOpen={isFacturasPopup2Open}
          onClose={() => setIsFacturasPopup2Open(false)}
          onSubmit={handleFacturaSubmit}
        />
        <EscanearFacturaPopup
          isOpen={isEscanearFacturaPopupOpen}
          onClose={() => setIsEscanearFacturaPopupOpen(false)}
          onSubmit={handleEscanearFacturaSubmit}
        />
        {selectedFacturaId && (
          <FacturasView
            facturaId={selectedFacturaId}
            onClose={handleCloseViewer}
          />
        )}
      </div>
    </motion.div>
  );
};

export default FacturasPage;
