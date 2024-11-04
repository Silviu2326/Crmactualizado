// GastoWidget.tsx
import React, { useState } from 'react';
import { DollarSign, TrendingDown, Search, Filter, Plus } from 'lucide-react';
import Table from '../Common/Table';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface GastoWidgetProps {
  title: string;
  isEditMode: boolean;
  onRemove: () => void;
  onAddGasto: () => void; // Nueva prop para abrir el popup
}

const GastoWidget: React.FC<GastoWidgetProps> = ({
  title,
  isEditMode,
  onRemove,
  onAddGasto, // Recibir la función desde el padre
}) => {
  const { theme = 'light' } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleGastoSubmit = (formData: any) => {
    console.log('Nuevo gasto:', formData);
    // Aquí puedes añadir lógica adicional si es necesario
  };

  // Datos de ejemplo para la tabla
  const gastoData = [
    { Concepto: 'Suministros', Fecha: '2023-05-01', Estado: 'Pagado', Importe: 2400, TipoDeGasto: 'Fijo' },
    { Concepto: 'Nóminas', Fecha: '2023-05-15', Estado: 'Pendiente', Importe: 3200, TipoDeGasto: 'Fijo' },
    { Concepto: 'Marketing', Fecha: '2023-05-10', Estado: 'Pagado', Importe: 1600, TipoDeGasto: 'Variable' },
    { Concepto: 'Mantenimiento', Fecha: '2023-05-20', Estado: 'Pagado', Importe: 800, TipoDeGasto: 'Variable' },
    { Concepto: 'Alquiler', Fecha: '2023-05-01', Estado: 'Pagado', Importe: 2000, TipoDeGasto: 'Fijo' },
    { Concepto: 'Servicios públicos', Fecha: '2023-05-05', Estado: 'Pendiente', Importe: 500, TipoDeGasto: 'Variable' },
    { Concepto: 'Seguros', Fecha: '2023-05-12', Estado: 'Pagado', Importe: 1200, TipoDeGasto: 'Fijo' },
    { Concepto: 'Equipamiento', Fecha: '2023-05-18', Estado: 'Pendiente', Importe: 3000, TipoDeGasto: 'Variable' },
  ];

  return (
    <div className={`p-4 h-full flex flex-col justify-between ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-red-50 text-gray-800'} rounded-lg relative`}>
      {isEditMode && (
        <button
          onClick={onRemove}
          className={`absolute top-2 right-2 ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'} bg-white rounded-full p-1 shadow-md`}
        >
          <TrendingDown className="w-4 h-4" />
        </button>
      )}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} truncate`}>{title}</h3>
        <div className={`${theme === 'dark' ? 'bg-red-900' : 'bg-red-100'} p-2 rounded-full`}>
          <DollarSign className={`w-5 h-5 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`} />
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar gastos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full px-3 py-2 border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
          />
          <Search className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <Button variant="filter" onClick={toggleFilter}>
          <Filter className="w-4 h-4" />
        </Button>
        <Button variant="create" onClick={onAddGasto}> {/* Llamar a la función pasada desde el padre */}
          <Plus className="w-4 h-4 mr-1" />
          Añadir
        </Button>
      </div>
      {isFilterOpen && (
        <div className={`mb-4 p-4 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-md shadow-sm`}>
          <p>Opciones de filtro (por implementar)</p>
        </div>
      )}
      <div className="flex-grow overflow-auto custom-scrollbar">
        <Table
          headers={['Concepto', 'Fecha', 'Estado', 'Importe', 'Tipo de Gasto']}
          data={gastoData.map(item => ({
            Concepto: item.Concepto,
            Fecha: item.Fecha,
            Estado: item.Estado,
            Importe: item.Importe.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }),
            'Tipo de Gasto': item.TipoDeGasto
          }))}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      </div>
    </div>
  );
};

export default GastoWidget;
