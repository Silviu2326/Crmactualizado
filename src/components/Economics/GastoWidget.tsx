// src/components/Economics/GastoWidget.tsx
import React, { useState, useEffect, useRef } from 'react';
import { DollarSign, TrendingDown, Search, Filter, Plus, Copy, Link, ChevronDown } from 'lucide-react';
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
  Importe: number;        // Mapeado desde 'monto' o 'importe'
  Moneda: string;         // Moneda del importe
  TipoDeGasto: 'fijo' | 'variable'; // Asignado como 'fijo'
  descripcion?: string;   // Opcional
  categoria?: string;     // Opcional, mapeado a 'Concepto'
}

interface FilterOptions {
  categoria: string;
  tipo: string;
  fechaDesde: string;
  fechaHasta: string;
  importeMin: string;
  importeMax: string;
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
  const filterRef = useRef<HTMLDivElement>(null);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categoria: '',
    tipo: '',
    fechaDesde: '',
    fechaHasta: '',
    importeMin: '',
    importeMax: ''
  });

  // Función para obtener el token del localStorage
  const getToken = (): string | null => {
    return localStorage.getItem('token'); // Asegúrate de que la clave sea correcta
  };

  // Función para obtener el valor del importe/monto
  const getImporte = (gasto: any): number => {
    if (!gasto) return 0;
    // Intentar obtener el valor de importe o monto, convertir a número y validar
    const valor = gasto.importe !== undefined ? gasto.importe : gasto.monto;
    const numeroValor = Number(valor);
    return isNaN(numeroValor) ? 0 : numeroValor;
  };

  // Función para formatear el importe
  const formatImporte = (importe: number | undefined, moneda: string): string => {
    if (importe === undefined || isNaN(Number(importe))) {
      return `0 ${moneda || 'EUR'}`;
    }
    try {
      return `${Number(importe).toLocaleString('es-ES')} ${moneda || 'EUR'}`;
    } catch (error) {
      console.error('Error al formatear importe:', error);
      return `${importe} ${moneda || 'EUR'}`;
    }
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

        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com//api/gastos', {
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
          Importe: getImporte(gasto),
          Moneda: gasto.moneda || 'EUR',
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

  // Cerrar el filtro cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = (gastos: Gasto[]) => {
    return gastos.filter(gasto => {
      const importeValor = getImporte(gasto);
      
      const matchesCategoria = !filterOptions.categoria || 
        gasto.categoria.toLowerCase().includes(filterOptions.categoria.toLowerCase());
      
      const matchesTipo = !filterOptions.tipo || 
        gasto.TipoDeGasto === filterOptions.tipo;
      
      const matchesFechaDesde = !filterOptions.fechaDesde || 
        new Date(gasto.Fecha) >= new Date(filterOptions.fechaDesde);
      
      const matchesFechaHasta = !filterOptions.fechaHasta || 
        new Date(gasto.Fecha) <= new Date(filterOptions.fechaHasta);
      
      const matchesImporteMin = !filterOptions.importeMin || 
        importeValor >= Number(filterOptions.importeMin);
      
      const matchesImporteMax = !filterOptions.importeMax || 
        importeValor <= Number(filterOptions.importeMax);

      return matchesCategoria && matchesTipo && matchesFechaDesde && 
             matchesFechaHasta && matchesImporteMin && matchesImporteMax;
    });
  };

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
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-3 py-2 border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
          />
          <Search className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <div className="flex gap-2 items-center relative" ref={filterRef}>
          <Button
            variant="filter"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </Button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute right-0 mt-2 w-80 p-4 rounded-lg shadow-lg z-50 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                }`}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Cawtegoría</label>
                    <input
                      type="text"
                      name="categoria"
                      value={filterOptions.categoria}
                      onChange={handleFilterChange}
                      className={`w-full px-3 py-2 rounded-md ${
                        theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
                      }`}
                      placeholder="Filtrar por categoría"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo</label>
                    <select
                      name="tipo"
                      value={filterOptions.tipo}
                      onChange={handleFilterChange}
                      className={`w-full px-3 py-2 rounded-md ${
                        theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
                      }`}
                    >
                      <option value="">Todos</option>
                      <option value="fijo">Fijo</option>
                      <option value="variable">Variable</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Fecha desde</label>
                      <input
                        type="date"
                        name="fechaDesde"
                        value={filterOptions.fechaDesde}
                        onChange={handleFilterChange}
                        className={`w-full px-3 py-2 rounded-md ${
                          theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Fecha hasta</label>
                      <input
                        type="date"
                        name="fechaHasta"
                        value={filterOptions.fechaHasta}
                        onChange={handleFilterChange}
                        className={`w-full px-3 py-2 rounded-md ${
                          theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Importe mínimo</label>
                      <input
                        type="number"
                        name="importeMin"
                        value={filterOptions.importeMin}
                        onChange={handleFilterChange}
                        className={`w-full px-3 py-2 rounded-md ${
                          theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
                        }`}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Importe máximo</label>
                      <input
                        type="number"
                        name="importeMax"
                        value={filterOptions.importeMax}
                        onChange={handleFilterChange}
                        className={`w-full px-3 py-2 rounded-md ${
                          theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
                        }`}
                        placeholder="999999"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
            data={applyFilters(filteredGastoData).map(item => ({
              Concepto: item.Concepto,
              Fecha: new Date(item.Fecha).toLocaleDateString('es-ES'),
              Estado: item.Estado,
              Importe: formatImporte(item.Importe, item.Moneda),
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
