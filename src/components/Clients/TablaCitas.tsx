import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash, CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import type { Cita } from '../types/servicios';

interface Props {
  datos: Cita[];
  isDarkMode: boolean;
}

const TablaCitas = ({ datos, isDarkMode }: Props) => {
  const [expandedCitaId, setExpandedCitaId] = useState<string | null>(null);

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Confirmada':
        return <CheckCircle className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />;
      case 'Cancelada':
        return <XCircle className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />;
      default:
        return <Clock className={`w-5 h-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />;
    }
  };

  const getEstadoClasses = (estado: string) => {
    switch (estado) {
      case 'Confirmada':
        return isDarkMode
          ? 'bg-green-900/40 text-green-400 border-green-900/50'
          : 'bg-green-50/80 text-green-700 border-green-200 shadow-green-100/50';
      case 'Cancelada':
        return isDarkMode
          ? 'bg-red-900/40 text-red-400 border-red-900/50'
          : 'bg-red-50/80 text-red-700 border-red-200 shadow-red-100/50';
      default:
        return isDarkMode
          ? 'bg-yellow-900/40 text-yellow-400 border-yellow-900/50'
          : 'bg-yellow-50/80 text-yellow-700 border-yellow-200 shadow-yellow-100/50';
    }
  };

  const toggleExpandedRow = (citaId: string) => {
    setExpandedCitaId(expandedCitaId === citaId ? null : citaId);
  };

  return (
    <div className="p-8">
      <div className={`overflow-x-auto rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'glass'}`}>
        <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          <thead>
            <tr className={isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700' : ''}>
              <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                Servicio
              </th>
              <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                Plan de pago
              </th>
              <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                Clientes Asociados
              </th>
              <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                Fecha
              </th>
              <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                Hora
              </th>
              <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                Estado
              </th>
              <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {datos.map((cita, index) => (
              <React.Fragment key={cita.id}>
                <motion.tr
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover-card'}`}
                >
                  <td>
                    <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {cita.nombre}
                    </div>
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{cita.descripcion}</div>
                  </td>
                  <td>
                    <div className={`font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {cita.planPago}
                    </div>
                  </td>
                  <td>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleExpandedRow(cita.id)}
                      className={`flex items-center gap-2 text-sm font-medium ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} hover:underline`}
                    >
                      <Users className="w-5 h-5" />
                      Ver Clientes
                    </motion.button>
                  </td>
                  <td>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className={`table-cell-badge ${
                        isDarkMode ? 'text-blue-400 bg-blue-900/40' : 'text-blue-600 bg-blue-50/80'
                      } border-blue-100`}
                    >
                      {cita.fecha}
                    </motion.span>
                  </td>
                  <td>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className={`table-cell-badge ${
                        isDarkMode ? 'text-indigo-400 bg-indigo-900/40' : 'text-indigo-600 bg-indigo-50/80'
                      } border-indigo-100`}
                    >
                      {cita.hora}
                    </motion.span>
                  </td>
                  <td>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`status-badge shadow-sm ${getEstadoClasses(cita.estado)}`}
                    >
                      <span className="mr-2">{getEstadoIcon(cita.estado)}</span>
                      {cita.estado}
                    </motion.div>
                  </td>
                  <td>
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`action-button ${
                          isDarkMode ? 'text-blue-400 hover:bg-blue-900/40' : 'text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <Edit className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`action-button ${
                          isDarkMode ? 'text-red-400 hover:bg-red-900/40' : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <Trash className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>

                {/* Tabla de Clientes Asociados (expandible) */}
                {expandedCitaId === cita.id && Array.isArray(cita.clientes) && cita.clientes.length > 0 && (
                  <tr>
                    <td colSpan={7}>
                      <div className="p-4 bg-gray-100 rounded-lg shadow-inner">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cita.clientes.map((cliente) => (
                              <tr key={cliente.id} className="hover:bg-gray-100">
                                <td className="px-4 py-2">{cliente.nombre}</td>
                                <td className="px-4 py-2">{cliente.email}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaCitas;