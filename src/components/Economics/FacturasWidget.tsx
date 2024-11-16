import React, { useState } from 'react';
import { FileText, Search, Filter, Plus } from 'lucide-react';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface Factura {
  id: number;
  numero: string;
  monto: number;
  estado: 'Pagada' | 'Pendiente';
  tipo: 'Escaneada' | 'Emitida';
}

interface FacturasWidgetProps {
  facturas: Factura[];
  isEditMode: boolean;
  onRemove: () => void;
  setIsFacturaPopupOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isExportMode?: boolean;
  selectedInvoices?: number[];
  setSelectedInvoices?: React.Dispatch<React.SetStateAction<number[]>>;
}

const FacturasWidget: React.FC<FacturasWidgetProps> = ({
  facturas,
  isEditMode,
  onRemove,
  setIsFacturaPopupOpen,
  isExportMode = false,
  selectedInvoices = [],
  setSelectedInvoices,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();

  const totalPendiente = facturas.reduce(
    (sum, factura) =>
      factura.estado === 'Pendiente' ? sum + factura.monto : sum,
    0
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    console.log('Filtrar facturas');
  };

  const handleCheckboxChange = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedInvoices?.([...selectedInvoices, id]);
    } else {
      setSelectedInvoices?.(
        selectedInvoices.filter(invoiceId => invoiceId !== id)
      );
    }
  };

  const filteredFacturas = facturas.filter(factura =>
    factura.numero.includes(searchTerm)
  );

  return (
    <div
      className={`p-4 h-full flex flex-col justify-between ${
        theme === 'dark'
          ? 'bg-gray-800 text-white'
          : 'bg-indigo-50 text-gray-800'
      } rounded-lg`}
    >
      {isEditMode && (
        <button
          onClick={onRemove}
          className={`absolute top-2 right-2 ${
            theme === 'dark'
              ? 'text-indigo-400 hover:text-indigo-300'
              : 'text-indigo-500 hover:text-indigo-700'
          } bg-white rounded-full p-1 shadow-md`}
        >
          <FileText className="w-4 h-4" />
        </button>
      )}
      <div className="flex items-center justify-between mb-2">
        <h3
          className={`text-sm font-semibold ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          Facturas
        </h3>
        <div
          className={`${
            theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'
          } p-2 rounded-full`}
        >
          <FileText
            className={`w-5 h-5 ${
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
            }`}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar facturas..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full px-3 py-2 border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-800'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          <Search
            className={`absolute right-3 top-2.5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}
          />
        </div>
        <Button variant="filter" onClick={handleFilter}>
          <Filter className="w-4 h-4" />
        </Button>
        <Button
          variant="create"
          onClick={() => setIsFacturaPopupOpen?.(true)}
          >
          <Plus className="w-4 h-4 mr-1" />
          Crear
        </Button>
      </div>
      <div className="flex-grow overflow-auto custom-scrollbar">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {isExportMode && (
                <th className="px-4 py-2">
                  <input type="checkbox" disabled />
                </th>
              )}
              <th className="px-4 py-2">Número</th>
              <th className="px-4 py-2">Importe</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Tipo</th>
            </tr>
          </thead>
          <tbody
            className={`${
              theme === 'dark' ? 'bg-gray-700' : 'bg-white'
            } divide-y divide-gray-200`}
          >
            {filteredFacturas.map(factura => (
              <tr key={factura.id}>
                {isExportMode && (
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.includes(factura.id)}
                      onChange={e =>
                        handleCheckboxChange(factura.id, e.target.checked)
                      }
                    />
                  </td>
                )}
                <td className="px-4 py-2">{factura.numero}</td>
                <td className="px-4 py-2">
                  {factura.monto.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </td>
                <td className="px-4 py-2">{factura.estado}</td>
                <td className="px-4 py-2">{factura.tipo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className={`text-sm font-semibold mt-2 ${
          theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'
        }`}
      >
        Total pendiente:{' '}
        {totalPendiente.toLocaleString('es-ES', {
          style: 'currency',
          currency: 'EUR',
        })}
      </div>
      <div
        className={`text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        } mt-1`}
      >
        {facturas.length} facturas en total
      </div>
    </div>
  );
};

export default FacturasWidget;
