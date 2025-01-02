import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AudienceAnalyzerProps {
  onClose: () => void;
}

interface Question {
  id: number;
  question: string;
  defaultAnswer: string;
  answer: string;
}

const AudienceAnalyzer: React.FC<AudienceAnalyzerProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: "¿Cuál es la distribución demográfica de tu audiencia?",
      defaultAnswer: "60% mujeres, 40% hombres, principalmente 25-45 años",
      answer: ""
    },
    {
      id: 2,
      question: "¿Cuáles son los principales intereses de tu audiencia en redes sociales?",
      defaultAnswer: "Fitness, nutrición saludable, bienestar mental, lifestyle",
      answer: ""
    },
    {
      id: 3,
      question: "¿En qué horarios tu audiencia está más activa en redes sociales?",
      defaultAnswer: "Mañanas (7-9am) y noches (8-11pm)",
      answer: ""
    },
    {
      id: 4,
      question: "¿Qué tipo de contenido genera mayor engagement?",
      defaultAnswer: "Videos cortos de ejercicios, antes/después, consejos rápidos",
      answer: ""
    },
    {
      id: 5,
      question: "¿Cuáles son las principales preocupaciones o pain points de tu audiencia?",
      defaultAnswer: "Falta de tiempo, resultados lentos, motivación inconsistente",
      answer: ""
    },
    {
      id: 6,
      question: "¿Qué nivel de conocimiento tiene tu audiencia sobre fitness?",
      defaultAnswer: "Principiante a intermedio, buscan guía profesional",
      answer: ""
    },
    {
      id: 7,
      question: "¿Qué presupuesto promedio destina tu audiencia al fitness?",
      defaultAnswer: "50-150€ mensuales en servicios fitness y suplementos",
      answer: ""
    },
    {
      id: 8,
      question: "¿Qué objetivos de transformación busca tu audiencia?",
      defaultAnswer: "Pérdida de peso, tonificación, hábitos saludables",
      answer: ""
    },
    {
      id: 9,
      question: "¿Qué tipo de formato de contenido prefiere tu audiencia?",
      defaultAnswer: "Reels/Stories (40%), Posts (30%), Lives (20%), Carruseles (10%)",
      answer: ""
    },
    {
      id: 10,
      question: "¿Qué competidores siguen tus seguidores?",
      defaultAnswer: "Otros entrenadores personales, influencers fitness, marcas deportivas",
      answer: ""
    }
  ]);

  const handleAnswerChange = (id: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, answer: value } : q
    ));
  };

  const handleSave = () => {
    // Aquí puedes implementar la lógica para guardar las respuestas
    console.log('Análisis de audiencia guardado:', questions);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        theme === 'dark' ? 'bg-black/50' : 'bg-gray-500/50'
      }`}
    >
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-inherit">
          <h2 className="text-2xl font-bold">Análisis Detallado de Audiencia</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <label className="block text-lg font-medium">
                {q.question}
              </label>
              <textarea
                value={q.answer}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                placeholder={q.defaultAnswer}
                className={`w-full p-3 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                rows={3}
              />
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 flex justify-end gap-4 p-6 border-t border-gray-200 dark:border-gray-700 bg-inherit">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Guardar Análisis
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AudienceAnalyzer;
