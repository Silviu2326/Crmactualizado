import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import CreateEventPopup from './CreateEventPopup';

interface CalendarProps {
  clientId: string;
}

interface Event {
  date: string;
  type: 'training' | 'checkin' | 'payment' | 'meeting';
  name: string;
}

const Calendar: React.FC<CalendarProps> = ({ clientId }) => {
  const { theme } = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const weekDays = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

  const eventColors = {
    training: 'bg-blue-500',
    checkin: 'bg-green-500',
    payment: 'bg-purple-500',
    meeting: 'bg-yellow-500'
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    
    // Solo permitir crear eventos en fechas futuras
    if (clickedDate >= new Date()) {
      console.log('Opening event popup with clientId:', clientId); // Debug log
      setSelectedDate(clickedDate);
      setShowEventPopup(true);
    }
  };

  const handleEventCreated = () => {
    // Recargar eventos después de crear uno nuevo
    fetchEvents();
  };

  const changeMonth = (increment: number) => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + increment);
      return newMonth;
    });
  };

  const fetchEvents = async () => {
    console.log('🚀 Iniciando fetchEvents para clientId:', clientId);
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      console.log('📝 Token obtenido:', token ? 'Token existe' : 'Token no encontrado');
      
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      console.log('🔄 Realizando petición a:', `https://fitoffice2-f70b52bef77e.herokuapp.com//api/events/client/${clientId}`);
      const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com//api/events/client/${clientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📥 Estado de la respuesta:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error('Error al cargar los eventos');
      }

      const data = await response.json();
      console.log('✅ Datos recibidos:', data);
      
      const eventsToSet = Array.isArray(data) ? data : data.events || [];
      console.log('📊 Eventos procesados:', eventsToSet);
      
      setEvents(eventsToSet);
    } catch (error) {
      console.error('❌ Error en fetchEvents:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar los eventos');
    } finally {
      console.log('🏁 Finalizando fetchEvents');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [clientId]);

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = firstDayOfMonth + daysInMonth;
    const rows = Math.ceil(totalDays / 7);

    for (let i = 0; i < rows * 7; i++) {
      const dayNumber = i - firstDayOfMonth + 1;
      const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNumber);
      const isFutureDate = date >= new Date();

      days.push(
        <div
          key={i}
          onClick={() => isValidDay && handleDayClick(dayNumber)}
          className={`relative h-14 border border-gray-200 dark:border-gray-700 ${
            isValidDay 
              ? isFutureDate
                ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700'
                : 'cursor-not-allowed bg-gray-100 dark:bg-gray-800'
              : 'bg-gray-50 dark:bg-gray-800'
          }`}
        >
          {isValidDay && (
            <>
              <span className={`absolute top-1 left-1 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {dayNumber}
              </span>
              {events
                .filter(event => new Date(event.date).getDate() === dayNumber)
                .map((event, index) => (
                  <div
                    key={index}
                    className={`absolute bottom-1 left-1 right-1 text-xs px-1 py-0.5 rounded ${
                      eventColors[event.type]
                    } text-white truncate`}
                  >
                    {event.name}
                  </div>
                ))}
            </>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className={`p-4 rounded-lg ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CalendarIcon className={`w-5 h-5 mr-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`} />
          <h3 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => changeMonth(-1)}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => changeMonth(1)}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px">
        {weekDays.map(day => (
          <div
            key={day}
            className={`text-center py-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>

      {showEventPopup && selectedDate && (
        <CreateEventPopup
          selectedDate={selectedDate}
          clientId={clientId}
          onClose={() => {
            console.log('Closing event popup'); // Debug log
            setShowEventPopup(false);
          }}
          onEventCreated={() => {
            console.log('Event created successfully'); // Debug log
            handleEventCreated();
          }}
        />
      )}
    </div>
  );
};

export default Calendar;
