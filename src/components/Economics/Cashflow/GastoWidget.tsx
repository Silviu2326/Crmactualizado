// src/components/Economics/Cashflow/GastoWidget.tsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Copy, Link, X, ChevronDown, ChevronRight, DollarSign } from 'lucide-react';
import Table from '../../Common/Table';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import GastoPopup from '../../modals/GastoPopup';

interface GastoWidgetProps { }

interface Gasto {
  _id: string;
  entrenador: string;
  importe?: number;
  monto?: number;
  moneda: string;
  fecha: string;
  descripcion: string;
  categoria: string;
  tipo: 'fijo' | 'variable';
}

const GastoWidget: React.FC<GastoWidgetProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedGastoId, setSelectedGastoId] = useState<string | null>(null);
  const [expandedServices, setExpandedServices] = useState<number[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const { theme } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const servicios: any[] = [
    {
      id: 1,
      nombre: 'Entrenamiento Personal',
      planes: [
        { id: 1, nombre: 'Plan Básico' },
        { id: 2, nombre: 'Plan Avanzado' },
        { id: 3, nombre: 'Plan Elite' },
      ]
    },
    {
      id: 2,
      nombre: 'Clases Grupales',
      planes: [
        { id: 4, nombre: 'Plan Mensual' },
        { id: 5, nombre: 'Plan Trimestral' },
      ]
    },
    {
      id: 3,
      nombre: 'Nutrición',
      planes: [
        { id: 6, nombre: 'Consulta Individual' },
        { id: 7, nombre: 'Plan Seguimiento' },
      ]
    },
  ];

  // Función para obtener el token del localStorage
  const getToken = (): string | null => {
    return localStorage.getItem('token'); // Asegúrate de que la clave sea correcta
  };

  // Función para obtener el importe independientemente de si viene como monto o importe
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

  // Función para obtener los gastos desde la API
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
        throw new Error(errorData.message || 'Error al obtener los gastos');
      }

      const data = await response.json();
      console.log('Datos recibidos del servidor:', data);

      // Mapear los datos recibidos a la interfaz Gasto
      const gastosFormateados = data.map((gasto: any) => {
        const importeValor = getImporte(gasto);
        console.log('Procesando gasto:', gasto, 'Importe calculado:', importeValor);
        
        return {
          _id: gasto._id || '',
          entrenador: gasto.entrenador || '',
          importe: importeValor,
          moneda: gasto.moneda || 'EUR',
          fecha: gasto.fecha || new Date().toISOString(),
          descripcion: gasto.descripcion || '',
          categoria: gasto.categoria || 'Sin categoría',
          tipo: gasto.tipo || 'fijo'
        };
      });

      console.log('Gastos formateados:', gastosFormateados);
      setGastos(gastosFormateados);
    } catch (err) {
      console.error('Error al obtener gastos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGastos();
  }, []);

  // Función de búsqueda y filtrado
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    console.log('Filtrar gastos');
    // Implementa aquí la lógica de filtrado avanzada si es necesario
  };

  const handleAddGasto = async (formData: any) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token no encontrado. Por favor, inicia sesión nuevamente.');
      }

      // Adaptar el formData para que coincida con la estructura esperada por el backend
      const gastoData = {
        monto: formData.importe,
        moneda: formData.moneda,
        descripcion: formData.descripcion,
        categoria: formData.categoria
      };

      const response = await fetch('http://localhost:3000/api/gastos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(gastoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el gasto');
      }

      // Recargar la lista de gastos después de crear uno nuevo
      await fetchGastos();
      setIsPopupOpen(false);
    } catch (err) {
      console.error('Error al crear el gasto:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const handleCopyGasto = (id: string) => {
    console.log(`Copiar gasto con ID: ${id}`);
    // Implementa aquí la lógica para copiar el gasto (e.g., copiar al portapapeles)
  };

  const handleAsociarGasto = (id: string) => {
    setSelectedGastoId(id);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedGastoId(null);
    setExpandedServices([]);
  };

  const toggleServiceExpansion = (serviceId: number) => {
    setExpandedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleAddServicio = () => {
    console.log('Añadir nuevo servicio');
    // Implementa aquí la lógica para añadir un nuevo servicio
  };

  const handleAddPlan = (servicioId: number) => {
    console.log(`Añadir nuevo plan al servicio ${servicioId}`);
    // Implementa aquí la lógica para añadir un nuevo plan al servicio correspondiente
  };

  const handleAsociar = (tipo: 'Servicio' | 'Plan', id: number, nombre: string) => {
    if (!selectedGastoId) return;

    setGastos(prevGastos =>
      prevGastos.map(gasto =>
        gasto._id === selectedGastoId
          ? { ...gasto, descripcion: `${tipo}: ${nombre}` } // Ajusta según tus necesidades
          : gasto
      )
    );
    handleClosePopup();
  };

  // Filtrar los gastos según el término de búsqueda
  const filteredGastos = gastos.filter((gasto) => {
    console.log('Procesando gasto:', gasto); // Log para depuración

    if (!gasto.categoria) {
      console.warn('Gasto sin categoría:', gasto);
      return false;
    }

    const search = searchTerm.toLowerCase();
    const categoriaMatch = gasto.categoria.toLowerCase().includes(search);
    const descripcionMatch = gasto.descripcion ? gasto.descripcion.toLowerCase().includes(search) : false;

    return categoriaMatch || descripcionMatch;
  });

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
          Gastos
        </h3>
        <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'}`}>
          <DollarSign className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} />
        </div>
      </div>
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar gastos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full px-4 py-2 pr-10 border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-800'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
          />
          <Search className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <Button variant="filter" onClick={handleFilter} className="px-4 py-2">
          <Filter className="w-5 h-5 mr-2" />
          Filtrar
        </Button>
        <Button variant="create" onClick={() => setIsPopupOpen(true)} className="px-4 py-2">
          <Plus className="w-5 h-5 mr-2" />
          Añadir Gasto
        </Button>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <Table
            headers={['Fecha', 'Categoría', 'Descripción', 'Tipo', 'Importe']}
            data={filteredGastos.map(gasto => {
              const importeValor = getImporte(gasto);
              console.log('Renderizando gasto:', gasto, 'Importe calculado:', importeValor);
              
              return {
                'Fecha': new Date(gasto.fecha).toLocaleDateString(),
                'Categoría': gasto.categoria || 'Sin categoría',
                'Descripción': gasto.descripcion || '-',
                'Tipo': gasto.tipo || 'fijo',
                'Importe': formatImporte(importeValor, gasto.moneda)
              };
            })}
            variant={theme === 'dark' ? 'dark' : 'white'}
          />
        )}
      </div>

      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={handleClosePopup}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-8 rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <GastoPopup
                isOpen={isPopupOpen}
                onClose={handleClosePopup}
                onSubmit={handleAddGasto}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

};

export default GastoWidget;
