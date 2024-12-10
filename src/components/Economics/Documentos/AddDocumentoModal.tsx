import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface AddDocumentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentoAdded: () => void;
}

const AddDocumentoModal: React.FC<AddDocumentoModalProps> = ({ isOpen, onClose, onDocumentoAdded }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    fechaFinalizacion: '',
    notas: ''
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Convertir la fecha al formato ISO y ajustar a medianoche UTC
      let dataToSend = { ...formData };
      if (formData.fechaFinalizacion) {
        const fechaFinalizacion = new Date(formData.fechaFinalizacion);
        fechaFinalizacion.setUTCHours(0, 0, 0, 0);
        dataToSend.fechaFinalizacion = fechaFinalizacion.toISOString();
      }

      const response = await axios.post(
        'http://localhost:3000/api/otros-documentos',
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        onDocumentoAdded();
        onClose();
      } else {
        setError('Error al crear el documento');
      }
    } catch (error: any) {
      console.error('Error al crear documento:', error);
      setError(error.response?.data?.message || 'Error al crear el documento');
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

  const tiposDocumento = [
    'Legal',
    'RRHH',
    'Financiero',
    'Técnico',
    'Administrativo',
    'Otro'
  ];

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
          theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
        }`}>
          Añadir Nuevo Documento
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
            <label className="block mb-1">Tipo *</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
              required
            >
              <option value="">Seleccionar tipo</option>
              {tiposDocumento.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Fecha de Finalización</label>
            <input
              type="date"
              name="fechaFinalizacion"
              value={formData.fechaFinalizacion}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
            />
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
                ? 'bg-orange-600 hover:bg-orange-700 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            Crear Documento
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDocumentoModal;
