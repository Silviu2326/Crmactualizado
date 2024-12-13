import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

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
  onSubmit: (tipo: string, id: string) => void;
  gastoId: string;
}

const AsociarGastoPopup: React.FC<AsociarGastoPopupProps> = ({ onClose, onSubmit, gastoId }) => {
  const [tipoAsociacion, setTipoAsociacion] = useState<'cliente' | 'servicio' | ''>('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tipoAsociacion) {
      fetchData();
    }
  }, [tipoAsociacion]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const url = tipoAsociacion === 'cliente' 
        ? 'https://fitoffice2-f70b52bef77e.herokuapp.com/api/clientes'
        : 'https://fitoffice2-f70b52bef77e.herokuapp.com/api/servicios/services';

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }

      const data = await response.json();
      if (tipoAsociacion === 'cliente') {
        setClientes(data);
      } else {
        setServicios(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedId && tipoAsociacion) {
      onSubmit(tipoAsociacion, selectedId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Asociar Gasto</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Asociación
            </label>
            <select
              value={tipoAsociacion}
              onChange={(e) => setTipoAsociacion(e.target.value as 'cliente' | 'servicio')}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccione un tipo</option>
              <option value="cliente">Cliente</option>
              <option value="servicio">Servicio</option>
            </select>
          </div>

          {tipoAsociacion && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tipoAsociacion === 'cliente' ? 'Cliente' : 'Servicio'}
              </label>
              {loading ? (
                <p>Cargando...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccione una opción</option>
                  {tipoAsociacion === 'cliente'
                    ? clientes.map(cliente => (
                        <option key={cliente._id} value={cliente._id}>
                          {cliente.nombre}
                        </option>
                      ))
                    : servicios.map(servicio => (
                        <option key={servicio._id} value={servicio._id}>
                          {servicio.nombre}
                        </option>
                      ))
                  }
                </select>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-4">
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
              disabled={!selectedId || !tipoAsociacion}
            >
              Asociar
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AsociarGastoPopup;
