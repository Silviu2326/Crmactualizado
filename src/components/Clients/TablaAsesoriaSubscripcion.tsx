// TablaAsesoriaSubscripcion.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash, ChevronRight, X, Plus } from 'lucide-react'; // Importar Plus para el botón de Payment Plan
import TablaPlanesServicio from './TablaPlanesServicio';
import NuevoPaymentPlanPopup from './NuevoPaymentPlanPopup'; // Importar el nuevo popup
import type { ServicioAsesoriaSubscripcion } from '../types/servicios';

interface TablaAsesoriaSubscripcionProps {
  datos: any[];
  isDarkMode: boolean;
  onServiceUpdated: (servicio: any) => void;
  onAddPaymentPlan: (servicioId: string, nuevoPlan: any) => void;
}

const TablaAsesoriaSubscripcion: React.FC<TablaAsesoriaSubscripcionProps> = ({
  datos = [],
  isDarkMode,
  onServiceUpdated,
  onAddPaymentPlan
}) => {
  console.log('TablaAsesoriaSubscripcion - Datos recibidos:', datos);
  console.log('TablaAsesoriaSubscripcion - Cantidad de servicios:', datos.length);

  const [servicioExpandido, setServicioExpandido] = useState<string | null>(null);
  const [servicioEditando, setServicioEditando] = useState<ServicioAsesoriaSubscripcion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    console.log('TablaAsesoriaSubscripcion - Datos actualizados:', datos);
    // Mostrar la estructura de los planes para cada servicio
    datos.forEach(servicio => {
      console.log('Servicio:', servicio._id);
      console.log('planDePago:', servicio.planDePago);
      console.log('planesDePago:', servicio.planesDePago);
    });
  }, [datos]);

  const [formData, setFormData] = useState<{
    nombre: string;
    descripcion: string;
    serviciosAdicionales: string;
  }>({
    nombre: '',
    descripcion: '',
    serviciosAdicionales: '',
  });

  // Estados para el Popup de Payment Plan
  const [isNuevoPaymentPlanOpen, setIsNuevoPaymentPlanOpen] = useState<boolean>(false);
  const [servicioParaPaymentPlan, setServicioParaPaymentPlan] = useState<string | null>(null); // ID del servicio seleccionado

  const handleEditClick = (servicio: ServicioAsesoriaSubscripcion) => {
    console.log('Editando servicio:', servicio);
    setServicioEditando(servicio);
    setFormData({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      serviciosAdicionales: servicio.serviciosAdicionales.join(', '),
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setServicioEditando(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí debes implementar la lógica para actualizar el servicio, posiblemente una llamada a una API
    console.log('Actualizando servicio:', servicioEditando?._id, formData);
    onServiceUpdated({ ...servicioEditando, ...formData });
    setIsModalOpen(false);
    setServicioEditando(null);
  };

  // Función para abrir el Popup de Payment Plan
  const handleAddPaymentPlanClick = (servicioId: string) => {
    setServicioParaPaymentPlan(servicioId);
    setIsNuevoPaymentPlanOpen(true);
  };

  // Función para manejar la adición de un nuevo Payment Plan
  const handleAddPaymentPlan = (nuevoPlan: any) => {
    if (servicioParaPaymentPlan) {
      onAddPaymentPlan(servicioParaPaymentPlan, nuevoPlan);
      setIsNuevoPaymentPlanOpen(false);
      setServicioParaPaymentPlan(null);
    }
  };

  return (
    <div className="w-full">
      <table className={`min-w-full ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <thead>
          <tr>
            <th className="py-2">Nombre del Cliente</th>
            <th className="py-2">Fecha de Creación</th>
            <th className="py-2">Tipo de Servicio</th>
            <th className="py-2">Servicios Adicionales</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos && datos.length > 0 ? (
            datos.map((servicio) => (
              <React.Fragment key={servicio._id}>
                <motion.tr
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} transition-colors duration-200`}
                >
                  <td className="px-6 py-4">
                    <motion.button
                      onClick={() =>
                        setServicioExpandido(servicioExpandido === servicio._id ? null : servicio._id)
                      }
                      className="flex items-center space-x-2 text-sm font-medium text-gray-200 dark:text-gray-900 group"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.span
                        animate={{
                          rotate: servicioExpandido === servicio._id ? 90 : 0,
                        }}
                        className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.span>
                      <span className={`px-6 py-4 text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {servicio.nombre}
                      </span>
                    </motion.button>
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {servicio.descripcion}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {servicio.serviciosAdicionales.join(', ')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3 items-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditClick(servicio)}
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-150"
                        aria-label={`Editar ${servicio.nombre}`}
                      >
                        <Edit className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          // Implementar lógica para eliminar el servicio
                          console.log('Eliminar servicio:', servicio._id);
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors duration-150"
                        aria-label={`Eliminar ${servicio.nombre}`}
                      >
                        <Trash className="w-5 h-5" />
                      </motion.button>
                      {/* Botón para agregar Payment Plan */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddPaymentPlanClick(servicio._id)}
                        className="text-green-400 hover:text-green-300 transition-colors duration-150"
                        aria-label={`Agregar Payment Plan a ${servicio.nombre}`}
                      >
                        <Plus className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
                <AnimatePresence>
                  {servicioExpandido === servicio._id && (
                    <motion.tr
                      key={`expanded-${servicio._id}`}
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
                          {console.log('Servicio expandido:', servicio)}
                          {console.log('planDePago:', servicio.planDePago)}
                          {console.log('planesDePago:', servicio.planesDePago)}
                          <TablaPlanesServicio
                            planes={Array.isArray(servicio.planesDePago) ? servicio.planesDePago : 
                                   servicio.planDePago ? [servicio.planDePago] : []}
                            isDarkMode={isDarkMode}
                            servicioId={servicio._id}
                          />
                        </motion.div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No hay servicios disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal para editar servicio */}
      <AnimatePresence>
        {isModalOpen && servicioEditando && (
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
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Editar Servicio</h2>
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
                  <label htmlFor="serviciosAdicionales" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Servicios Adicionales (separados por comas)
                  </label>
                  <input
                    type="text"
                    name="serviciosAdicionales"
                    id="serviciosAdicionales"
                    value={formData.serviciosAdicionales}
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

      {/* Modal para crear Payment Plan */}
      <NuevoPaymentPlanPopup
        isOpen={isNuevoPaymentPlanOpen}
        onClose={() => {
          setIsNuevoPaymentPlanOpen(false);
          setServicioParaPaymentPlan(null);
        }}
        onAdd={handleAddPaymentPlan}
        isDarkMode={isDarkMode}
        servicioId={servicioParaPaymentPlan}
      />
    </div>
  );
};

export default TablaAsesoriaSubscripcion;
