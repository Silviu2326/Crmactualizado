import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash, X } from 'lucide-react';
import TablaClientes from './TablaClientes';
import type { PlanPago } from '../types/servicios';

interface Props {
  planes: PlanPago[]; // Esperando un array de PlanPago
  isDarkMode: boolean;
}

const TablaPlanesServicio = ({ planes, isDarkMode }: Props) => {
  const [clientesExpandidos, setClientesExpandidos] = useState<string | null>(null);
  const [planEditando, setPlanEditando] = useState<PlanPago | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<{
    nombre: string;
    precio: number;
    moneda: string;
    detalles: string;
  }>({
    nombre: '',
    precio: 0,
    moneda: '',
    detalles: '',
  });

  const handleEditClick = (plan: PlanPago) => {
    setPlanEditando(plan);
    setFormData({
      nombre: plan.nombre,
      precio: plan.precio,
      moneda: plan.moneda,
      detalles: plan.detalles || '',
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setPlanEditando(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' ? Number(value) : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica para actualizar el plan de pago
    console.log('Actualizando plan de pago:', planEditando?._id, formData);
    setIsModalOpen(false);
    setPlanEditando(null);
    // Actualizar el estado local o volver a obtener los datos
  };

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead>
          <tr className={`${isDarkMode ? 'bg-gray-700' : 'bg-[#BFCEFF]'} text-[#000000]`}>
            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-black'}`}>
              Nombre
            </th>
            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-black'}`}>
              Precio
            </th>
            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-black'}`}>
              Detalles
            </th>
            <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-black'}`}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
          {planes.map((plan, index) => (
            <React.Fragment key={plan._id}>
              <motion.tr
                key={plan._id} // Asegurar que cada tr tiene una key única
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-50'} transition-colors duration-200`}
              >
                <td className="px-6 py-4">
                  <div className={`text-sm font-medium text-[rgb(23 31 45)] dark:text-gray-900`}>
                    {plan.nombre}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className={`px-3 py-1 text-sm font-semibold rounded-full inline-block ${
                      isDarkMode ? 'text-green-400 bg-green-900/40' : 'text-green-600 bg-green-50'
                    }`}
                  >
                    {plan.precio} {plan.moneda}
                  </motion.span>
                </td>
                <td className={`text-sm font-medium text-[rgb(23 31 45)] text-[rgb(154 174 201)]`}>
                  {plan.detalles || plan.descripcion}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditClick(plan)}
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-150"
                    >
                      <Edit className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        // Implementar lógica para eliminar el plan de pago
                        console.log('Eliminar plan de pago:', plan._id);
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors duration-150"
                    >
                      <Trash className="w-5 h-5" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
              <AnimatePresence>
                {clientesExpandidos === plan._id && (
                  <motion.tr
                    key={`expanded-${plan._id}`} // Key única para el tr expandido
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
                        <TablaClientes
                          clientes={plan.clientes || []}
                          isDarkMode={isDarkMode}
                        />
                      </motion.div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Modal para editar plan de pago */}
      <AnimatePresence>
        {isModalOpen && planEditando && (
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
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold mb-4 text-[rgb(23 31 45)] dark:text-gray-100">
                Editar Plan de Pago
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Formulario de edición */}
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
                {/* Otros campos del formulario */}
                <div>
                  <label htmlFor="precio" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Precio
                  </label>
                  <input
                    type="number"
                    name="precio"
                    id="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="moneda" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Moneda
                  </label>
                  <input
                    type="text"
                    name="moneda"
                    id="moneda"
                    value={formData.moneda}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="detalles" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Detalles
                  </label>
                  <textarea
                    name="detalles"
                    id="detalles"
                    value={formData.detalles}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
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

export default TablaPlanesServicio;
