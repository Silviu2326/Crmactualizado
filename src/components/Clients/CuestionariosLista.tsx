import React, { useState } from 'react';
import { ClipboardList, Plus, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../Common/Button';
import CrearCuestionario from './CrearCuestionario';
import VistaCuestionario from './VistaCuestionario';

const CuestionariosLista: React.FC = () => {
  const { theme } = useTheme();
  const [showCrearCuestionario, setShowCrearCuestionario] = useState(false);
  const [selectedCuestionario, setSelectedCuestionario] = useState<any>(null);
  
  const questionnaires = [
    {
      id: '1',
      titulo: 'Evaluación Inicial',
      descripcion: 'Cuestionario de salud y objetivos',
      responses: 45,
      status: 'Activo',
      completion: '85%',
      lastUpdate: '2024-03-15',
      frecuencia: 'Única vez',
      fechaCreacion: '2024-03-01',
      preguntas: [
        { id: '1', texto: '¿Cuál es tu objetivo principal?', categoria: 'Objetivos' },
        { id: '2', texto: '¿Tienes alguna lesión?', categoria: 'Salud' }
      ]
    },
    {
      id: '2',
      titulo: 'Seguimiento Mensual',
      descripcion: 'Progreso y satisfacción',
      responses: 32,
      status: 'Pendiente',
      completion: '60%',
      lastUpdate: '2024-03-14',
      frecuencia: 'Mensual',
      fechaCreacion: '2024-02-15',
      preguntas: [
        { id: '3', texto: '¿Has notado mejoras?', categoria: 'Progreso' },
        { id: '4', texto: '¿Cómo te sientes?', categoria: 'Bienestar' }
      ]
    },
    {
      id: '3',
      titulo: 'Evaluación Nutricional',
      descripcion: 'Hábitos alimenticios',
      responses: 28,
      status: 'Completado',
      completion: '100%',
      lastUpdate: '2024-03-13',
      frecuencia: 'Semanal',
      fechaCreacion: '2024-03-10',
      preguntas: [
        { id: '5', texto: '¿Cuántas comidas haces al día?', categoria: 'Nutrición' },
        { id: '6', texto: '¿Sigues alguna dieta?', categoria: 'Nutrición' }
      ]
    }
  ];

  const handleSaveCuestionario = (cuestionario: any) => {
    console.log('Nuevo cuestionario:', cuestionario);
    // Aquí iría la lógica para guardar el cuestionario
  };

  const handleDeleteCuestionario = () => {
    console.log('Eliminar cuestionario:', selectedCuestionario.id);
    setSelectedCuestionario(null);
    // Aquí iría la lógica para eliminar el cuestionario
  };

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Cuestionarios
        </h2>
        <Button variant="create" onClick={() => setShowCrearCuestionario(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Cuestionario
        </Button>
      </div>

      <div className="grid gap-4">
        {questionnaires.map((questionnaire, index) => (
          <motion.div
            key={questionnaire.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            } p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-102 cursor-pointer`}
            onClick={() => setSelectedCuestionario(questionnaire)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-2">{questionnaire.titulo}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{questionnaire.descripcion}</p>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1 text-blue-500" />
                    <span>{questionnaire.responses} respuestas</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-purple-500" />
                    <span>Actualizado: {questionnaire.lastUpdate}</span>
                  </div>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                questionnaire.status === 'Activo' ? 'bg-green-100 text-green-800' :
                questionnaire.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {questionnaire.status}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Completado</span>
                <span className="text-sm font-medium">{questionnaire.completion}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className={`h-2.5 rounded-full ${
                    parseInt(questionnaire.completion) === 100 ? 'bg-green-600' :
                    parseInt(questionnaire.completion) > 50 ? 'bg-blue-600' :
                    'bg-yellow-600'
                  }`}
                  style={{ width: questionnaire.completion }}
                ></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showCrearCuestionario && (
          <CrearCuestionario
            onClose={() => setShowCrearCuestionario(false)}
            onSave={handleSaveCuestionario}
          />
        )}
        {selectedCuestionario && (
          <VistaCuestionario
            cuestionario={selectedCuestionario}
            onClose={() => setSelectedCuestionario(null)}
            onEdit={() => {
              setSelectedCuestionario(null);
              setShowCrearCuestionario(true);
            }}
            onDelete={handleDeleteCuestionario}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CuestionariosLista;