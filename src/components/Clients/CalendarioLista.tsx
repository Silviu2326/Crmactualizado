import React, { useState, useMemo, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, SlotInfo, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addDays, setHours, setMinutes, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import CalendarioHeader from './CalendarioHeader';
import CalendarioSidebar from './CalendarioSidebar';
import EventoModal from './EventoModal';
import NuevoEventoModal from './NuevoEventoModal';
import HorarioEntrenadorModal from './HorarioEntrenadorModal';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { es }
});

interface Evento {
  id: string;
  title: string;
  start: Date;
  end: Date;
  descripcion: string;
  color?: string;
  categoria?: string;
  subcategoria?: string;
  cliente?: string;
  ubicacion?: string;
  recordatorios?: string[];
  notas?: string;
}

interface Categoria {
  id: string;
  nombre: string;
  color: string;
  subcategorias?: Array<{ id: string; nombre: string }>;
}

const CATEGORIAS: Categoria[] = [
  {
    id: 'Training',
    nombre: 'Entrenamiento',
    color: '#4F46E5',
    subcategorias: [
      { id: 'personal', nombre: 'Personal' },
      { id: 'grupo', nombre: 'Grupo' }
    ]
  },
  {
    id: 'Workshop',
    nombre: 'Taller',
    color: '#059669',
    subcategorias: [
      { id: 'consulta', nombre: 'Consulta' },
      { id: 'seguimiento', nombre: 'Seguimiento' }
    ]
  }
];

export default function CalendarioLista() {
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showEntrenadorModal, setShowEntrenadorModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [filtrosActivos, setFiltrosActivos] = useState({
    categorias: CATEGORIAS.map(cat => cat.id),
    subcategorias: CATEGORIAS.flatMap(cat => cat.subcategorias?.map(sub => sub.id) || [])
  });
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para mapear los datos de la API al formato del frontend
  const mapearEventos = (data: any[]): Evento[] => {
    console.log("Datos crudos de la API:", data);
    return data.map(evento => {
      const start = new Date(evento.date);
      const end = new Date(start);
      end.setHours(end.getHours() + 1); // Asignar una duración de 1 hora por defecto

      console.log(`Mapeando evento: ${evento.name}`);
      console.log(`Start: ${start}, End: ${end}`);

      return {
        id: evento._id,
        title: evento.name,
        start: start,
        end: end,
        descripcion: evento.type,
        color: CATEGORIAS.find(cat => cat.id === evento.type)?.color || '#4F46E5',
        categoria: evento.type,
        subcategoria: '', // Puedes asignar subcategoría si tienes más información
        cliente: evento.client ? evento.client.toString() : 'N/A',
        ubicacion: 'Ubicación por Defecto', // Asigna según tu lógica
        recordatorios: ['30 minutos antes'], // Valores por defecto o basados en tu lógica
        notas: 'Notas por defecto' // Valores por defecto o basados en tu lógica
      };
    });
  };

  useEffect(() => {
    const fetchEventos = async () => {
      const token = localStorage.getItem('token');
      console.log("Token obtenido de localStorage:", token);

      if (!token) {
        setError('No se encontró el token de autenticación.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com//api/events', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log("Respuesta de la API:", response);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Datos recibidos de la API:", data);

        const eventosMapeados = mapearEventos(data);
        console.log("Eventos mapeados:", eventosMapeados);

        setEventos(eventosMapeados);
      } catch (err: any) {
        console.error("Error al obtener eventos:", err);
        setError(err.message || 'Ocurrió un error al obtener los eventos.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  useEffect(() => {
    const headers = document.querySelectorAll('.rbc-header');
    const daysInSpanish = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    headers.forEach((header, index) => {
      header.textContent = daysInSpanish[index];
    });
  }, [view, eventos]);

  const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    const newDate = new Date(date);
    switch (action) {
      case 'PREV':
        newDate.setMonth(date.getMonth() - 1);
        break;
      case 'NEXT':
        newDate.setMonth(date.getMonth() + 1);
        break;
      case 'TODAY':
        newDate.setTime(new Date().getTime());
        break;
    }
    setDate(newDate);
    console.log(`Navegando a: ${newDate}`);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    console.log("Slot seleccionado:", slotInfo);
    setSelectedSlot(slotInfo);
    setShowNewEventModal(true);
  };

  const handleNewEvent = (evento: Evento) => {
    console.log('Nuevo evento creado:', evento);
    setSelectedSlot(null);
    setShowNewEventModal(false);
    // Opcional: actualizar el estado de eventos
    setEventos(prev => [...prev, evento]);
  };

  const handleToggleFiltro = (categoriaId: string, subcategoriaId?: string) => {
    console.log(`Togling filtro: Categoria - ${categoriaId}, Subcategoria - ${subcategoriaId}`);
    if (categoriaId === 'reset') {
      setFiltrosActivos({
        categorias: CATEGORIAS.map(cat => cat.id),
        subcategorias: CATEGORIAS.flatMap(cat => cat.subcategorias?.map(sub => sub.id) || [])
      });
      return;
    }

    setFiltrosActivos(prev => {
      if (subcategoriaId) {
        const subcategorias = prev.subcategorias.includes(subcategoriaId)
          ? prev.subcategorias.filter(id => id !== subcategoriaId)
          : [...prev.subcategorias, subcategoriaId];
        return { ...prev, subcategorias };
      } else {
        const categorias = prev.categorias.includes(categoriaId)
          ? prev.categorias.filter(id => id !== categoriaId)
          : [...prev.categorias, categoriaId];
        return { ...prev, categorias };
      }
    });
  };

  const eventStyleGetter = (event: Evento) => ({
    className: `event-card hover-lift ${isSameDay(event.start, new Date()) ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`,
    style: {
      backgroundColor: event.color || '#4F46E5',
      borderRadius: '4px',
      color: 'white',
      border: 'none',
      padding: '2px',
    } as React.CSSProperties
  });

  const dayPropGetter = (date: Date) => ({
    className: 'hover-lift',
    style: {
      backgroundColor: 'transparent'
    }
  });

  const eventosFiltrados = useMemo(() => {
    const filtrados = eventos.filter(evento => 
      filtrosActivos.categorias.includes(evento.categoria || '') &&
      (evento.subcategoria ? filtrosActivos.subcategorias.includes(evento.subcategoria) : true)
    ).map(evento => ({
      ...evento,
      start: new Date(evento.start),
      end: new Date(evento.end),
    }));
  
    console.log("Eventos filtrados:", filtrados);
    return filtrados;
  }, [filtrosActivos, eventos]);
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando eventos...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="h-screen flex flex-col calendar-background">
      <CalendarioHeader
        label={format(date, 'MMMM yyyy', { locale: es })}
        onNavigate={handleNavigate}
        onViewChange={setView}
        onNewEvent={() => setShowNewEventModal(true)}
        onShowEntrenador={() => setShowEntrenadorModal(true)}
        view={view}
      />
      <div className="flex-1 flex overflow-hidden">
        <CalendarioSidebar
          categorias={CATEGORIAS}
          filtrosActivos={filtrosActivos}
          onToggleFiltro={handleToggleFiltro}
        />
        <div className="flex-1 p-6 overflow-hidden">
          <div className="bg-white/80 rounded-2xl shadow-xl border border-gray-200/50 h-full backdrop-blur-sm hover-lift">
            <BigCalendar
              localizer={localizer}
              events={eventosFiltrados}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              eventPropGetter={eventStyleGetter}
              dayPropGetter={dayPropGetter}
              onSelectEvent={(event) => setSelectedEvent(event as Evento)}
              onSelectSlot={handleSelectSlot}
              selectable
              components={{
                toolbar: () => null, // Esto elimina la toolbar
              }}
              messages={{
                next: "Siguiente",
                previous: "Anterior",
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
                agenda: "Agenda",
                date: "Fecha",
                time: "Hora",
                event: "Evento",
                noEventsInRange: "No hay eventos en este rango",
                allDay: "Todo el día",
                work_week: "Semana laboral",
              }}
              popup
              className="calendar-custom"
            />
          </div>
        </div>
      </div>
      {selectedEvent && (
        <EventoModal
          evento={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
      {showNewEventModal && (
        <NuevoEventoModal
          onClose={() => {
            setShowNewEventModal(false);
            setSelectedSlot(null);
          }}
          onSave={handleNewEvent}
          categorias={CATEGORIAS}
          initialDate={selectedSlot?.start || new Date()}
          initialEndDate={selectedSlot?.end || new Date()}
        />
      )}
      {showEntrenadorModal && (
        <HorarioEntrenadorModal
          onClose={() => setShowEntrenadorModal(false)}
        />
      )}
    </div>
  );
};
