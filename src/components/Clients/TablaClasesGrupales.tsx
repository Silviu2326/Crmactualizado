// TablaClasesGrupales.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash, ChevronRight, X } from 'lucide-react';
import TablaPlanesServicio from './TablaPlanesServicio';
import type { ClaseGrupal } from '../types/servicios';

interface Props {
  datos: ClaseGrupal[];
  isDarkMode: boolean;
}

const TablaClasesGrupales = ({ datos, isDarkMode }: Props) => {
  const [claseExpandida, setClaseExpandida] = useState<string | null>(null);
  const [claseEditando, setClaseEditando] = useState<ClaseGrupal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<{
    nombre: string;
    descripcion: string;
    capacidad: number;
  }>({
    nombre: '',
    descripcion: '',
    capacidad: 0,
  });

  const handleEditClick = (clase: ClaseGrupal) => {
    console.log('Editando clase:', clase.id);
    setClaseEditando(clase);
    setFormData({
      nombre: clase.nombre,
      descripcion: clase.descripcion,
      capacidad: clase.capacidad,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (claseId: string) => {
    console.log('Eliminar clase grupal:', claseId);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setClaseEditando(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacidad' ? Number(value) : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Actualizando clase grupal:', claseEditando?.id, formData);
    setIsModalOpen(false);
    setClaseEditando(null);
  };

  return (
    <div className="overflow-x-auto p-6">
      <div className="rounded-lg overflow-hidden shadow">
        <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <thead>
            <tr className={isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-[rgb(191,206,255)]'}>
              <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                Nombre
              </th>
              <th className={`px-6 py-4 text-center text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                Capacidad
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
            {datos.map((clase, index) => {
              const planes = Array.isArray(clase.planDePago) ? clase.planDePago : clase.planDePago ? [clase.planDePago] : [];
              console.log(`Clase ID: ${clase.id}, Planes de Pago:`, planes);

              return (
                <React.Fragment key={clase.id}>
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} transition-colors duration-200`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <motion.button
                        onClick={() => {
                          setClaseExpandida(claseExpandida === clase.id ? null : clase.id);
                          console.log(`Fila expandida: ${clase.id}`);
                        }}
                        className="flex items-center space-x-2 text-sm font-medium group"
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.span
                          animate={{
                            rotate: claseExpandida === clase.id ? 90 : 0,
                          }}
                          className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </motion.span>
                        <span className={`px-6 py-4 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {clase.nombre}
                        </span>
                      </motion.button>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className={`w-1/2 mx-auto ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2.5 overflow-hidden`}>
                        <motion.div
                          className={`${
                            isDarkMode
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                              : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                          } h-2.5 rounded-full`}
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(clase.participantes / clase.capacidad) * 100}%`,
                          }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                        {clase.participantes}/{clase.capacidad}
                      </div>
                    </td>

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

                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditClick(clase)}
                          className={`${
                            isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                          } transition-colors duration-150`}
                          aria-label="Editar Clase Grupal"
                        >
                          <Edit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteClick(clase.id)}
                          className={`${
                            isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
                          } transition-colors duration-150`}
                          aria-label="Eliminar Clase Grupal"
                        >
                          <Trash className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>

                  <AnimatePresence>
                    {claseExpandida === clase.id && (
                      <motion.tr
                        key={`expanded-${clase.id}`}
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

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleModalClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md overflow-hidden ${
                isDarkMode
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-white border border-gray-200'
              } rounded-lg shadow-xl`}
            >
              <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Editar Clase Grupal
                  </h3>
                  <button
                    onClick={handleModalClose}
                    className={`p-1 rounded-full hover:bg-opacity-20 ${
                      isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="nombre"
                      className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}
                    >
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-md ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                      } border focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="descripcion"
                      className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}
                    >
                      Descripción
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-3 py-2 rounded-md ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                      } border focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="capacidad"
                      className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}
                    >
                      Capacidad
                    </label>
                    <input
                      type="number"
                      id="capacidad"
                      name="capacidad"
                      value={formData.capacidad}
                      onChange={handleInputChange}
                      min="1"
                      className={`w-full px-3 py-2 rounded-md ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                      } border focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200`}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className={`px-4 py-2 rounded-md ${
                      isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    } transition-colors duration-200`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200`}
                  >
                    Guardar Cambios
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

export default TablaClasesGrupales;
