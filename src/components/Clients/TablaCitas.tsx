import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Cita } from '../types/servicios';

interface Props {
  datos: Cita[];
}

const TablaCitas = ({ datos }: Props) => {
  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Confirmada':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Cancelada':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getEstadoClasses = (estado: string) => {
    switch (estado) {
      case 'Confirmada':
        return 'bg-green-50/80 text-green-700 border-green-200 shadow-green-100/50';
      case 'Cancelada':
        return 'bg-red-50/80 text-red-700 border-red-200 shadow-red-100/50';
      default:
        return 'bg-yellow-50/80 text-yellow-700 border-yellow-200 shadow-yellow-100/50';
    }
  };

  return (
    <div className="p-8">
      <div className="overflow-x-auto rounded-2xl glass">
        <table className="min-w-full">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((cita, index) => (
              <motion.tr
                key={cita.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover-card"
              >
                <td>
                  <div className="font-medium text-gray-900">
                    {cita.cliente}
                  </div>
                </td>
                <td>
                  <div>
                    <div className="font-medium text-gray-900">
                      {cita.nombre}
                    </div>
                    <div className="text-gray-500">{cita.descripcion}</div>
                  </div>
                </td>
                <td>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="table-cell-badge text-blue-600 bg-blue-50/80 border-blue-100"
                  >
                    {cita.fecha}
                  </motion.span>
                </td>
                <td>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="table-cell-badge text-indigo-600 bg-indigo-50/80 border-indigo-100"
                  >
                    {cita.hora}
                  </motion.span>
                </td>
                <td>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`status-badge shadow-sm ${getEstadoClasses(
                      cita.estado
                    )}`}
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
                      className="action-button text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="action-button text-red-600 hover:bg-red-50"
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
    </div>
  );
};

export default TablaCitas;
