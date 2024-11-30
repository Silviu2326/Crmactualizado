import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Event {
  date: string; // Fecha completa en formato ISO (e.g., "2024-12-01T10:00:00Z")
  type: 'training' | 'checkin' | 'payment';
  name: string; // Nombre del evento
}

const Calendar: React.FC = () => {
  const { theme } = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentDate = new Date();
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const weekDays = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const eventColors = {
    training: 'bg-blue-500',
    checkin: 'bg-green-500',
    payment: 'bg-purple-500',
  };

  // Cargar eventos desde la API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('No estás autenticado');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com//api/events', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener los eventos');
        }

        const data = await response.json();
        setEvents(data); // Suponemos que `data` es un array de eventos
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Obtener el evento para un día específico
  const getEventType = (day: number) => {
    const eventForDay = events.find(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === currentDate.getFullYear() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getDate() === day
      );
    });
    return eventForDay;
  };

  return (
    <div className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} transition-all duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Calendario</h3>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading && <p className="text-center text-blue-500">Cargando eventos...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}
        {calendarDays.map((day) => {
          const event = getEventType(day);
          return (
            <motion.div
              key={day}
              whileHover={{ scale: 1.1 }}
              className={`aspect-square relative group ${
                day === currentDate.getDate()
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              } rounded-lg transition-colors duration-200 cursor-pointer`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm">{day}</span>
              </div>
              {event && (
                <div
                  className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${eventColors[event.type]}`}
                />
              )}
              {event && (
                <div
                  className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  } text-xs p-2 rounded shadow-lg whitespace-nowrap`}
                >
                  {event.name}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(eventColors).map(([type, color]) => (
          <div key={type} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            <span className="text-xs capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
