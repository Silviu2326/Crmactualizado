import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';

interface Alerta {
  id: number;
  tipo: 'warning' | 'danger';
  mensaje: string;
  fechaExpiracion: string;
}

const AlertasLicenciasWidget: React.FC = () => {
  const { theme } = useTheme();

  const alertas: Alerta[] = [
    {
      id: 1,
      tipo: 'warning',
      mensaje: 'La licencia de Software expirará en 30 días',
      fechaExpiracion: '2023-10-15'
    },
    {
      id: 2,
      tipo: 'danger',
      mensaje: 'La Certificación de Seguridad ha expirado',
      fechaExpiracion: '2023-08-01'
    }
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
    >
      <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
        Alertas de Licencias
      </h3>
      <div className="space-y-4">
        {alertas.map((alerta) => (
          <div
            key={alerta.id}
            className={`p-4 rounded-lg border ${getAlertColor(alerta.tipo)} flex items-start space-x-3`}
          >
            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">{alerta.mensaje}</p>
              <p className="text-sm opacity-75">Fecha: {alerta.fechaExpiracion}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AlertasLicenciasWidget;