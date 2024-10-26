import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface EditPlanningPageCalendarioProps {
  semanas: number;
  semanaActual: number;
  setSemanaActual: (semana: number) => void;
  onAddWeek: () => void;
}

const EditPlanningPageCalendario: React.FC<EditPlanningPageCalendarioProps> = ({
  semanas,
  semanaActual,
  setSemanaActual,
  onAddWeek,
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (semanaActual > startIndex + 6) {
      setStartIndex(semanaActual - 6);
    } else if (semanaActual <= startIndex) {
      setStartIndex(Math.max(0, semanaActual - 1));
    }
  }, [semanaActual]);

  const cambiarSemana = (direccion: 'anterior' | 'siguiente') => {
    setSemanaActual(prev => 
      direccion === 'anterior' 
        ? Math.max(1, prev - 1) 
        : Math.min(semanas, prev + 1)
    );
  };

  const getFechasRango = (semana: number) => {
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() + (semana - 1) * 7);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + 6);
    return `${fechaInicio.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })} - ${fechaFin.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}`;
  };

  return (
    <div 
      className={`p-8 rounded-3xl ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-blue-400 to-indigo-600'
      } shadow-2xl relative overflow-hidden transition-all duration-500 ease-in-out ${
        isHovered ? 'transform scale-105' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-cover bg-center opacity-10 transition-opacity duration-300" 
           style={{backgroundImage: 'url(https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)'}}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8 text-white">
          <button 
            onClick={() => cambiarSemana('anterior')} 
            className="p-3 rounded-full bg-opacity-20 bg-white hover:bg-opacity-30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white transform hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <Calendar className="w-8 h-8 animate-pulse" />
            <h2 className="text-3xl font-bold tracking-wider">Semana de Entrenamiento</h2>
          </div>
          <button 
            onClick={() => cambiarSemana('siguiente')} 
            className="p-3 rounded-full bg-opacity-20 bg-white hover:bg-opacity-30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white transform hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex justify-between items-center space-x-3 mb-6">
          {Array.from({ length: 6 }, (_, i) => {
            const weekNumber = startIndex + i + 1;
            return (
              <button
                key={weekNumber}
                onClick={() => setSemanaActual(weekNumber)}
                className={`flex-1 py-4 px-2 rounded-xl transition-all duration-300 text-center text-sm md:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-white ${
                  semanaActual === weekNumber
                    ? `${theme === 'dark' ? 'bg-indigo-600' : 'bg-white'} text-${theme === 'dark' ? 'white' : 'indigo-600'} shadow-lg transform scale-105` 
                    : `${theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-400'} text-white hover:bg-opacity-80`
                }`}
              >
                <div>Semana {weekNumber}</div>
                <div className="text-xs mt-1">{getFechasRango(weekNumber)}</div>
              </button>
            );
          })}
        </div>
        
        <div className="flex justify-center items-center">
          <button 
            onClick={onAddWeek}
            className={`${
              theme === 'dark' ? 'bg-purple-600 hover:bg-purple-500' : 'bg-fuchsia-500 hover:bg-fuchsia-400'
            } text-white py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white transform hover:scale-105 flex items-center space-x-2`}
          >
            <Plus className="w-5 h-5" />
            <span>Añadir Semana</span>
          </button>
        </div>
      </div>
      
      <div className={`absolute bottom-0 left-0 w-full h-1 ${
        theme === 'dark' ? 'bg-indigo-400' : 'bg-white'
      }`}>
        <div 
          className={`h-full ${theme === 'dark' ? 'bg-purple-500' : 'bg-indigo-600'} transition-all duration-300 ease-in-out`}
          style={{ width: `${(semanaActual / semanas) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default EditPlanningPageCalendario;