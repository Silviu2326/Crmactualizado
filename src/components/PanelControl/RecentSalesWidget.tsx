import React, { useState, useMemo, useEffect } from 'react';
import Table from '../Common/Table';
import Button from '../Common/Button';
import { Search, Filter } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Income {
  _id: string;
  entrenador: string;
  monto: number;
  moneda: string;
  fecha: string;
  descripcion: string;
  estado: string;
}

interface FormattedIncome {
  'Fecha': string;
  'Estado del Pago': string;
  'Descripción': string;
  'Importe': string;
}

const IncomeWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ingresos, setIngresos] = useState<FormattedIncome[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/ingresos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los ingresos');
        }

        const data: Income[] = await response.json();
        const formattedData = data.map(item => ({
          'Fecha': new Date(item.fecha).toLocaleDateString(),
          'Estado del Pago': item.estado,
          'Descripción': item.descripcion,
          'Importe': `${item.monto} ${item.moneda}`
        }));
        setIngresos(formattedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIngresos();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    // Implementar lógica de filtrado avanzado aquí si es necesario
    console.log('Filtrar ingresos');
  };

  // Utiliza useMemo para optimizar el filtrado
  const filteredData = useMemo(() => {
    if (!searchTerm) return ingresos;
    return ingresos.filter((item) =>
      Object.values(item).some((value) =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, ingresos]);

  if (loading) {
    return (
      <div className={`h-full flex flex-col p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <h3 className="text-lg font-semibold mb-4">Ingresos</h3>
        <div className="flex-grow flex items-center justify-center">
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`h-full flex flex-col p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <h3 className="text-lg font-semibold mb-4">Ingresos</h3>
        <div className="flex-grow flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

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
          headers={['Fecha', 'Estado del Pago', 'Descripción', 'Importe']}
          data={filteredData}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      </div>
    </div>
  );
};

export default IncomeWidget;
