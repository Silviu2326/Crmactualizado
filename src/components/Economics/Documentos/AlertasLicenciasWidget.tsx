import React from 'react';
import { AlertTriangle, Calendar } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';

interface Alerta {
  id: number;
  mensaje: string;
  tipo: 'warning' | 'danger';
  fechaExpiracion: string;
}

const AlertasLicenciasWidget: React.FC = () => {
  const { theme } = useTheme();

  const alertas: Alerta[] = [
    { id: 1, mensaje: "Licencia de Software expira en 30 días", tipo: "warning", fechaExpiracion: "2023-10-15" },
    { id: 2, mensaje: "Certificación de Seguridad expirada", tipo: "danger", fechaExpiracion: "2023-08-01" },
    { id: 3, mensaje: "Licencia de Operación expira en 60 días", tipo: "warning", fechaExpiracion: "2024-12-31" },
  ];

  const getAlertColor = (tipo: 'warning' | 'danger') => {
    if (theme === 'dark') {
      return tipo === 'warning' ? 'bg-yellow-900 text-yellow-200 border-yellow-700' : 'bg-red-900 text-red-200 border-red-700';
    } else {
      return tipo === 'warning' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-red-100 text-red-800 border-red-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {alertas.map((alerta) => (
        <motion.div
          key={alerta.id}
          className={`p-4 rounded-lg border ${getAlertColor(alerta.tipo)} transition-all duration-300 hover:shadow-md`}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start">
            <AlertTriangle className={`w-5 h-5 mr-3 ${alerta.tipo === 'warning' ? 'text-yellow-500' : 'text-red-500'}`} />
            <div className="flex-grow">
              <p className="font-semibold mb-1">{alerta.mensaje}</p>
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Fecha de expiración: {alerta.fechaExpiracion}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AlertasLicenciasWidget;