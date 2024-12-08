// NuevaAsesoriaPopup.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface NuevaAsesoriaPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newService: any) => void;
  isDarkMode: boolean;
}

interface FormData {
  nombre: string;
  descripcion: string;
  tipo: string;
  serviciosAdicionales: ('Pack de Citas' | 'Planificacion' | 'Dietas')[];
}

const NuevaAsesoriaPopup: React.FC<NuevaAsesoriaPopupProps> = ({ isOpen, onClose, onAdd, isDarkMode }) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    descripcion: '',
    tipo: 'Asesoría Individual',
    serviciosAdicionales: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServicioAdicionalChange = (servicio: 'Pack de Citas' | 'Planificacion' | 'Dietas') => {
    setFormData(prev => {
      const servicios = prev.serviciosAdicionales.includes(servicio)
        ? prev.serviciosAdicionales.filter(s => s !== servicio)
        : [...prev.serviciosAdicionales, servicio];
      return { ...prev, serviciosAdicionales: servicios };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/servicios/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          fechaCreacion: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al crear la asesoría');
      }

      const newService = await response.json();
      console.log('Asesoría creada exitosamente:', newService);
      
      onAdd(newService);
      onClose();
    } catch (error) {
      console.error('Error al crear la asesoría:', error);
      setError(error instanceof Error ? error.message : 'Error al crear la asesoría');
    } finally {
      setIsLoading(false);
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
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-200 hover:text-gray-700 dark:hover:text-white transition-colors duration-150"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Nueva Asesoría Individual</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

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
                  rows={3}
                  className={`mt-1 block w-full px-3 py-2 ${
                    isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                  } border border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Servicios Adicionales
                </label>
                <div className="mt-2 space-y-2">
                  {(['Pack de Citas', 'Planificacion', 'Dietas'] as const).map((servicio) => (
                    <label key={servicio} className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={formData.serviciosAdicionales.includes(servicio)}
                        onChange={() => handleServicioAdicionalChange(servicio)}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">{servicio}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Creando...' : 'Crear Asesoría'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NuevaAsesoriaPopup;
