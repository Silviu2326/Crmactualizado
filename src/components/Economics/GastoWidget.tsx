// src/components/Economics/Cashflow/GastoWidget.tsx
import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingDown, Search, Filter, Plus, Copy, Link } from 'lucide-react';
import Table from '../Common/Table';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface GastoWidgetProps {
  title: string;
  isEditMode: boolean;
  onRemove: () => void;
  onAddGasto: () => void; // Nueva prop para abrir el popup
}

// Definición de la interfaz Gasto dentro del mismo archivo
interface Gasto {
  _id: string;
  Concepto: string;        // Mapeado desde 'categoria'
  Fecha: string;          // Mapeado desde 'fecha'
  Estado: string;         // Asignado como 'Pendiente'
  Importe: number;        // Mapeado desde 'monto'
  TipoDeGasto: 'fijo' | 'variable'; // Asignado como 'fijo'
  descripcion?: string;   // Opcional
  categoria?: string;     // Opcional, mapeado a 'Concepto'
}

const GastoWidget: React.FC<GastoWidgetProps> = ({
  title,
  isEditMode,
  onRemove,
  onAddGasto,
}) => {
  const { theme = 'light' } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gastoData, setGastoData] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener el token del localStorage
  const getToken = (): string | null => {
    return localStorage.getItem('token'); // Asegúrate de que la clave sea correcta
  };

  // Función para formatear el importe
  const formatImporte = (importe: number): string => {
    return importe.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
  };

  useEffect(() => {
    const fetchGastos = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        if (!token) {
          throw new Error('Token no encontrado. Por favor, inicia sesión nuevamente.');
        }

        const response = await fetch('http://localhost:3000/api/gastos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener los gastos.');
        }

        const data = await response.json();
        console.log('Datos obtenidos de la API:', data); // Log agregado

        // Mapear los datos recibidos a la interfaz Gasto
        const dataMapped: Gasto[] = data.map((gasto: any) => ({
          _id: gasto._id,
          Concepto: gasto.categoria || 'N/A',        // Mapear 'categoria' a 'Concepto'
          Fecha: gasto.fecha,
          Estado: 'Pendiente',                       // Asignar valor predeterminado
          Importe: gasto.monto,
          TipoDeGasto: 'fijo',                        // Asignar valor predeterminado
          descripcion: gasto.descripcion,
          categoria: gasto.categoria,
        }));

        setGastoData(dataMapped);
      } catch (err: any) {
        console.error('Error al obtener gastos:', err);
        setError(err.message || 'Error desconocido.');
      } finally {
        setLoading(false);
      }
    };

    fetchGastos();
  }, []);

  // Filtrar los datos según el término de búsqueda
  const filteredGastoData = gastoData.filter((gasto) => {
    console.log('Procesando gasto:', gasto); // Log agregado

    if (!gasto.Concepto) {
      console.warn('Gasto sin concepto:', gasto);
      return false;
    }

    const search = searchTerm.toLowerCase();
    const conceptoMatch = gasto.Concepto.toLowerCase().includes(search);
    const descripcionMatch = gasto.descripcion ? gasto.descripcion.toLowerCase().includes(search) : false;
    const categoriaMatch = gasto.categoria ? gasto.categoria.toLowerCase().includes(search) : false;

    return conceptoMatch || descripcionMatch || categoriaMatch;
  });

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
        <Button variant="filter" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <Filter className="w-4 h-4" />
        </Button>
        <Button variant="create" onClick={onAddGasto}>
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
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <Table
            headers={['Concepto', 'Fecha', 'Estado', 'Importe', 'Tipo de Gasto']}
            data={filteredGastoData.map(item => ({
              Concepto: item.Concepto,
              Fecha: new Date(item.Fecha).toLocaleDateString('es-ES'),
              Estado: item.Estado,
              Importe: formatImporte(item.Importe),
              'Tipo de Gasto': item.TipoDeGasto.charAt(0).toUpperCase() + item.TipoDeGasto.slice(1),
            }))}
            variant={theme === 'dark' ? 'dark' : 'white'}
          />
        )}
      </div>
    </div>
  );

  // Manejo del cambio en el campo de búsqueda
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }
};

export default GastoWidget;
