import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  Scale,
  TrendingUp,
  Brain,
  Heart,
  Activity,
  Plus,
  FileText,
  Calendar as CalendarIcon,
} from 'lucide-react';
import Button from '../Common/Button';

interface PanelCheckinsProps {
  clienteId: string;
}

interface Checkin {
  fecha: string;
  peso: number;
  estadoAnimo: string;
  frecuenciaCardiaca: number;
  notas: string;
}

const PanelCheckins: React.FC<PanelCheckinsProps> = ({ clienteId }) => {
  const { theme } = useTheme();
  const [showNewCheckinForm, setShowNewCheckinForm] = useState(false);
  const [checkins] = useState<Checkin[]>([
    {
      fecha: '2024-01-15',
      peso: 75.5,
      estadoAnimo: 'Excelente',
      frecuenciaCardiaca: 65,
      notas: 'Gran progreso en los ejercicios de fuerza'
    },
    {
      fecha: '2024-01-08',
      peso: 76.2,
      estadoAnimo: 'Bueno',
      frecuenciaCardiaca: 68,
      notas: 'Aumentando resistencia en cardio'
    }
  ]);

  const handleNewCheckin = () => {
    setShowNewCheckinForm(true);
  };

  return (
    <div className="flex flex-col w-full h-full gap-6">
      {/* Encabezado y Botón de Nuevo Check-in */}
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} flex justify-between items-center`}>
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Check-ins
        </h2>
        <Button
          variant="primary"
          onClick={handleNewCheckin}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Check-in</span>
        </Button>
      </div>

      {/* Resumen de Progreso */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Scale className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Último Peso
            </h3>
          </div>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            {checkins[0]?.peso} kg
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Heart className={theme === 'dark' ? 'text-red-400' : 'text-red-600'} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Frec. Cardíaca
            </h3>
          </div>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            {checkins[0]?.frecuenciaCardiaca} bpm
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Estado Anímico
            </h3>
          </div>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            {checkins[0]?.estadoAnimo}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Tendencia
            </h3>
          </div>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            Positiva
          </p>
        </motion.div>
      </div>

      {/* Historial de Check-ins */}
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Historial de Check-ins
        </h3>
        <div className="space-y-4">
          {checkins.map((checkin, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              } hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {new Date(checkin.fecha).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    <span>{checkin.peso} kg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>{checkin.frecuenciaCardiaca} bpm</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 mt-2">
                <FileText className={`w-4 h-4 mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  {checkin.notas}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Formulario de Nuevo Check-in (Modal) */}
      {showNewCheckinForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-full max-w-md`}
          >
            <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Nuevo Check-in
            </h3>
            {/* Aquí iría el formulario de nuevo check-in */}
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="secondary"
                onClick={() => setShowNewCheckinForm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // Aquí iría la lógica para guardar el check-in
                  setShowNewCheckinForm(false);
                }}
              >
                Guardar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PanelCheckins;
