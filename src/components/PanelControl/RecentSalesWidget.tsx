import React, { useState, useMemo } from 'react';
import Table from '../Common/Table';
import Button from '../Common/Button';
import { Search, Filter } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface IncomeData {
  'Fecha': string; // Puedes usar Date si prefieres manejar objetos Date
  'Estado del Pago': string;
  'Correo Electrónico': string;
  'Importe': string;
}

const IncomeWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();

  const incomeData: IncomeData[] = [
    { 'Fecha': '2024-04-01', 'Estado del Pago': 'Completado', 'Correo Electrónico': 'cliente1@example.com', 'Importe': '100€' },
    { 'Fecha': '2024-04-05', 'Estado del Pago': 'Pendiente', 'Correo Electrónico': 'cliente2@example.com', 'Importe': '150€' },
    { 'Fecha': '2024-04-10', 'Estado del Pago': 'Completado', 'Correo Electrónico': 'cliente3@example.com', 'Importe': '200€' },
    { 'Fecha': '2024-04-12', 'Estado del Pago': 'Cancelado', 'Correo Electrónico': 'cliente4@example.com', 'Importe': '75€' },
    { 'Fecha': '2024-04-15', 'Estado del Pago': 'Completado', 'Correo Electrónico': 'cliente5@example.com', 'Importe': '180€' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    // Implementar lógica de filtrado avanzado aquí si es necesario
    console.log('Filtrar ingresos');
  };

  // Utiliza useMemo para optimizar el filtrado
  const filteredData = useMemo(() => {
    if (!searchTerm) return incomeData;
    return incomeData.filter((item) =>
      Object.values(item).some((value) =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, incomeData]);

  return (
    <div className={`h-full flex flex-col p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <h3 className="text-lg font-semibold mb-4">Ingresos</h3>
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar ingresos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full px-3 py-2 pr-10 border ${
              theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-800'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <Search className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <Button variant="filter" onClick={handleFilter}>
          <Filter className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex-grow overflow-auto">
        <Table
          headers={['Fecha', 'Estado del Pago', 'Correo Electrónico', 'Importe']}
          data={filteredData}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      </div>
    </div>
  );
};

export default IncomeWidget;
