import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Eye, Trash } from 'lucide-react';
import TablaClientes from './TablaClientes';
import type { PlanPago } from '../types/servicios';

interface Props {
  planes: PlanPago[];
  isDarkMode: boolean;
}

const TablaPlanesServicio = ({ planes, isDarkMode }: Props) => {
  const [clientesExpandidos, setClientesExpandidos] = useState<number | null>(null);

  return (
    <div className="rounded-lg overflow-hidden">
      <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead>
          <tr className={isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-indigo-50 to-blue-50'}>
            <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
              Nombre
            </th>
            <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
              Precio
            </th>
            <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
              Duración
            </th>
            <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
              Descripción
            </th>
            <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
          {planes.map((plan, index) => (
            <React.Fragment key={plan.id}>
              <motion.tr
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50/50'} transition-colors duration-200`}
              >
                <td className="px-6 py-4">
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
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
                    {plan.precio}
                  </motion.span>
                </td>
                <td className="px-6 py-4">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className={`px-3 py-1 text-sm rounded-full inline-block ${
                      isDarkMode ? 'text-blue-400 bg-blue-900/40' : 'text-blue-600 bg-blue-50'
                    }`}
                  >
                    {plan.duracion}
                  </motion.span>
                </td>
                <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {plan.descripcion}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setClientesExpandidos(
                          clientesExpandidos === plan.id ? null : plan.id
                        )
                      }
                      className={`${
                        isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
                      } transition-colors duration-150 relative group`}
                    >
                      <Eye className="w-5 h-5" />
                      <span className={`absolute -top-8 left-1/2 transform -translate-x-1/2 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-800'
                      } text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                        Ver Clientes
                      </span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`${
                        isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                      } transition-colors duration-150 relative group`}
                    >
                      <Edit className="w-5 h-5" />
                      <span className={`absolute -top-8 left-1/2 transform -translate-x-1/2 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-800'
                      } text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                        Editar
                      </span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`${
                        isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
                      } transition-colors duration-150 relative group`}
                    >
                      <Trash className="w-5 h-5" />
                      <span className={`absolute -top-8 left-1/2 transform -translate-x-1/2 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-800'
                      } text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                        Eliminar
                      </span>
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
              <AnimatePresence>
                {clientesExpandidos === plan.id && (
                  <motion.tr
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td
                      colSpan={5}
                      className={`${
                        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
                      } border-t border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <motion.div
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="p-4"
                      >
                        <TablaClientes clientes={plan.clientes} isDarkMode={isDarkMode} />
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

export default TablaPlanesServicio;