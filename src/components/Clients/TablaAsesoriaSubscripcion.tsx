import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash, ChevronDown, ChevronRight } from 'lucide-react';
import TablaPlanesServicio from './TablaPlanesServicio';
import type { ServicioAsesoriaSubscripcion } from '../types/servicios';

interface Props {
  datos: ServicioAsesoriaSubscripcion[];
}

const TablaAsesoriaSubscripcion = ({ datos }: Props) => {
  const [servicioExpandido, setServicioExpandido] = useState<number | null>(
    null
  );

  return (
    <div className="overflow-x-auto p-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Duración
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {datos.map((servicio, index) => (
            <React.Fragment key={servicio.id}>
              <motion.tr
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-blue-50/50 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <motion.button
                    onClick={() =>
                      setServicioExpandido(
                        servicioExpandido === servicio.id ? null : servicio.id
                      )
                    }
                    className="flex items-center space-x-2 text-sm font-medium text-gray-900 group"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      animate={{
                        rotate: servicioExpandido === servicio.id ? 90 : 0,
                      }}
                      className="text-blue-600"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.span>
                    <span className="group-hover:text-blue-600 transition-colors duration-150">
                      {servicio.nombre}
                    </span>
                  </motion.button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {servicio.descripcion}
                </td>
                <td className="px-6 py-4">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-full inline-block"
                  >
                    {servicio.duracion}
                  </motion.span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                    >
                      <Edit className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-red-600 hover:text-red-800 transition-colors duration-150"
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
                      className="bg-gray-50 border-t border-b border-gray-200"
                    >
                      <motion.div
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="p-4"
                      >
                        <TablaPlanesServicio planes={servicio.planes} />
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
