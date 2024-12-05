import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { User, Calendar, Dumbbell, Eye, UserPlus } from 'lucide-react';
import Button from '../ui/Button';
import { ClienteSelector } from './ClienteSelector';

interface Cliente {
  id: string;
  nombre: string;
  planificacion: string;
  esqueleto: string;
  semana: number;
  dia: number;
}

interface VistaClientesProps {
  plantilla: any;
  onVerRutina?: (clienteId: string) => void;
  onAddCliente?: (clienteId: string) => void;
}

const clientesEjemplo: Cliente[] = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    planificacion: 'Plan Básico',
    esqueleto: 'Full Body',
    semana: 1,
    dia: 1
  },
  {
    id: '2',
    nombre: 'María García',
    planificacion: 'Plan Avanzado',
    esqueleto: 'Push/Pull/Legs',
    semana: 2,
    dia: 3
  },
  {
    id: '3',
    nombre: 'Carlos López',
    planificacion: 'Plan Intermedio',
    esqueleto: 'Upper/Lower',
    semana: 3,
    dia: 5
  }
];

const getDiaSemana = (dia: number): string => {
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  return dias[dia - 1] || 'Día desconocido';
};

export const VistaClientes: React.FC<VistaClientesProps> = ({
  plantilla,
  onVerRutina = () => {},
  onAddCliente = () => {}
}) => {
  const { theme } = useTheme();
  const [isClienteSelectorOpen, setIsClienteSelectorOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleSelectCliente = (clienteId: string) => {
    onAddCliente(clienteId);
    setIsClienteSelectorOpen(false);
  };

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`p-6 rounded-xl shadow-lg ${
          theme === 'dark' 
            ? 'bg-gray-800 text-white' 
            : 'bg-white text-gray-800'
        }`}
      >
        <div className="mb-6 flex justify-between items-center">
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
          >
            Clientes Asignados
          </motion.h2>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={() => setIsClienteSelectorOpen(true)}
              className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-medium
                ${theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                } transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
            >
              <UserPlus size={20} />
              <span>Añadir Cliente y Generar Rutina</span>
            </Button>
          </motion.div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="w-full">
            <thead>
              <tr className={`${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              } border-b ${
                theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
              }`}>
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center space-x-2">
                    <User className="text-blue-500" size={18} />
                    <span className="font-semibold">Cliente</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-purple-500" size={18} />
                    <span className="font-semibold">Planificación</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center space-x-2">
                    <Dumbbell className="text-green-500" size={18} />
                    <span className="font-semibold">Esqueleto</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="font-semibold">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {clientesEjemplo.map((cliente, index) => (
                <motion.tr
                  key={cliente.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border-b transition-colors duration-200 ${
                    theme === 'dark' 
                      ? 'border-gray-700 hover:bg-gray-700/50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        theme === 'dark' 
                          ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                          : 'bg-gradient-to-br from-blue-400 to-purple-400'
                      } text-white font-semibold`}>
                        {cliente.nombre.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-lg">{cliente.nombre}</div>
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          ID: {cliente.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-lg">{cliente.planificacion}</div>
                      <div className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <span className="inline-flex items-center space-x-1">
                          <Calendar size={14} className="text-purple-500" />
                          <span>Semana {cliente.semana} - {getDiaSemana(cliente.dia)}</span>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-green-400 border border-green-500/30' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {cliente.esqueleto}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button
                      onClick={() => onVerRutina(cliente.id)}
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-blue-500 hover:bg-blue-600'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white transition-colors duration-200`}
                    >
                      <Eye size={16} />
                      <span>Ver Rutina</span>
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {clientesEjemplo.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center py-12 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              <Dumbbell size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No hay clientes asignados</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      <ClienteSelector
        isOpen={isClienteSelectorOpen}
        onClose={() => setIsClienteSelectorOpen(false)}
        onSelectCliente={handleSelectCliente}
      />
    </>
  );
};

export default VistaClientes;
