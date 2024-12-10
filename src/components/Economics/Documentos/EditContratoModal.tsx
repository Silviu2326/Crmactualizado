import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import Button from '../../Common/Button';

interface EditContratoModalProps {
  isOpen: boolean;
  onClose: () => void;
  contrato: any | null;
  onContratoUpdated: () => void;
}

const EditContratoModal: React.FC<EditContratoModalProps> = ({
  isOpen,
  onClose,
  contrato,
  onContratoUpdated,
}) => {
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estado, setEstado] = useState('');
  const [error, setError] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    if (contrato) {
      setNombre(contrato.nombre || '');
      setFechaInicio(contrato.fechaInicio ? new Date(contrato.fechaInicio).toISOString().split('T')[0] : '');
      setFechaFin(contrato.fechaFin ? new Date(contrato.fechaFin).toISOString().split('T')[0] : '');
      setEstado(contrato.estado || '');
    }
  }, [contrato]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3000/api/contratos/${contrato?._id}`,
        {
          nombre,
          fechaInicio,
          fechaFin,
          estado,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      onContratoUpdated();
      onClose();
    } catch (err) {
      console.error('Error al actualizar el contrato:', err);
      setError('Error al actualizar el contrato');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      } rounded-lg p-6 w-full max-w-md relative`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Editar Contrato</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Fecha de Inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Fecha de Fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              required
            >
              <option value="">Seleccionar estado</option>
              <option value="activo">Activo</option>
              <option value="expirado">Expirado</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              type="button"
              onClick={onClose}
              variant={theme === 'dark' ? 'dark' : 'white'}
              className="px-4 py-2"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="px-4 py-2"
            >
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContratoModal;
