import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

// Define an enum for contract states
enum ContratoEstado {
  Activo = 'Activo',
  Finalizado = 'Finalizado',
  Cancelado = 'Cancelado',
  Pendiente = 'Pendiente'
}

interface AddContratoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContratoAdded: () => void;
}

const AddContratoModal: React.FC<AddContratoModalProps> = ({ isOpen, onClose, onContratoAdded }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    nombre: '',
    fechaInicio: '',
    fechaFin: '',
    estado: ContratoEstado.Pendiente,
    cliente: '',
    notas: ''
  });
  const [error, setError] = useState<string>('');
  const [clientes, setClientes] = useState<Array<{ _id: string; nombre: string }>>([]);

  // Cargar lista de clientes al abrir el modal
  React.useEffect(() => {
    if (isOpen) {
      const fetchClientes = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            'http://localhost:3000/api/clientes',
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          const clientesData = response.data?.data || response.data?.clientes || response.data;
          if (Array.isArray(clientesData)) {
            setClientes(clientesData);
          } else {
            console.error('Formato de respuesta inesperado:', response.data);
            setError('Error en el formato de datos de clientes');
            setClientes([]); // Establecer un array vacío como fallback
          }
        } catch (error) {
          console.error('Error al cargar clientes:', error);
          setError('Error al cargar la lista de clientes');
          setClientes([]); // Establecer un array vacío en caso de error
        }
      };
      fetchClientes();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Convertir las fechas al formato ISO
      const fechaInicio = new Date(formData.fechaInicio);
      const fechaFin = new Date(formData.fechaFin);
      
      // Validar que la fecha de fin sea posterior a la fecha de inicio
      if (fechaFin <= fechaInicio) {
        setError('La fecha de finalización debe ser posterior a la fecha de inicio');
        return;
      }

      const dataToSend = {
        ...formData,
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString()
      };

      const response = await axios.post(
        'http://localhost:3000/api/contracts',
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.status === 'success') {
        onContratoAdded();
        onClose();
      } else {
        setError('Error al crear el contrato');
      }
    } catch (error: any) {
      console.error('Error al crear contrato:', error);
      setError(error.response?.data?.message || 'Error al crear el contrato');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Validación especial para fechas
    if (name === 'fechaInicio' || name === 'fechaFin') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        return; // No permite fechas anteriores a hoy
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-full hover:bg-opacity-80 ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className={`text-xl font-semibold mb-4 ${
          theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
        }`}>
          Crear Nuevo Contrato
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nombre del Contrato *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Cliente</label>
            <select
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="">Sin cliente asignado</option>
              {Array.isArray(clientes) && clientes.map(cliente => (
                <option key={cliente._id} value={cliente._id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Fecha de Inicio *</label>
            <input
              type="date"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Fecha de Finalización *</label>
            <input
              type="date"
              name="fechaFin"
              value={formData.fechaFin}
              onChange={handleChange}
              min={formData.fechaInicio || new Date().toISOString().split('T')[0]}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Estado del Contrato</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
            >
              {Object.values(ContratoEstado).map(estado => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Notas</label>
            <textarea
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
              rows={3}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded font-semibold ${
              theme === 'dark'
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            Crear Contrato
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddContratoModal;
