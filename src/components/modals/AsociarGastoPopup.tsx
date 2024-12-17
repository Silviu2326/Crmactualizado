import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import axios from 'axios';

interface Cliente {
  _id: string;
  nombre: string;
}

interface Servicio {
  _id: string;
  nombre: string;
}

interface AsociarGastoPopupProps {
  onClose: () => void;
  gastoId: string;
}

const AsociarGastoPopup: React.FC<AsociarGastoPopupProps> = ({ onClose, gastoId }) => {
  const [tipoAsociacion, setTipoAsociacion] = useState<'cliente' | 'servicio' | ''>('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tipoAsociacion) {
      fetchData();
    }
  }, [tipoAsociacion]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (tipoAsociacion === 'cliente') {
        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/clientes', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Error al cargar los clientes');
        const data = await response.json();
        setClientes(data);
      } else if (tipoAsociacion === 'servicio') {
        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/servicios', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Error al cargar los servicios');
        const data = await response.json();
        setServicios(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const body: { clientId?: string; serviceId?: string } = {};
      
      if (selectedClientId) {
        body.clientId = selectedClientId;
      }
      
      if (selectedServiceId) {
        body.serviceId = selectedServiceId;
      }

      const response = await axios.patch(
        `https://fitoffice2-f70b52bef77e.herokuapp.com/api/gastos/${gastoId}/asociar`,
        body,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        onClose();
      } else {
        setError('Error al asociar el gasto');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al asociar el gasto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Asociar Gasto</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Asociación
            </label>
            <select
              value={tipoAsociacion}
              onChange={(e) => setTipoAsociacion(e.target.value as 'cliente' | 'servicio' | '')}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccione un tipo</option>
              <option value="cliente">Cliente</option>
              <option value="servicio">Servicio</option>
            </select>
          </div>

          {tipoAsociacion && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tipoAsociacion === 'cliente' ? 'Cliente' : 'Servicio'}
              </label>
              {isLoading ? (
                <p>Cargando...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <select
                  value={tipoAsociacion === 'cliente' ? selectedClientId : selectedServiceId}
                  onChange={(e) => tipoAsociacion === 'cliente' ? setSelectedClientId(e.target.value) : setSelectedServiceId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccione una opción</option>
                  {tipoAsociacion === 'cliente'
                    ? clientes.map((cliente) => (
                        <option key={cliente._id} value={cliente._id}>
                          {cliente.nombre}
                        </option>
                      ))
                    : servicios.map((servicio) => (
                        <option key={servicio._id} value={servicio._id}>
                          {servicio.nombre}
                        </option>
                      ))}
                </select>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading || !tipoAsociacion || (!selectedClientId && !selectedServiceId)}
            >
              {isLoading ? 'Asociando...' : 'Asociar'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AsociarGastoPopup;
