// src/components/popups/NuevoPaymentPlanPopup.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface NuevoPaymentPlanPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (paymentPlan: PaymentPlanInput) => void;
  isDarkMode: boolean;
  servicioId: string; // ID del servicio al que se le agregará el payment plan
}

interface PaymentPlanInput {
  nombre: string;
  precio: number;
  moneda: string;
  frecuencia: string;
  duracion: number;
  detalles: string;
  servicio: string;
}

const NuevoPaymentPlanPopup: React.FC<NuevoPaymentPlanPopupProps> = ({
  isOpen,
  onClose,
  onAdd,
  isDarkMode,
  servicioId,
}) => {
  const [formData, setFormData] = useState<PaymentPlanInput>({
    nombre: '',
    precio: 0,
    moneda: 'EUR',
    frecuencia: 'Mensual',
    duracion: 12,
    detalles: '',
    servicio: servicioId,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      servicio: servicioId,
    }));
  }, [servicioId]);

  const getFrecuenciaMeses = (frecuencia: string): number => {
    switch (frecuencia) {
      case 'Mensual':
        return 1;
      case 'Trimestral':
        return 3;
      case 'Semestral':
        return 6;
      case 'Anual':
        return 12;
      default:
        return 1;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: name === 'precio' || name === 'duracion' ? Number(value) : value,
      };

      // Si cambia la frecuencia o la duración, actualizar la duración en meses
      if (name === 'frecuencia' || name === 'duracion') {
        const mesesPorFrecuencia = getFrecuenciaMeses(newData.frecuencia);
        newData.duracion = Number(name === 'duracion' ? value : prev.duracion) * mesesPorFrecuencia;
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      servicio: servicioId,
    };

    // Mostrar los datos que se van a enviar
    console.log('Datos del plan de pago a enviar:', {
      ...dataToSend,
      duracionPeriodos: formData.duracion / getFrecuenciaMeses(formData.frecuencia),
      duracionMeses: formData.duracion,
    });

    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);

      const response = await fetch('http://localhost:3000/api/planes-de-pago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      console.log('Respuesta del servidor:', {
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        throw new Error('Error al crear el Payment Plan');
      }

      const data = await response.json();
      console.log('Datos recibidos del servidor:', data);

      onAdd(data);
      onClose();
    } catch (error) {
      console.error('Error al crear el Payment Plan:', error);
      // Aquí puedes manejar el error mostrando un mensaje al usuario
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

            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Nuevo Payment Plan
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="nombre"
                  className={`block text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}
                >
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
                <label
                  htmlFor="precio"
                  className={`block text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}
                >
                  Precio
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

              <div>
                <label
                  htmlFor="moneda"
                  className={`block text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}
                >
                  Moneda
                </label>
                <select
                  name="moneda"
                  id="moneda"
                  value={formData.moneda}
                  onChange={handleChange}
                  required
                  className={`mt-1 block w-full px-3 py-2 ${
                    isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                  } border border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="frecuencia"
                  className={`block text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}
                >
                  Frecuencia
                </label>
                <select
                  name="frecuencia"
                  id="frecuencia"
                  value={formData.frecuencia}
                  onChange={handleChange}
                  required
                  className={`mt-1 block w-full px-3 py-2 ${
                    isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                  } border border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="Mensual">Mensual</option>
                  <option value="Trimestral">Trimestral</option>
                  <option value="Semestral">Semestral</option>
                  <option value="Anual">Anual</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="duracion"
                  className={`block text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}
                >
                  Duración (en periodos de {formData.frecuencia.toLowerCase()})
                </label>
                <input
                  type="number"
                  name="duracion"
                  id="duracion"
                  value={formData.duracion / getFrecuenciaMeses(formData.frecuencia)}
                  onChange={handleChange}
                  required
                  min="1"
                  className={`mt-1 block w-full px-3 py-2 ${
                    isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                  } border border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Total en meses: {formData.duracion}
                </span>
              </div>

              <div>
                <label
                  htmlFor="detalles"
                  className={`block text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}
                >
                  Detalles
                </label>
                <textarea
                  name="detalles"
                  id="detalles"
                  value={formData.detalles}
                  onChange={handleChange}
                  required
                  rows={3}
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

export default NuevoPaymentPlanPopup;
