// NuevoClaseGrupalPopup.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface NuevoClaseGrupalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  isDarkMode: boolean;
}

const NuevoClaseGrupalPopup: React.FC<NuevoClaseGrupalPopupProps> = ({ isOpen, onClose, onAdd, isDarkMode }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    horario: '',
    capacidad: '',
    precio: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí debes implementar la lógica para enviar los datos al backend
    // Por ahora, haremos un console.log y simularemos una respuesta exitosa
    console.log('Creando nueva Clase Grupal:', formData);

    // Simular una llamada a la API
    try {
      // Ejemplo de llamada a la API
      /*
      const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/clases-grupales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Si es necesario
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al crear la clase grupal');
      }

      const data = await response.json();
      */

      // Simulación exitosa
      setTimeout(() => {
        onAdd(); // Actualizar la lista de servicios
        onClose(); // Cerrar el popup
      }, 1000);
    } catch (error) {
      console.error(error);
      // Manejar el error (mostrar un mensaje al usuario, etc.)
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`bg-white dark:bg-gray-700 rounded-lg shadow-lg w-full max-w-lg p-6 relative`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-200 hover:text-gray-700 dark:hover:text-white transition-colors duration-150"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Nueva Clase Grupal</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nombre" className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className={`mt-1 block w-full px-3 py-2 ${
                    isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                  } border border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>

              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  rows={3}
                  className={`mt-1 block w-full px-3 py-2 ${
                    isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                  } border border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                ></textarea>
              </div>

              <div>
                <label htmlFor="horario" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Horario
                </label>
                <input
                  type="text"
                  name="horario"
                  id="horario"
                  value={formData.horario}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Lunes 10:00 - 12:00"
                  className={`mt-1 block w-full px-3 py-2 ${
                    isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                  } border border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>

              <div>
                <label htmlFor="capacidad" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Capacidad
                </label>
                <input
                  type="number"
                  name="capacidad"
                  id="capacidad"
                  value={formData.capacidad}
                  onChange={handleChange}
                  required
                  min="1"
                  className={`mt-1 block w-full px-3 py-2 ${
                    isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                  } border border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>

              <div>
                <label htmlFor="precio" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Precio (€)
                </label>
                <input
                  type="number"
                  name="precio"
                  id="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className={`mt-1 block w-full px-3 py-2 ${
                    isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                  } border border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-150"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-150"
                >
                  Crear
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NuevoClaseGrupalPopup;
