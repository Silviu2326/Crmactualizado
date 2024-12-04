// src/components/ClassList/CrearClasePopup.tsx

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../Common/Button';

interface CrearClasePopupProps {
  onClose: () => void;
  onCreate: () => void;
}

const CrearClasePopup: React.FC<CrearClasePopupProps> = ({ onClose, onCreate }) => {
  const { theme } = useTheme();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [serviciosAdicionales, setServiciosAdicionales] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener el token del localStorage
  const token = localStorage.getItem('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        nombre,
        descripcion,
        tipo: 'Clase Grupal', // Tipo se establece automáticamente
        serviciosAdicionales,
      };

      const response = await axios.post(
        'https://fitoffice2-f70b52bef77e.herokuapp.com//api/servicios/services',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Servicio creado:', response.data);
      setLoading(false);
      onCreate(); // Notificar a ClassList para actualizar la lista
      onClose(); // Cerrar el popup
    } catch (err: any) {
      console.error('❌ Error al crear el servicio:', err);
      setError(err.response?.data?.mensaje || 'Error al crear la clase.');
      setLoading(false);
    }
  };

  const handleServiciosAdicionalesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setServiciosAdicionales([...serviciosAdicionales, value]);
    } else {
      setServiciosAdicionales(serviciosAdicionales.filter(item => item !== value));
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
        className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-2xl`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Crear Nueva Clase Grupal</h3>
          <Button variant="normal" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Nombre de la Clase</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              rows={4}
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Servicios Adicionales</label>
            {/* Aquí puedes reemplazar con un componente multi-select si lo prefieres */}
            <div className="flex flex-wrap">
              <label className="mr-4">
                <input
                  type="checkbox"
                  value="Servicio 1"
                  onChange={handleServiciosAdicionalesChange}
                  className="mr-2"
                />
                Servicio 1
              </label>
              <label className="mr-4">
                <input
                  type="checkbox"
                  value="Servicio 2"
                  onChange={handleServiciosAdicionalesChange}
                  className="mr-2"
                />
                Servicio 2
              </label>
              <label className="mr-4">
                <input
                  type="checkbox"
                  value="Servicio 3"
                  onChange={handleServiciosAdicionalesChange}
                  className="mr-2"
                />
                Servicio 3
              </label>
              {/* Agrega más opciones según tus necesidades */}
            </div>
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="flex justify-end space-x-2">
            <Button variant="normal" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button variant="create" type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Clase'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CrearClasePopup;
