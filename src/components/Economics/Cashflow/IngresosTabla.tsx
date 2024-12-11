import React, { useState, useEffect, useRef } from 'react';
import Table from '../../Common/Table';
import { useTheme } from '../../../contexts/ThemeContext';
import { Search, Filter, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import Button from '../../Common/Button';
import NuevoIngresoPopup from './NuevoIngresoPopup';
import { motion, AnimatePresence } from 'framer-motion';

interface Cliente {
  _id: string;
  nombre: string;
  email: string;
}

interface PlanDePago {
  _id: string;
  nombre: string;
  precio: number;
}

interface Ingreso {
  _id: string;
  entrenador: string;
  cliente: Cliente;
  planDePago: PlanDePago;
  monto: number;
  moneda: string;
  estado: string;
  metodoPago: string;
  fecha: string;
  descripcion: string;
}

interface FilterOptions {
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  planDePago: string;
  metodoPago: string;
  montoMinimo: string;
  montoMaximo: string;
}

const IngresosTabla: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedIngreso, setSelectedIngreso] = useState<Ingreso | null>(null);
  const [planesDePago, setPlanesDePago] = useState<PlanDePago[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);
  
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    fechaInicio: '',
    fechaFin: '',
    estado: '',
    planDePago: '',
    metodoPago: '',
    montoMinimo: '',
    montoMaximo: ''
  });

  const getToken = () => localStorage.getItem('token');

  const fetchIngresos = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token no encontrado. Por favor, inicia sesión nuevamente.');
      }

      console.log('Iniciando petición a la API de ingresos...');
      const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/ingresos', {
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
          cliente: ingreso.cliente,
          planDePago: ingreso.planDePago,
          monto: ingreso.monto,
          moneda: ingreso.moneda,
          estado: ingreso.estado,
          metodoPago: ingreso.metodoPago,
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({ ...prev, [name]: value }));
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Cerrar el filtro cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cargar planes de pago
  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const token = getToken();
        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/planes-de-pago', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch planes de pago');
        }
        const data = await response.json();
        setPlanesDePago(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching planes:', error);
        setPlanesDePago([]);
      }
    };

    fetchPlanes();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    const applyFilters = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        if (!token) {
          throw new Error('Token no encontrado');
        }

        const queryParams = new URLSearchParams();
        if (filterOptions.fechaInicio) queryParams.append('fechaInicio', filterOptions.fechaInicio);
        if (filterOptions.fechaFin) queryParams.append('fechaFin', filterOptions.fechaFin);
        if (filterOptions.estado) queryParams.append('estado', filterOptions.estado);
        if (filterOptions.planDePago) queryParams.append('planDePago', filterOptions.planDePago);
        if (filterOptions.metodoPago) queryParams.append('metodoPago', filterOptions.metodoPago);
        if (filterOptions.montoMinimo) queryParams.append('montoMinimo', filterOptions.montoMinimo);
        if (filterOptions.montoMaximo) queryParams.append('montoMaximo', filterOptions.montoMaximo);

        const url = `https://fitoffice2-f70b52bef77e.herokuapp.com/api/ingresos?${queryParams.toString()}`;
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los ingresos filtrados');
        }

        const data = await response.json();
        setIngresos(data);
      } catch (err: any) {
        console.error('Error al filtrar ingresos:', err);
        setError(err.message || 'Error al filtrar los ingresos');
      } finally {
        setLoading(false);
      }
    };

    applyFilters();
  }, [filterOptions]);

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleAddSubmit = async (formData: any) => {
    try {
      const token = getToken();
      const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/ingresos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el ingreso');
      }

      const newIngreso = await response.json();
      setIngresos([...ingresos, newIngreso]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error al crear ingreso:', error);
    }
  };

  const handleEdit = (ingreso: Ingreso) => {
    setSelectedIngreso(ingreso);
    setShowEditModal(true);
  };

  const handleDelete = async (ingresoId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este ingreso?')) {
      try {
        const token = getToken();
        const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/ingresos/${ingresoId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el ingreso');
        }

        setIngresos(ingresos.filter(ing => ing._id !== ingresoId));
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  const handleConfirm = async (ingresoId: string) => {
    try {
      const token = getToken();
      const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/ingresos/${ingresoId}/estado`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: 'pagado' }),
      });

      if (!response.ok) {
        throw new Error('Error al confirmar el pago');
      }

      const updatedIngreso = await response.json();
      // Actualizar el estado del ingreso en la lista con los datos devueltos por el servidor
      setIngresos(ingresos.map(ing => 
        ing._id === ingresoId ? updatedIngreso : ing
      ));
    } catch (error) {
      console.error('Error al confirmar:', error);
    }
  };

  const filteredIngresos = ingresos.filter(ingreso => {
    // First apply search term filter
    const matchesSearch = 
      ingreso.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingreso.moneda?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingreso.monto?.toString().includes(searchTerm) ||
      ingreso.cliente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingreso.planDePago?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingreso.estado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingreso.metodoPago?.toLowerCase().includes(searchTerm.toLowerCase());

    // If there are no active filters or search term doesn't match, return early
    if (!filterOptions.fechaInicio && !filterOptions.fechaFin && !filterOptions.estado && !filterOptions.planDePago && !filterOptions.metodoPago && !filterOptions.montoMinimo && !filterOptions.montoMaximo || !matchesSearch) return matchesSearch;

    // Then apply active filters
    const {
      fechaInicio,
      fechaFin,
      estado,
      planDePago,
      metodoPago,
      montoMinimo,
      montoMaximo
    } = filterOptions;

    // Date filter
    const ingresoDate = new Date(ingreso.fecha);
    if (fechaInicio && new Date(fechaInicio) > ingresoDate) return false;
    if (fechaFin && new Date(fechaFin) < ingresoDate) return false;

    // Estado filter
    if (estado && ingreso.estado !== estado) return false;

    // Plan de pago filter
    if (planDePago && ingreso.planDePago?._id !== planDePago) return false;

    // Método de pago filter
    if (metodoPago && ingreso.metodoPago !== metodoPago) return false;

    // Monto filter
    if (montoMinimo && ingreso.monto < parseFloat(montoMinimo)) return false;
    if (montoMaximo && ingreso.monto > parseFloat(montoMaximo)) return false;

    return true;
  });

  useEffect(() => {
    fetchIngresos();
  }, []);

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
        <div className="flex gap-2 items-center relative" ref={filterRef}>
          <Button variant="filter" onClick={handleFilter}>
            <Filter className="w-4 h-4" />
          </Button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute right-0 mt-10 p-4 rounded-lg shadow-lg z-50 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                } min-w-[300px]`}
              >
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Estado</label>
                    <select
                      name="estado"
                      value={filterOptions.estado}
                      onChange={handleFilterChange}
                      className={`w-full p-2 rounded-md ${
                        theme === 'dark' 
                          ? 'bg-gray-600 text-white' 
                          : 'bg-white text-gray-800'
                      }`}
                    >
                      <option value="">Todos</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="pagado">Pagado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Plan de Pago</label>
                    <select
                      name="planDePago"
                      value={filterOptions.planDePago}
                      onChange={handleFilterChange}
                      className={`w-full p-2 rounded-md ${
                        theme === 'dark' 
                          ? 'bg-gray-600 text-white' 
                          : 'bg-white text-gray-800'
                      }`}
                    >
                      <option value="">Todos</option>
                      {Array.isArray(planesDePago) && planesDePago.map(plan => (
                        <option key={plan._id} value={plan._id}>
                          {plan.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Método de Pago</label>
                    <select
                      name="metodoPago"
                      value={filterOptions.metodoPago}
                      onChange={handleFilterChange}
                      className={`w-full p-2 rounded-md ${
                        theme === 'dark' 
                          ? 'bg-gray-600 text-white' 
                          : 'bg-white text-gray-800'
                      }`}
                    >
                      <option value="">Todos</option>
                      <option value="efectivo">Efectivo</option>
                      <option value="tarjeta">Tarjeta</option>
                      <option value="transferencia">Transferencia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha desde</label>
                    <input
                      type="date"
                      name="fechaInicio"
                      value={filterOptions.fechaInicio}
                      onChange={handleFilterChange}
                      className={`w-full p-2 rounded-md ${
                        theme === 'dark' 
                          ? 'bg-gray-600 text-white' 
                          : 'bg-white text-gray-800'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha hasta</label>
                    <input
                      type="date"
                      name="fechaFin"
                      value={filterOptions.fechaFin}
                      onChange={handleFilterChange}
                      className={`w-full p-2 rounded-md ${
                        theme === 'dark' 
                          ? 'bg-gray-600 text-white' 
                          : 'bg-white text-gray-800'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Importe mínimo</label>
                    <input
                      type="number"
                      name="montoMinimo"
                      value={filterOptions.montoMinimo}
                      onChange={handleFilterChange}
                      placeholder="0"
                      className={`w-full p-2 rounded-md ${
                        theme === 'dark' 
                          ? 'bg-gray-600 text-white' 
                          : 'bg-white text-gray-800'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Importe máximo</label>
                    <input
                      type="number"
                      name="montoMaximo"
                      value={filterOptions.montoMaximo}
                      onChange={handleFilterChange}
                      placeholder="999999"
                      className={`w-full p-2 rounded-md ${
                        theme === 'dark' 
                          ? 'bg-gray-600 text-white' 
                          : 'bg-white text-gray-800'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className={`max-h-[600px] overflow-y-auto ${
        theme === 'dark' ? 'scrollbar-dark' : 'scrollbar-light'
      }`}>
        <style jsx>{`
          .scrollbar-dark::-webkit-scrollbar {
            width: 8px;
          }
          .scrollbar-dark::-webkit-scrollbar-track {
            background: #374151;
            border-radius: 4px;
          }
          .scrollbar-dark::-webkit-scrollbar-thumb {
            background: #4B5563;
            border-radius: 4px;
          }
          .scrollbar-dark::-webkit-scrollbar-thumb:hover {
            background: #6B7280;
          }
          .scrollbar-light::-webkit-scrollbar {
            width: 8px;
          }
          .scrollbar-light::-webkit-scrollbar-track {
            background: #F3F4F6;
            border-radius: 4px;
          }
          .scrollbar-light::-webkit-scrollbar-thumb {
            background: #D1D5DB;
            border-radius: 4px;
          }
          .scrollbar-light::-webkit-scrollbar-thumb:hover {
            background: #9CA3AF;
          }
        `}</style>

        <Table
          headers={['Fecha', 'Descripción', 'Importe', 'Estado de pago', 'Cliente', 'Plan', 'Método de pago', 'Acciones']}
          data={filteredIngresos.slice(0, 10).map(ingreso => ({
            Fecha: new Date(ingreso.fecha).toLocaleDateString(),
            Descripción: ingreso.descripcion || 'Sin descripción',
            Importe: `${ingreso.monto.toLocaleString()} ${ingreso.moneda}`,
            'Estado de pago': (ingreso.estado || 'pendiente').charAt(0).toUpperCase() + 
                          (ingreso.estado || 'pendiente').slice(1),
            Cliente: ingreso.cliente?.nombre || 'Cliente no especificado',
            Plan: ingreso.planDePago?.nombre || 'Plan no especificado',
            'Método de pago': (ingreso.metodoPago || 'No especificado').charAt(0).toUpperCase() + 
                          (ingreso.metodoPago || 'No especificado').slice(1),
            Acciones: (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(ingreso)}
                  className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                  }`}
                  title="Modificar"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(ingreso._id)}
                  className={`p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors ${
                    theme === 'dark' ? 'text-red-400' : 'text-red-600'
                  }`}
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
                {(!ingreso.metodoPago || ingreso.metodoPago.toLowerCase() === 'efectivo') && 
                (!ingreso.estado || ingreso.estado !== 'pagado') && (
                  <button
                    onClick={() => handleConfirm(ingreso._id)}
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
          }))}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      </div>

      {filteredIngresos.length > 10 && (
        <div className="text-center text-sm text-gray-500 mt-2">
          Mostrando 10 de {filteredIngresos.length} ingresos. Desplázate para ver más.
        </div>
      )}

      <div className="mt-4">
        <Button
          variant="primary"
          onClick={handleAdd}
          className="flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Añadir Ingreso</span>
        </Button>
      </div>

      {showAddModal && (
        <NuevoIngresoPopup
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddSubmit}
        />
      )}
    </div>
  );
};

export default IngresosTabla;