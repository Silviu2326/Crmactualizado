// src/components/Economics/GastoWidget.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DollarSign, TrendingDown, Search, Filter, Plus, Copy, Link, ChevronDown, Trash2, Edit2 } from 'lucide-react';
import Table from '../Common/Table';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

interface GastoWidgetProps {
  title: string;
  onAddClick: () => void;
}

interface Gasto {
  _id: string;
  entrenador: string;
  importe: number;
  moneda: string;
  fecha: string;
  descripcion: string;
  categoria: string;
  tipo: string;
  client?: {
    _id: string;
    nombre: string;
    email: string;
  };
}

const GastoWidget: React.FC<GastoWidgetProps> = ({ title, onAddClick }) => {
  const { theme = 'light' } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const [selectedGastoId, setSelectedGastoId] = useState<string | null>(null);
  const [isAsociacionPopupOpen, setIsAsociacionPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGasto, setSelectedGasto] = useState<Gasto | null>(null);

  // Función para obtener el token del localStorage
  const getToken = (): string | null => {
    return localStorage.getItem('token'); // Asegúrate de que la clave sea correcta
  };

  // Función para obtener los gastos
  const fetchGastos = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token no encontrado');
      }

      const response = await axios.get('http://localhost:3000/api/gastos', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Log para depuración
      console.log('Respuesta de la API:', response.data);

      if (response.data?.data?.gastos && Array.isArray(response.data.data.gastos)) {
        setGastos(response.data.data.gastos);
      } else {
        console.error('Estructura de datos inválida:', response.data);
        setGastos([]);
        setError('La respuesta de la API no tiene el formato esperado');
      }
    } catch (error: any) {
      console.error('Error detallado:', error);
      setGastos([]);
      
      // Manejo específico de errores
      if (error.response) {
        // La respuesta fue hecha y el servidor respondió con un código de estado
        // que cae fuera del rango 2xx
        console.error('Error de respuesta:', error.response.data);
        console.error('Estado:', error.response.status);
        setError(`Error del servidor: ${error.response.status}`);
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        console.error('Error de petición:', error.request);
        setError('No se pudo conectar con el servidor');
      } else {
        // Algo sucedió al configurar la petición que provocó un error
        console.error('Error de configuración:', error.message);
        setError('Error al procesar la petición');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGastos();
  }, []);

  // Filtrar los gastos según el término de búsqueda
  const filteredGastos = useMemo(() => {
    return gastos.filter((gasto) => {
      if (!gasto) return false;
      
      const searchTermLower = searchTerm.toLowerCase();
      const fechaStr = new Date(gasto.fecha).toLocaleDateString();
      const importeStr = gasto.importe.toString();
      const descripcionStr = (gasto.descripcion || '').toLowerCase();
      const categoriaStr = (gasto.categoria || '').toLowerCase();
      const tipoStr = (gasto.tipo || '').toLowerCase();
      const clienteStr = (gasto.client?.nombre || '').toLowerCase();

      return (
        fechaStr.includes(searchTermLower) ||
        importeStr.includes(searchTermLower) ||
        descripcionStr.includes(searchTermLower) ||
        categoriaStr.includes(searchTermLower) ||
        tipoStr.includes(searchTermLower) ||
        clienteStr.includes(searchTermLower)
      );
    });
  }, [gastos, searchTerm]);

  // Renderizar la tabla
  const renderTable = () => {
    if (loading) {
      return <div>Cargando...</div>;
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    return (
      <Table
        headers={['Fecha', 'Descripción', 'Importe', 'Categoría', 'Tipo', 'Asociado a', 'Acciones']}
        data={filteredGastos.map(gasto => ({
          'Fecha': new Date(gasto.fecha).toLocaleDateString(),
          'Descripción': gasto.descripcion || '-',
          'Importe': `${gasto.importe} ${gasto.moneda}`,
          'Categoría': gasto.categoria || 'Sin categoría',
          'Tipo': gasto.tipo || '-',
          'Asociado a': gasto.client?.nombre || 'No asociado',
          'Acciones': (
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(gasto)}
                className="p-1 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
              >
                <Edit2 className="w-4 h-4 text-blue-500" />
              </button>
              <button
                onClick={() => handleDelete(gasto._id)}
                className="p-1 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
              <button
                onClick={() => {
                  setSelectedGastoId(gasto._id);
                  setIsAsociacionPopupOpen(true);
                }}
                className="p-1 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
              >
                <Link className="w-4 h-4 text-green-500" />
              </button>
            </div>
          )
        }))}
        variant={theme === 'dark' ? 'dark' : 'white'}
      />
    );
  };

  // Función para eliminar un gasto
  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token no encontrado');
      }

      await axios.delete(`http://localhost:3000/api/gastos/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Actualizar la lista de gastos después de eliminar
      setGastos(prevGastos => prevGastos.filter(gasto => gasto._id !== id));
      toast.success('Gasto eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar el gasto:', error);
      toast.error('Error al eliminar el gasto');
    }
  };

  // Función para editar un gasto
  const handleEdit = async (gasto: Gasto) => {
    try {
      setSelectedGasto(gasto);
      setIsEditMode(true);
    } catch (error) {
      console.error('Error al preparar la edición:', error);
      toast.error('Error al preparar la edición');
    }
  };

  // Función para guardar la edición
  const handleSaveEdit = async (editedGasto: Gasto) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token no encontrado');
      }

      await axios.patch(`http://localhost:3000/api/gastos/${editedGasto._id}`, editedGasto, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Actualizar la lista de gastos
      setGastos(prevGastos =>
        prevGastos.map(g => g._id === editedGasto._id ? editedGasto : g)
      );

      setIsEditMode(false);
      setSelectedGasto(null);
      toast.success('Gasto actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el gasto:', error);
      toast.error('Error al actualizar el gasto');
    }
  };

  return (
    <div className={`p-4 h-full flex flex-col justify-between ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-red-50 text-gray-800'} rounded-lg relative`}>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo</label>
                    <select
                      name="tipo"
                      value=""
                      onChange={() => {}}
                      className={`w-full p-2 rounded-md ${
                        theme === 'dark' 
                          ? 'bg-gray-600 text-white' 
                          : 'bg-white text-gray-800'
                      }`}
                    >
                      <option value="">Todos</option>
                      <option value="fijo">Fijo</option>
                      <option value="variable">Variable</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Categoría</label>
                    <input
                      type="text"
                      name="categoria"
                      value=""
                      onChange={() => {}}
                      placeholder="Filtrar por categoría"
                      className={`w-full p-2 rounded-md ${
                        theme === 'dark' 
                          ? 'bg-gray-600 text-white' 
                          : 'bg-white text-gray-800'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha desde</label>
                    <input
                      type="date"
                      name="fechaDesde"
                      value=""
                      onChange={() => {}}
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
                      name="fechaHasta"
                      value=""
                      onChange={() => {}}
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
                      name="importeMin"
                      value=""
                      onChange={() => {}}
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
                      name="importeMax"
                      value=""
                      onChange={() => {}}
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
          <Button
            variant="filter"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        <Button variant="create" onClick={onAddClick}>
          <Plus className="w-4 h-4 mr-1" />
          Añadir
        </Button>
      </div>
      <div className="flex-grow overflow-auto custom-scrollbar">
        {renderTable()}
      </div>
      {isEditMode && selectedGasto && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-1/2">
            <h2 className="text-lg font-bold mb-2">Editar gasto</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit(selectedGasto);
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <input
                  type="text"
                  value={selectedGasto.descripcion}
                  onChange={(e) => setSelectedGasto({ ...selectedGasto, descripcion: e.target.value })}
                  className="w-full p-2 rounded-md border border-gray-300"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Importe</label>
                <input
                  type="number"
                  value={selectedGasto.importe}
                  onChange={(e) => setSelectedGasto({ ...selectedGasto, importe: Number(e.target.value) })}
                  className="w-full p-2 rounded-md border border-gray-300"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <input
                  type="text"
                  value={selectedGasto.categoria}
                  onChange={(e) => setSelectedGasto({ ...selectedGasto, categoria: e.target.value })}
                  className="w-full p-2 rounded-md border border-gray-300"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
                  value={selectedGasto.tipo}
                  onChange={(e) => setSelectedGasto({ ...selectedGasto, tipo: e.target.value })}
                  className="w-full p-2 rounded-md border border-gray-300"
                >
                  <option value="">Seleccione un tipo</option>
                  <option value="fijo">Fijo</option>
                  <option value="variable">Variable</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Guardar cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GastoWidget;
