import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface AddLicenciaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLicenciaAdded: () => void;
}

const AddLicenciaModal: React.FC<AddLicenciaModalProps> = ({ isOpen, onClose, onLicenciaAdded }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    nombre: '',
    fechaExpiracion: '',
    estado: 'Activa',
    descripcion: '',
    campo: ''
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Convertir la fecha al formato ISO y ajustar a medianoche UTC
      const fechaExpiracion = new Date(formData.fechaExpiracion);
      fechaExpiracion.setUTCHours(0, 0, 0, 0);

      const dataToSend = {
        ...formData,
        fechaExpiracion: fechaExpiracion.toISOString()
      };

      const response = await axios.post(
        'https://fitoffice2-f70b52bef77e.herokuapp.com/api/licenses',
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.status === 'success') {
        onLicenciaAdded();
        onClose();
      } else {
        setError('Error al crear la licencia');
      }
    } catch (error: any) {
      console.error('Error al crear licencia:', error);
      setError(error.response?.data?.message || 'Error al crear la licencia');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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
          Añadir Nueva Licencia
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nombre *</label>
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
            <label className="block mb-1">Fecha de Expiración *</label>
            <input
              type="date"
              name="fechaExpiracion"
              value={formData.fechaExpiracion}
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
            <label className="block mb-1">Estado</label>
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
              <option value="Activa">Activa</option>
              <option value="Expirada">Expirada</option>
              <option value="Suspendida">Suspendida</option>
              <option value="En Proceso">En Proceso</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Campo *</label>
            <input
              type="text"
              name="campo"
              value={formData.campo}
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
            <label className="block mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
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
            Crear Licencia
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLicenciaModal;
