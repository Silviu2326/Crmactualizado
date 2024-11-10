import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Clock, Calendar, Users, CheckCircle, 
  AlertTriangle, ArrowLeft, Edit2, Trash2,
  Download, Share2, Eye
} from 'lucide-react';
import Button from '../Common/Button';

interface Pregunta {
  id: string;
  texto: string;
  categoria: string;
}

interface Cuestionario {
  id: string;
  titulo: string;
  descripcion: string;
  frecuencia: string;
  preguntas: Pregunta[];
  fechaCreacion: string;
  estado: string;
  responses: number;
  completion: string;
}

interface VistaCuestionarioProps {
  cuestionario: Cuestionario;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const VistaCuestionario: React.FC<VistaCuestionarioProps> = ({
  cuestionario,
  onClose,
  onEdit,
  onDelete
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'detalles' | 'respuestas'>('detalles');

  const statsCards = [
    {
      icon: Users,
      title: "Respuestas Totales",
      value: cuestionario.responses,
      color: "bg-blue-500"
    },
    {
      icon: CheckCircle,
      title: "Tasa de Completado",
      value: cuestionario.completion,
      color: "bg-green-500"
    },
    {
      icon: Clock,
      title: "Frecuencia",
      value: cuestionario.frecuencia,
      color: "bg-purple-500"
    },
    {
      icon: Calendar,
      title: "Última Actualización",
      value: new Date(cuestionario.fechaCreacion).toLocaleDateString(),
      color: "bg-amber-500"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <Button variant="normal" onClick={onClose}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </Button>
            <div className="flex space-x-2">
              <Button variant="normal">
                <Share2 className="w-5 h-5 mr-2" />
                Compartir
              </Button>
              <Button variant="normal">
                <Download className="w-5 h-5 mr-2" />
                Exportar
              </Button>
              <Button variant="normal" onClick={onEdit}>
                <Edit2 className="w-5 h-5 mr-2" />
                Editar
              </Button>
              <Button variant="danger" onClick={onDelete}>
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            {cuestionario.titulo}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {cuestionario.descripcion}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
          {statsCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              } p-4 rounded-lg shadow-md`}
            >
              <div className="flex items-center space-x-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">{card.title}</h3>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('detalles')}
              className={`py-4 px-6 focus:outline-none ${
                activeTab === 'detalles'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500'
              }`}
            >
              <Eye className="w-5 h-5 inline-block mr-2" />
              Detalles
            </button>
            <button
              onClick={() => setActiveTab('respuestas')}
              className={`py-4 px-6 focus:outline-none ${
                activeTab === 'respuestas'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500'
              }`}
            >
              <CheckCircle className="w-5 h-5 inline-block mr-2" />
              Respuestas
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 400px)' }}>
          {activeTab === 'detalles' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Preguntas del Cuestionario</h3>
                <div className="space-y-4">
                  {cuestionario.preguntas.map((pregunta, index) => (
                    <motion.div
                      key={pregunta.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium">{pregunta.texto}</p>
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
                              theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                            }`}>
                              {pregunta.categoria}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Próximamente</h3>
              <p className="text-gray-500">
                La visualización de respuestas estará disponible en una próxima actualización.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VistaCuestionario;