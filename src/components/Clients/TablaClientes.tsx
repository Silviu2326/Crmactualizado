import React from 'react';
import { motion } from 'framer-motion';
import type { Cliente } from '../types/servicios';

interface Props {
  clientes: Cliente[];
}

const TablaClientes = ({ clientes }: Props) => (
  <div className="overflow-hidden rounded-lg border border-gray-200 shadow-inner bg-white">
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Nombre
          </th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Email
          </th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Teléfono
          </th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Fecha Inicio
          </th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Estado
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {clientes.map((cliente, index) => (
          <motion.tr
            key={cliente.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="hover:bg-gray-50/50 transition-colors duration-200"
          >
            <td className="px-6 py-4">
              <div className="text-sm font-medium text-gray-900">
                {cliente.nombre}
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-500">{cliente.email}</div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-500">{cliente.telefono}</div>
            </td>
            <td className="px-6 py-4">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full inline-block"
              >
                {cliente.fechaInicio}
              </motion.span>
            </td>
            <td className="px-6 py-4">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  cliente.estado === 'Activo'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <span
                  className={`w-2 h-2 mr-2 rounded-full ${
                    cliente.estado === 'Activo' ? 'bg-green-400' : 'bg-red-400'
                  }`}
                />
                {cliente.estado}
              </motion.span>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TablaClientes;
