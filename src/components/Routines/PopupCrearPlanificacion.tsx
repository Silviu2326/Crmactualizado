import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface PopupCrearPlanificacionProps {
  onClose: () => void;
  onPlanningCreated?: () => void;
}

const PopupCrearPlanificacion: React.FC<PopupCrearPlanificacionProps> = ({
  onClose,
  onPlanningCreated,
}) => {
  const { theme } = useTheme();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [meta, setMeta] = useState('');
  const [semanas, setSemanas] = useState(1);
  const [clienteId, setClienteId] = useState('');

  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch('http://localhost:3000/api/clientes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.mensaje || 'Error al obtener los clientes');
        }

        const data = await response.json();
        setClientes(data);
      } catch (err: any) {
        console.error('Error al obtener los clientes:', err);
        setError(err.message);
      }
    };

    fetchClientes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('http://localhost:3000/api/plannings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          fechaInicio,
          meta,
          semanas,
          clienteId: clienteId || null, // Enviar null si no se selecciona un cliente
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la planificación');
      }

      const data = await response.json();

      if (onPlanningCreated) {
        onPlanningCreated();
      }

      onClose();
    } catch (err: any) {
      console.error('Error al crear la planificación:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      } p-6 rounded-lg shadow-lg relative`}
    >
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </button>
      <h3 className="text-2xl font-bold mb-4">Crear Planificación</h3>

      {error && (
        <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nombre" className="block mb-1 font-medium">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="descripcion" className="block mb-1 font-medium">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="fechaInicio" className="block mb-1 font-medium">
            Fecha de Inicio
          </label>
          <input
            type="date"
            id="fechaInicio"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="meta" className="block mb-1 font-medium">
            Meta
          </label>
          <input
            type="text"
            id="meta"
            value={meta}
            onChange={(e) => setMeta(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="semanas" className="block mb-1 font-medium">
            Semanas
          </label>
          <input
            type="number"
            id="semanas"
            value={semanas}
            onChange={(e) => setSemanas(parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded"
            min="1"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="clienteId" className="block mb-1 font-medium">
            Cliente (opcional)
          </label>
          <select
            id="clienteId"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Sin cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.nombre} ({cliente.email})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <Button
            variant="normal"
            onClick={onClose}
            className="mr-2"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button variant="create" type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Crear'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PopupCrearPlanificacion;
