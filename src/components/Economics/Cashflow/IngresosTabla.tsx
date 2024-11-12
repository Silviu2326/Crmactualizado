import React, { useState } from 'react';
import Table from '../../Common/Table';
import { useTheme } from '../../../contexts/ThemeContext';
import { Search, Filter } from 'lucide-react';
import Button from '../../Common/Button';

const IngresosTabla: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const ingresos = [
    { fecha: '2023-08-01', concepto: 'Venta de servicios', monto: 5000 },
    { fecha: '2023-08-02', concepto: 'Suscripciones', monto: 3000 },
    { fecha: '2023-08-03', concepto: 'Venta de productos', monto: 2500 },
    { fecha: '2023-08-04', concepto: 'Consultoría', monto: 4000 },
    { fecha: '2023-08-05', concepto: 'Eventos', monto: 6000 },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    // Implementar lógica de filtrado
    console.log('Filtrar ingresos');
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar ingresos..."
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
      <Table
        headers={['Fecha', 'Concepto', 'Monto']}
        data={ingresos.map(ingreso => ({
          Fecha: ingreso.fecha,
          Concepto: ingreso.concepto,
          Monto: `$${ingreso.monto.toLocaleString()}`
        }))}
        variant={theme === 'dark' ? 'dark' : 'white'}
      />
    </div>
  );
};

export default IngresosTabla;