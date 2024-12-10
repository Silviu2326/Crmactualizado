import React, { useState, useEffect } from 'react';
import Table from '../../Common/Table';
import { useTheme } from '../../../contexts/ThemeContext';
import { Search, Filter, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import Button from '../../Common/Button';
import NuevoIngresoPopup from './NuevoIngresoPopup';
import FiltroIngresosPopup from './FiltroIngresosPopup';

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

const IngresosTabla: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedIngreso, setSelectedIngreso] = useState<Ingreso | null>(null);
  const [activeFilters, setActiveFilters] = useState<any>(null);

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

    fetchIngresos();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleAddSubmit = async (formData: any) => {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:3000/api/ingresos', {
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
        const response = await fetch(`http://localhost:3000/api/ingresos/${ingresoId}`, {
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
      const response = await fetch(`http://localhost:3000/api/ingresos/${ingresoId}/confirm`, {
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

      // Actualizar el estado del ingreso en la lista
      setIngresos(ingresos.map(ing => 
        ing._id === ingresoId ? { ...ing, estado: 'pagado' } : ing
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
    if (!activeFilters || !matchesSearch) return matchesSearch;

    // Then apply active filters
    const {
      fechaInicio,
      fechaFin,
      estado,
      planDePago,
      metodoPago,
      montoMinimo,
      montoMaximo
    } = activeFilters;

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
        headers={['Fecha', 'Descripción', 'Importe', 'Estado de pago', 'Cliente', 'Plan', 'Método de pago', 'Acciones']}
        data={filteredIngresos.map(ingreso => ({
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

      {showFilterModal && (
        <FiltroIngresosPopup
          onClose={() => setShowFilterModal(false)}
          onApplyFilters={handleApplyFilters}
        />
      )}
    </div>
  );
};

export default IngresosTabla;