import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Edit, Eye, Trash } from 'lucide-react';
import TablaClientes from './TablaClientes';
import type { PlanPago } from '../types/servicios';

interface Props {
  planes: PlanPago[];
}

const TablaPlanesServicio = ({ planes }: Props) => {
  const [clientesExpandidos, setClientesExpandidos] = useState<number | null>(
    null
  );

  return (
    <div className="rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gradient-to-r from-indigo-50 to-blue-50">
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Precio
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Duración
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {planes.map((plan, index) => (
            <React.Fragment key={plan.id}>
              <motion.tr
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-blue-50/50 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {plan.nombre}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 text-sm font-semibold text-green-600 bg-green-50 rounded-full inline-block"
                  >
                    {plan.precio}
                  </motion.span>
                </td>
                <td className="px-6 py-4">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-full inline-block"
                  >
                    {plan.duracion}
                  </motion.span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
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
                      className="text-indigo-600 hover:text-indigo-800 transition-colors duration-150 relative group"
                    >
                      <Eye className="w-5 h-5" />
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Ver Clientes
                      </span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-150 relative group"
                    >
                      <Edit className="w-5 h-5" />
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Editar
                      </span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-red-600 hover:text-red-800 transition-colors duration-150 relative group"
                    >
                      <Trash className="w-5 h-5" />
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
                      className="bg-gray-50 border-t border-b border-gray-200"
                    >
                      <motion.div
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="p-4"
                      >
                        <TablaClientes clientes={plan.clientes} />
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
