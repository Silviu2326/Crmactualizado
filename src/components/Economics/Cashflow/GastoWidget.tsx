// src/components/Economics/Cashflow/GastoWidget.tsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, CheckCircle, DollarSign, Link } from 'lucide-react';
import Table from '../../Common/Table';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import GastoPopup from '../../modals/GastoPopup';
import AsociarGastoPopup from '../../modals/AsociarGastoPopup';
import EdicionDeGastos from './EdicionDeGastos';
import FiltroGastosPopup from './FiltroGastosPopup';
import NuevoGastoPopup from './NuevoGastoPopup';

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
  estado?: string;
}

const GastoWidget: React.FC<GastoWidgetProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedGastoId, setSelectedGastoId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAsociando, setIsAsociando] = useState(false);
  const [expandedServices, setExpandedServices] = useState<number[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [selectedGasto, setSelectedGasto] = useState<Gasto | null>(null);
  const { theme } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAsociacionPopupOpen, setIsAsociacionPopupOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    fechaInicio: '',
    fechaFin: '',
    estado: '',
    categoria: '',
    tipo: '',
    montoMinimo: '',
    montoMaximo: ''
  });

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

      const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/gastos', {
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
          tipo: gasto.tipo || 'fijo',
          estado: gasto.estado || 'pendiente'
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

  const handleEdit = (gasto: Gasto) => {
    setSelectedGasto(gasto);
    setIsEditing(true);
  };

  const handleEditSave = async (gastoActualizado: Gasto) => {
    setGastos(gastos.map(g => 
      g._id === gastoActualizado._id ? gastoActualizado : g
    ));
    setIsEditing(false);
    setSelectedGasto(null);
  };

  const handleDelete = async (gastoId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token no encontrado');
      }

      const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/gastos/${gastoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el gasto');
      }

      setGastos(gastos.filter(gasto => gasto._id !== gastoId));
    } catch (error) {
      console.error('Error al eliminar:', error);
      setError(error instanceof Error ? error.message : 'Error al eliminar el gasto');
    }
  };

  const handleConfirmPayment = async (gastoId: string) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token no encontrado');
      }

      const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/gastos/${gastoId}/confirm`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: 'pagado' }),
      });

      if (!response.ok) {
        throw new Error('Error al confirmar el pago');
      }

      // Actualizar el estado del gasto en la lista
      setGastos(gastos.map(gasto => 
        gasto._id === gastoId ? { ...gasto, estado: 'pagado' } : gasto
      ));
    } catch (error) {
      console.error('Error al confirmar:', error);
      setError(error instanceof Error ? error.message : 'Error al confirmar el pago');
    }
  };

  const handleSubmit = async (nuevoGasto: any) => {
    try {
      const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/gastos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(nuevoGasto),
      });

      if (!response.ok) {
        throw new Error('Error al crear el gasto');
      }

      const gastoCreado = await response.json();
      setGastos([...gastos, gastoCreado]);
      setIsPopupOpen(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedGastoId(null);
    setIsEditing(false);
  };

  const handleAsociarGasto = (gastoId: string) => {
    setSelectedGastoId(gastoId);
    setIsAsociacionPopupOpen(true);
  };

  const handleAsociacionSubmit = async (tipo: string, id: string) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token no encontrado');
      }

      const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/gastos/${selectedGastoId}/asociar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tipo,
          id
        })
      });

      if (!response.ok) {
        throw new Error('Error al asociar el gasto');
      }

      // Actualizar la lista de gastos
      await fetchGastos();
      setIsAsociacionPopupOpen(false);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Error al asociar el gasto');
    }
  };

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

  // Función para contar filtros activos
  const getActiveFiltersCount = () => {
    return Object.values(filterOptions).filter(value => value !== '').length;
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilterOptions({
      fechaInicio: '',
      fechaFin: '',
      estado: '',
      categoria: '',
      tipo: '',
      montoMinimo: '',
      montoMaximo: ''
    });
  };

  const applyFilters = () => {
    const filteredGastos = gastos.filter(gasto => {
      if (filterOptions.fechaInicio && new Date(gasto.fecha) < new Date(filterOptions.fechaInicio)) return false;
      if (filterOptions.fechaFin && new Date(gasto.fecha) > new Date(filterOptions.fechaFin)) return false;
      if (filterOptions.estado && gasto.estado !== filterOptions.estado) return false;
      if (filterOptions.categoria && gasto.categoria !== filterOptions.categoria) return false;
      if (filterOptions.tipo && gasto.tipo !== filterOptions.tipo) return false;
      if (filterOptions.montoMinimo && getImporte(gasto) < parseFloat(filterOptions.montoMinimo)) return false;
      if (filterOptions.montoMaximo && getImporte(gasto) > parseFloat(filterOptions.montoMaximo)) return false;
      return true;
    });

    setGastos(filteredGastos);
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
        <div className="relative">
          <Button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            variant="filter"
          >
            <Filter className="w-4 h-4" />
            {getActiveFiltersCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {getActiveFiltersCount()}
              </span>
            )}
          </Button>
          {isFilterOpen && (
            <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } ring-1 ring-black ring-opacity-5 z-50`}>
              <FiltroGastosPopup
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={() => {
                  applyFilters();
                  setIsFilterOpen(false);
                }}
                onClearFilters={handleClearFilters}
              />
            </div>
          )}
        </div>
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
            headers={['Fecha', 'Categoría', 'Descripción', 'Tipo', 'Importe', 'Estado', 'Acciones']}
            data={filteredGastos.map(gasto => {
              const importeValor = getImporte(gasto);
              console.log('Renderizando gasto:', gasto, 'Importe calculado:', importeValor);
              
              return {
                'Fecha': new Date(gasto.fecha).toLocaleDateString(),
                'Categoría': gasto.categoria || 'Sin categoría',
                'Descripción': gasto.descripcion || '-',
                'Tipo': gasto.tipo || 'fijo',
                'Importe': formatImporte(importeValor, gasto.moneda),
                'Estado': (gasto.estado || 'pendiente').charAt(0).toUpperCase() + 
                         (gasto.estado || 'pendiente').slice(1),
                'Acciones': (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAsociarGasto(gasto._id)}
                      className={`p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}
                      title="Asociar Gasto"
                    >
                      <Link size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(gasto)}
                      className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                      }`}
                      title="Modificar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(gasto._id)}
                      className={`p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                    {(!gasto.estado || gasto.estado !== 'pagado') && (
                      <button
                        onClick={() => handleConfirmPayment(gasto._id)}
                        className={`p-1.5 rounded-full hover:bg-green-100 dark:hover:bg-green-900 transition-colors ${
                          theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}
                        title="Confirmar pago"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                  </div>
                )
              };
            })}
            variant={theme === 'dark' ? 'dark' : 'white'}
          />
        )}
      </div>

      <AnimatePresence>
        {isPopupOpen && (
          <NuevoGastoPopup
            onClose={() => setIsPopupOpen(false)}
            onSubmit={handleSubmit}
          />
        )}

        {isEditing && selectedGasto && (
          <EdicionDeGastos
            gasto={selectedGasto}
            onClose={() => {
              setIsEditing(false);
              setSelectedGasto(null);
            }}
            onSave={handleEditSave}
          />
        )}

        {isAsociacionPopupOpen && selectedGastoId && (
          <AsociarGastoPopup
            gastoId={selectedGastoId}
            onClose={() => setIsAsociacionPopupOpen(false)}
            onSubmit={handleAsociacionSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GastoWidget;
