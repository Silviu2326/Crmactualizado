import React, { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, Clock } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Alerta {
  _id: string;
  nombre: string;
  tipo: 'Vencimiento' | 'Renovación' | 'Pago Pendiente' | 'Otro';
  fechaExpiracion: string;
  fechaFinalizacion: string;
  estado: 'Activa' | 'Finalizada' | 'Cancelada';
  notas?: string;
  contrato?: string;
  licencia?: string;
  otroDocumento?: string;
  trainer?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  status: string;
  results: number;
  data: {
    alerts: Alerta[];
  };
}

const AlertasLicenciasWidget: React.FC = () => {
  const { theme } = useTheme();
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAlertas();
  }, []);

  const fetchAlertas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get<ApiResponse>(
        'https://fitoffice2-f70b52bef77e.herokuapp.com//api/economic-alerts',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setAlertas(response.data.data.alerts);
    } catch (error) {
      console.error('Error al obtener alertas:', error);
      setError('Error al cargar las alertas');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAlertColor = (tipo: Alerta['tipo'], estado: Alerta['estado']) => {
    if (estado !== 'Activa') {
      return theme === 'dark' 
        ? 'bg-gray-800 text-gray-300 border-gray-700'
        : 'bg-gray-100 text-gray-600 border-gray-300';
    }

    if (theme === 'dark') {
      switch (tipo) {
        case 'Vencimiento':
          return 'bg-red-900 text-red-200 border-red-700';
        case 'Renovación':
          return 'bg-yellow-900 text-yellow-200 border-yellow-700';
        case 'Pago Pendiente':
          return 'bg-orange-900 text-orange-200 border-orange-700';
        default:
          return 'bg-blue-900 text-blue-200 border-blue-700';
      }
    } else {
      switch (tipo) {
        case 'Vencimiento':
          return 'bg-red-100 text-red-800 border-red-300';
        case 'Renovación':
          return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'Pago Pendiente':
          return 'bg-orange-100 text-orange-800 border-orange-300';
        default:
          return 'bg-blue-100 text-blue-800 border-blue-300';
      }
    }
  };

  const getAlertIcon = (tipo: Alerta['tipo']) => {
    switch (tipo) {
      case 'Vencimiento':
        return 'text-red-500';
      case 'Renovación':
        return 'text-yellow-500';
      case 'Pago Pendiente':
        return 'text-orange-500';
      default:
        return 'text-blue-500';
    }
  };

  if (isLoading) {
    return (
      <div className={`text-center py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        Cargando alertas...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
        {error}
      </div>
    );
  }

  if (alertas.length === 0) {
    return (
      <div className={`text-center py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        No hay alertas activas
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {alertas.map((alerta) => (
        <motion.div
          key={alerta._id}
          className={`p-4 rounded-lg border ${getAlertColor(alerta.tipo, alerta.estado)} transition-all duration-300 hover:shadow-md`}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start">
            <AlertTriangle className={`w-5 h-5 mr-3 ${getAlertIcon(alerta.tipo)}`} />
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-1">
                <p className="font-semibold">{alerta.nombre}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  alerta.estado === 'Activa' 
                    ? theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                    : theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {alerta.estado}
                </span>
              </div>
              <div className="flex items-center text-sm space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Expira: {formatDate(alerta.fechaExpiracion)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Finaliza: {formatDate(alerta.fechaFinalizacion)}</span>
                </div>
              </div>
              {alerta.notas && (
                <p className="mt-2 text-sm opacity-80">{alerta.notas}</p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AlertasLicenciasWidget;