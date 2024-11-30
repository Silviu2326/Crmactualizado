import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Library, Clock, Dumbbell, Target, Plus, Star } from 'lucide-react';
import Button from '../Common/Button';
import { motion } from 'framer-motion';

interface VistaRutinasPredefinadasProps {
  planSemanal: any;
  updatePlan: (plan: any) => void;
}

const VistaRutinasPredefinadas: React.FC<VistaRutinasPredefinadasProps> = () => {
  const { theme } = useTheme();

  const rutinas = [
    {
      id: 1,
      nombre: 'Fuerza Total',
      descripcion: 'Programa completo de fuerza para todo el cuerpo',
      duracion: '12 semanas',
      nivel: 'Intermedio',
      categoria: 'Fuerza',
      rating: 4.8,
      imagen: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      id: 2,
      nombre: 'Hipertrofia Avanzada',
      descripcion: 'Enfoque en el crecimiento muscular máximo',
      duracion: '8 semanas',
      nivel: 'Avanzado',
      categoria: 'Hipertrofia',
      rating: 4.9,
      imagen: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      id: 3,
      nombre: 'Pérdida de Grasa',
      descripcion: 'Programa de alta intensidad para quemar grasa',
      duracion: '6 semanas',
      nivel: 'Principiante',
      categoria: 'Cardio',
      rating: 4.7,
      imagen: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
  ];

  return (
    <div className="space-y-8">
      <div className={`p-6 rounded-xl shadow-lg
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Library className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">Rutinas Predefinidas</h2>
          </div>
          <div className="flex space-x-4">
            <select
              className={`px-4 py-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <option value="">Todas las categorías</option>
              <option value="fuerza">Fuerza</option>
              <option value="hipertrofia">Hipertrofia</option>
              <option value="cardio">Cardio</option>
            </select>
            <select
              className={`px-4 py-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <option value="">Todos los niveles</option>
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rutinas.map((rutina) => (
            <motion.div
              key={rutina.id}
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl overflow-hidden shadow-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-white'
              }`}
            >
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${rutina.imagen})` }}
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{rutina.nombre}</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm">{rutina.rating}</span>
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {rutina.descripcion}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="text-sm">{rutina.duracion}</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-2 text-green-500" />
                    <span className="text-sm">{rutina.nivel}</span>
                  </div>
                  <div className="flex items-center">
                    <Dumbbell className="w-4 h-4 mr-2 text-purple-500" />
                    <span className="text-sm">{rutina.categoria}</span>
                  </div>
                </div>
                <Button
                  variant="create"
                  className="w-full justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Aplicar Rutina
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VistaRutinasPredefinadas;