import React, { useState, useEffect } from 'react';
import Table from '../../Common/Table';
import { useTheme } from '../../../contexts/ThemeContext';
import { Search, Filter } from 'lucide-react';
import Button from '../../Common/Button';

interface Ingreso {
  _id: string;
  entrenador: string;
  monto: number;
  moneda: string;
  fecha: string;
  descripcion: string;
}

const IngresosTabla: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const fetchIngresos = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        if (!token) {
          throw new Error('Token no encontrado. Por favor, inicia sesión nuevamente.');
        }

        console.log('Iniciando petición a la API de ingresos...');
        const response = await fetch('http://localhost:3000/api/ingresos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los ingresos.');
        }

        const data: Ingreso[] = await response.json();
        console.log('Datos crudos de ingresos recibidos:', data);

        // Log de cada ingreso individual
        data.forEach((ingreso, index) => {
          console.log(`Ingreso ${index + 1}:`, {
            id: ingreso._id,
            entrenador: ingreso.entrenador,
            monto: ingreso.monto,
            moneda: ingreso.moneda,
            fecha: ingreso.fecha,
            descripcion: ingreso.descripcion
          });
        });

        setIngresos(data);
        console.log('Total de ingresos cargados:', data.length);
      } catch (err: any) {
        console.error('Error al obtener ingresos:', err);
        setError(err.message || 'Error desconocido.');
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
    // Implementar lógica de filtrado
    console.log('Filtrar ingresos');
  };

  const filteredIngresos = ingresos.filter(ingreso =>
    ingreso.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ingreso.moneda.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ingreso.monto.toString().includes(searchTerm)
  );

  if (loading) {
    return <div className="text-center py-4">Cargando ingresos...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

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
        headers={['Fecha', 'Descripción', 'Monto', 'Moneda']}
        data={filteredIngresos.map(ingreso => ({
          Fecha: new Date(ingreso.fecha).toLocaleDateString(),
          Descripción: ingreso.descripcion,
          Monto: ingreso.monto.toLocaleString(),
          Moneda: ingreso.moneda
        }))}
        variant={theme === 'dark' ? 'dark' : 'white'}
      />
    </div>
  );
};

export default IngresosTabla;