import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash, ChevronRight } from 'lucide-react';
import TablaPlanesServicio from './TablaPlanesServicio';
import type { ServicioAsesoriaSubscripcion } from '../types/servicios';

interface Props {
  datos: ServicioAsesoriaSubscripcion[];
  isDarkMode: boolean;
}

const TablaAsesoriaSubscripcion = ({ datos, isDarkMode }: Props) => {
  const [servicioExpandido, setServicioExpandido] = useState<number | null>(null);

  return (
    <div className="overflow-x-auto p-6">
      <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead>
          <tr className={isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}>
            <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
              Nombre
            </th>
            <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
              Descripción
            </th>
            <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
              Duración
            </th>
            <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
          {datos.map((servicio, index) => (
            <React.Fragment key={servicio.id}>
              <motion.tr
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50/50'} transition-colors duration-200`}
              >
                <td className="px-6 py-4">
                  <motion.button
                    onClick={() =>
                      setServicioExpandido(
                        servicioExpandido === servicio.id ? null : servicio.id
                      )
                    }
                    className={`flex items-center space-x-2 text-sm font-medium ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-900'
                    } group`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      animate={{
                        rotate: servicioExpandido === servicio.id ? 90 : 0,
                      }}
                      className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.span>
                    <span className={`group-hover:${isDarkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors duration-150`}>
                      {servicio.nombre}
                    </span>
                  </motion.button>
                </td>
                <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {servicio.descripcion}
                </td>
                <td className="px-6 py-4">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className={`px-3 py-1 text-sm rounded-full inline-block ${
                      isDarkMode ? 'text-blue-400 bg-blue-900/40' : 'text-blue-600 bg-blue-50'
                    }`}
                  >
                    {servicio.duracion}
                  </motion.span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`${
                        isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                      } transition-colors duration-150`}
                    >
                      <Edit className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`${
                        isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
                      } transition-colors duration-150`}
                    >
                      <Trash className="w-5 h-5" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
              <AnimatePresence>
                {servicioExpandido === servicio.id && (
                  <motion.tr
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td
                      colSpan={4}
                      className={`${
                        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
                      } border-t border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <motion.div
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="p-4"
                      >
                        <TablaPlanesServicio planes={servicio.planes} isDarkMode={isDarkMode} />
                      </motion.div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaAsesoriaSubscripcion;