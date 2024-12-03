import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
  DollarSign,
  CreditCard,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  FileText,
  TrendingUp,
  Receipt,
  Wallet,
  AlertCircle,
} from 'lucide-react';
import Button from '../Common/Button';

interface PanelFinanzasProps {
  clienteId: string;
}

interface Transaccion {
  id: string;
  fecha: string;
  concepto: string;
  monto: number;
  estado: 'completado' | 'pendiente' | 'cancelado';
  metodoPago: string;
}

interface PlanPago {
  id: string;
  nombre: string;
  monto: number;
  frecuencia: 'mensual' | 'trimestral' | 'anual';
  fechaInicio: string;
  fechaProximoPago: string;
  estado: 'activo' | 'pausado' | 'cancelado';
}

const PanelFinanzas: React.FC<PanelFinanzasProps> = ({ clienteId }) => {
  const { theme } = useTheme();
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);
  
  // Datos de ejemplo
  const [planesPago] = useState<PlanPago[]>([
    {
      id: '1',
      nombre: 'Plan Premium',
      monto: 49.99,
      frecuencia: 'mensual',
      fechaInicio: '2024-01-01',
      fechaProximoPago: '2024-02-01',
      estado: 'activo'
    }
  ]);

  const [transacciones] = useState<Transaccion[]>([
    {
      id: '1',
      fecha: '2024-01-15',
      concepto: 'Pago mensual - Plan Premium',
      monto: 49.99,
      estado: 'completado',
      metodoPago: 'Tarjeta de crédito'
    },
    {
      id: '2',
      fecha: '2024-01-01',
      concepto: 'Sesión personal adicional',
      monto: 30.00,
      estado: 'completado',
      metodoPago: 'Efectivo'
    }
  ]);

  const handleNewPayment = () => {
    setShowNewPaymentForm(true);
  };

  const totalPagado = transacciones
    .filter(t => t.estado === 'completado')
    .reduce((sum, t) => sum + t.monto, 0);

  return (
    <div className="flex flex-col w-full h-full gap-6">
      {/* Encabezado y Botón de Nuevo Pago */}
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} flex justify-between items-center`}>
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Finanzas
        </h2>
        <Button
          variant="primary"
          onClick={handleNewPayment}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Pago</span>
        </Button>
      </div>

      {/* Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Wallet className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Total Pagado
            </h3>
          </div>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            ${totalPagado.toFixed(2)}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Receipt className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Plan Actual
            </h3>
          </div>
          <p className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            {planesPago[0]?.nombre || 'Sin plan'}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Próximo Pago
            </h3>
          </div>
          <p className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            {planesPago[0]?.fechaProximoPago ? new Date(planesPago[0].fechaProximoPago).toLocaleDateString() : 'N/A'}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={theme === 'dark' ? 'text-orange-400' : 'text-orange-600'} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Estado
            </h3>
          </div>
          <p className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            Al día
          </p>
        </motion.div>
      </div>

      {/* Plan de Pago Actual */}
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Plan de Pago Actual
        </h3>
        {planesPago[0] ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                ${planesPago[0].monto}/mes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                Frecuencia: {planesPago[0].frecuencia}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} />
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                Estado: {planesPago[0].estado}
              </span>
            </div>
          </div>
        ) : (
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
            No hay plan de pago activo
          </p>
        )}
      </div>

      {/* Historial de Transacciones */}
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Historial de Transacciones
        </h3>
        <div className="space-y-4">
          {transacciones.map((transaccion, index) => (
            <motion.div
              key={transaccion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              } hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {new Date(transaccion.fecha).toLocaleDateString()}
                  </span>
                </div>
                <span className={`font-bold ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                  ${transaccion.monto.toFixed(2)}
                </span>
              </div>
              <div className="mt-2">
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  {transaccion.concepto}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className={`px-2 py-1 rounded-full ${
                    transaccion.estado === 'completado'
                      ? theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                      : theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {transaccion.estado}
                  </span>
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    <span>{transaccion.metodoPago}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal de Nuevo Pago */}
      {showNewPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-full max-w-md`}
          >
            <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Registrar Nuevo Pago
            </h3>
            {/* Aquí iría el formulario de nuevo pago */}
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="secondary"
                onClick={() => setShowNewPaymentForm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // Aquí iría la lógica para procesar el pago
                  setShowNewPaymentForm(false);
                }}
              >
                Procesar Pago
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PanelFinanzas;
