import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Plus, Calendar } from 'lucide-react';
import Button from '../../Common/Button';

interface Exercise {
  _id: string;
  nombre: string;
  tipo: string;
  grupoMuscular: string[];
}

interface Set {
  reps: number;
  weight: number;
  rest: number;
  tempo: string;
  rpe: number;
  _id: string;
}

interface ExerciseWithSets {
  exercise: Exercise;
  sets: Set[];
  _id: string;
}

interface Session {
  name: string;
  tipo: string;
  rondas: number;
  exercises: ExerciseWithSets[];
  _id: string;
}

interface Day {
  dayNumber: number;
  sessions: Session[];
  _id: string;
}

interface Week {
  weekNumber: number;
  days: Day[];
  _id: string;
}

interface Template {
  _id: string;
  nombre: string;
  descripcion: string;
  trainer: {
    _id: string;
    nombre: string;
    email: string;
  };
  totalWeeks: number;
  plan: Week[];
  isActive: boolean;
  difficulty: string;
  category: string;
  assignedClients: string[];
}

interface PlantillaPageCalendarioProps {
  plantilla: Template | null;
  onWeekSelect: (weekNumber: number) => void;
}

const PlantillaPageCalendario: React.FC<PlantillaPageCalendarioProps> = ({ 
  plantilla,
  onWeekSelect
}) => {
  const { theme } = useTheme();
  const [totalWeeks, setTotalWeeks] = useState(plantilla?.totalWeeks || 4);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  const handleAddWeek = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !plantilla?._id) return;

      const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com/api/planningtemplate/templates/${plantilla._id}/week`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          weekNumber: totalWeeks + 1
        })
      });

      if (!response.ok) {
        throw new Error('Error al añadir semana');
      }

      setTotalWeeks(prev => prev + 1);
    } catch (error) {
      console.error('Error adding week:', error);
    }
  };

  const handleWeekClick = (weekNumber: number) => {
    setSelectedWeek(weekNumber);
    onWeekSelect(weekNumber);
  };

  const getSessionsForDay = (weekNumber: number, dayNumber: number): Session[] => {
    if (!plantilla?.plan) return [];
    
    const week = plantilla.plan.find(w => w.weekNumber === weekNumber);
    if (!week) return [];

    const day = week.days.find(d => d.dayNumber === dayNumber);
    return day?.sessions || [];
  };

  const renderSessionPreview = (sessions: Session[]) => {
    if (sessions.length === 0) {
      return (
        <div className="text-center text-gray-400 dark:text-gray-500">
          <Plus className="w-5 h-5 mx-auto mb-1" />
          <span className="text-sm">Añadir sesión</span>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {sessions.map((session) => (
          <div 
            key={session._id}
            className="text-sm p-1 rounded bg-blue-50 dark:bg-gray-700"
          >
            {session.name}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4 p-4">
        <div className="flex items-center">
          <Calendar className="w-6 h-6 mr-2" />
          <h2 className="text-xl font-semibold">Calendario de Entrenamiento</h2>
        </div>
        <Button
          onClick={handleAddWeek}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Semana</span>
        </Button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <th className="border p-3 text-left">Semana</th>
            {Array.from({ length: 7 }, (_, i) => (
              <th key={i} className="border p-3 text-center">
                Día {i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: totalWeeks }, (_, weekIndex) => (
            <tr key={weekIndex + 1}>
              <td 
                className={`border p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedWeek === weekIndex + 1 ? 'bg-blue-100 dark:bg-blue-900' : ''
                }`}
                onClick={() => handleWeekClick(weekIndex + 1)}
              >
                Semana {weekIndex + 1}
              </td>
              {Array.from({ length: 7 }, (_, dayIndex) => (
                <td
                  key={dayIndex}
                  className="border p-3"
                >
                  {renderSessionPreview(getSessionsForDay(weekIndex + 1, dayIndex + 1))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlantillaPageCalendario;
