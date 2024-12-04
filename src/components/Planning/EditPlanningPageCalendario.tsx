import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import axios from 'axios';

const API_URL = 'https://fitoffice2-f70b52bef77e.herokuapp.com//api';

interface EditPlanningPageCalendarioProps {
  weeks: WeekPlan[];
  semanaActual: number;
  setSemanaActual: (semana: number) => void;
  onAddWeek: () => void;
  planningId: string;
}

interface WeekPlan {
  _id: string;
  weekNumber: number;
  startDate: string;
  days: { [key: string]: DayPlan };
}

interface DayPlan {
  _id: string;
  day: string;
  fecha: string;
  sessions: Session[];
}

interface Session {
  id: string;
  name: string;
  exercises: Exercise[];
}

interface Exercise {
  id: string;
  name: string;
  sets: Array<{
    id: string;
    reps: number;
    weight?: number;
    rest?: number;
  }>;
}

const EditPlanningPageCalendario: React.FC<EditPlanningPageCalendarioProps> = ({
  weeks = [],
  semanaActual,
  setSemanaActual,
  onAddWeek,
  planningId,
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);

  const cambiarSemana = (direccion: 'anterior' | 'siguiente') => {
    if (!weeks) return;

    const currentIndex = weeks.findIndex((week) => week.weekNumber === semanaActual);
    if (direccion === 'anterior') {
      if (currentIndex > 0) {
        setSemanaActual(weeks[currentIndex - 1].weekNumber);
      }
    } else {
      if (currentIndex < weeks.length - 1) {
        setSemanaActual(weeks[currentIndex + 1].weekNumber);
      }
    }
  };

  const getFechasRango = (startDate: string) => {
    const fechaInicio = new Date(startDate);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + 6);

    return `${fechaInicio.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })} - ${fechaFin.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })}`;
  };

  const addWeekToPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(
        `${API_URL}/plannings/${planningId}/anadirsemanasiguiente`,
        {},
        config,
      );

      return response.data;
    } catch (error) {
      console.error('Error adding week to plan:', error);
      throw error;
    }
  };

  const handleAddWeek = async () => {
    await addWeekToPlan();
    onAddWeek();
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
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8 text-white">
          <button
            onClick={() => cambiarSemana('anterior')}
            className="p-3 rounded-full bg-opacity-20 bg-white hover:bg-opacity-30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white transform hover:scale-110 disabled:opacity-50 disabled:pointer-events-none"
            disabled={semanaActual === 1}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <Calendar className="w-8 h-8 animate-pulse" />
            <h2 className="text-3xl font-bold tracking-wider">
              Semana {semanaActual} de {weeks.length}
            </h2>
          </div>
          <button
            onClick={() => cambiarSemana('siguiente')}
            className="p-3 rounded-full bg-opacity-20 bg-white hover:bg-opacity-30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white transform hover:scale-110 disabled:opacity-50 disabled:pointer-events-none"
            disabled={semanaActual === weeks.length}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-between items-center space-x-3 mb-6">
          {weeks.map((week) => (
            <button
              key={week._id}
              onClick={() => setSemanaActual(week.weekNumber)}
              className={`flex-1 py-4 px-2 rounded-xl transition-all duration-300 text-center text-sm md:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-white ${
                semanaActual === week.weekNumber
                  ? `${
                      theme === 'dark' ? 'bg-indigo-600' : 'bg-white'
                    } text-${
                      theme === 'dark' ? 'white' : 'indigo-600'
                    } shadow-lg transform scale-105`
                  : `${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-400'
                    } text-white hover:bg-opacity-80`
              }`}
            >
              <div>Semana {week.weekNumber}</div>
              <div className="text-xs mt-1">{getFechasRango(week.startDate)}</div>
            </button>
          ))}
          <button
            onClick={handleAddWeek}
            className={`flex-1 py-4 px-2 rounded-xl transition-all duration-300 text-center text-sm md:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-white ${
              theme === 'dark' ? 'bg-purple-600 hover:bg-purple-500' : 'bg-fuchsia-500 hover:bg-fuchsia-400'
            } text-white`}
          >
            <div>Semana {weeks.length + 1}</div>
            <div className="flex items-center justify-center mt-1">
              <Plus className="w-4 h-4 mr-1" />
              <span className="text-xs">Añadir</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlanningPageCalendario;