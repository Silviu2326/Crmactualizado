import React, { useState } from 'react';
import { FileText, Search, Filter, Plus } from 'lucide-react';
import Table from '../common/Table';
import Button from '../common/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface Factura {
  id: number;
  numero: string;
  monto: number;
  estado: 'Pagada' | 'Pendiente';
}

interface FacturasWidgetProps {
  facturas: Factura[];
  isEditMode: boolean;
  onRemove: () => void;
}

const FacturasWidget: React.FC<FacturasWidgetProps> = ({
  facturas,
  isEditMode,
  onRemove,
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
    // Implementar lógica de filtrado
    console.log('Filtrar facturas');
  };

  const handleCreate = () => {
    // Implementar lógica para crear nueva factura
    console.log('Crear nueva factura');
  };

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
        <Button variant="create" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-1" />
          Crear
        </Button>
      </div>
      <div className="flex-grow overflow-auto custom-scrollbar">
        <Table
          headers={['Número', 'Monto', 'Estado']}
          data={facturas.map((factura) => ({
            Número: factura.numero,
            Monto: factura.monto.toLocaleString('es-ES', {
              style: 'currency',
              currency: 'EUR',
            }),
            Estado: factura.estado,
          }))}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
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
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === 'dark' ? '#2D3748' : '#F7FAFC'};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? '#4A5568' : '#CBD5E0'};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? '#718096' : '#A0AEC0'};
        }
      `}</style>
    </div>
  );
};

export default FacturasWidget;
