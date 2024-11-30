// TablaCitas.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash, ChevronRight, X } from 'lucide-react';
import TablaPlanesServicio from './TablaPlanesServicio';
import type { Cita } from '../types/servicios';

interface Props {
  datos: Cita[];
  isDarkMode: boolean;
}

const TablaCitas = ({ datos, isDarkMode }: Props) => {
  const [expandedCitaId, setExpandedCitaId] = useState<string | null>(null);
  const [citaEditando, setCitaEditando] = useState<Cita | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<{
    nombre: string;
    descripcion: string;
    planPago: string;
  }>({
    nombre: '',
    descripcion: '',
    planPago: '',
  });

  const handleEditClick = (cita: Cita) => {
    console.log('Editando cita:', cita.id);
    setCitaEditando(cita);
    setFormData({
      nombre: cita.nombre,
      descripcion: cita.descripcion,
      planPago: cita.planPago,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (citaId: string) => {
    console.log('Eliminar cita grupal:', citaId);
    // Implementa la lógica para eliminar la cita aquí, por ejemplo, una llamada a una API
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCitaEditando(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Actualizando cita grupal:', citaEditando?.id, formData);
    // Implementa la lógica para actualizar la cita grupal aquí, por ejemplo, una llamada a una API

    // Después de la actualización exitosa, cierra el modal y actualiza el estado si es necesario
    setIsModalOpen(false);
    setCitaEditando(null);
    // Implementa la actualización del estado local o vuelve a obtener los datos
  };

  const toggleExpandedRow = (citaId: string) => {
    setExpandedCitaId(expandedCitaId === citaId ? null : citaId);
    console.log(`Fila expandida: ${citaId}`);
  };

  return (
    <div className="overflow-x-auto p-6">
      {/* Contenedor de la tabla con bordes redondeados y sombra */}
      <div className="rounded-lg overflow-hidden shadow">
        <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <thead>
            <tr className={isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-[rgb(191,206,255)]'}>
              <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                Servicio
              </th>
              <th className={`px-6 py-4 text-center text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                Plan de Pago
              </th>
              <th className={`px-6 py-4 text-center text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                Planes de Pago
              </th>
              <th className={`px-6 py-4 text-center text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {datos.map((cita, index) => {
              // Asegurarse de que planDePago sea un arreglo
              const planes = Array.isArray(cita.planDePago) ? cita.planDePago : cita.planDePago ? [cita.planDePago] : [];
              console.log(`Cita ID: ${cita.id}, Planes de Pago:`, planes);

              return (
                <React.Fragment key={cita.id}>
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} transition-colors duration-200`}
                  >
                    {/* Servicio con botón para expandir */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <motion.button
                        onClick={() => toggleExpandedRow(cita.id)}
                        className="flex items-center space-x-2 text-sm font-medium text-gray-200 dark:text-gray-900 group"
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.span
                          animate={{
                            rotate: expandedCitaId === cita.id ? 90 : 0,
                          }}
                          className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </motion.span>
                        <span className={`px-6 py-4 text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>
                          {cita.nombre}
                        </span>
                      </motion.button>
                    </td>

                    {/* Plan de Pago */}
                    <td className="px-6 py-4 text-center">
                      <div className={`font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {cita.planPago}
                      </div>
                    </td>

                    {/* Planes de Pago */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 text-sm rounded-full ${
                          planes.length > 0
                            ? isDarkMode
                              ? 'text-green-400 bg-green-900/40'
                              : 'text-green-600 bg-green-50'
                            : isDarkMode
                            ? 'text-gray-400 bg-gray-700/40'
                            : 'text-gray-600 bg-gray-200'
                        }`}
                      >
                        {planes.length}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditClick(cita)}
                          className={`${
                            isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                          } transition-colors duration-150`}
                          aria-label="Editar Cita"
                        >
                          <Edit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteClick(cita.id)}
                          className={`${
                            isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
                          } transition-colors duration-150`}
                          aria-label="Eliminar Cita"
                        >
                          <Trash className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>

                  {/* Fila expandible para mostrar los planes de pago */}
                  <AnimatePresence>
                    {expandedCitaId === cita.id && (
                      <motion.tr
                        key={`expanded-${cita.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td colSpan={4} className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} border-t border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <motion.div
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            className="p-4"
                          >
                            <TablaPlanesServicio
                              planes={planes}
                              isDarkMode={isDarkMode}
                            />
                          </motion.div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal para editar cita grupal */}
      <AnimatePresence>
        {isModalOpen && citaEditando && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`bg-white dark:bg-gray-700 rounded-lg shadow-lg w-full max-w-md p-6 relative`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={handleModalClose}
                className="absolute top-3 right-3 text-gray-500 dark:text-gray-200 hover:text-gray-700 dark:hover:text-white transition-colors duration-150"
                aria-label="Cerrar Modal"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Editar Cita</h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nombre" className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="planPago" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Plan de Pago
                  </label>
                  <input
                    type="text"
                    name="planPago"
                    id="planPago"
                    value={formData.planPago}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-150"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-150"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TablaCitas;
