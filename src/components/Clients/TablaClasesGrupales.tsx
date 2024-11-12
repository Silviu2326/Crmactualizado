import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash } from 'lucide-react';
import type { ClaseGrupal } from '../types/servicios';

interface Props {
  datos: ClaseGrupal[];
  isDarkMode: boolean;
}

const TablaClasesGrupales = ({ datos, isDarkMode }: Props) => (
  <div className="overflow-x-auto p-6">
    <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
      <thead>
        <tr className={isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}>
          <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
            Nombre
          </th>
          <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
            Horario
          </th>
          <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
            Instructor
          </th>
          <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
            Capacidad
          </th>
          <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
            Acciones
          </th>
        </tr>
      </thead>
      <tbody className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
        {datos.map((clase, index) => (
          <motion.tr
            key={clase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50/50'} transition-colors duration-200`}
          >
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {clase.nombre}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {clase.descripcion}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-1 text-sm rounded-full inline-block ${
                  isDarkMode ? 'text-blue-400 bg-blue-900/40' : 'text-blue-600 bg-blue-50'
                }`}
              >
                {clase.horario}
              </motion.span>
            </td>
            <td className="px-6 py-4">
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{clase.instructor}</div>
            </td>
            <td className="px-6 py-4">
              <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2.5 overflow-hidden`}>
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
                {clase.participantes}/{clase.capacidad} participantes
              </div>
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
        ))}
      </tbody>
    </table>
  </div>
);

export default TablaClasesGrupales;