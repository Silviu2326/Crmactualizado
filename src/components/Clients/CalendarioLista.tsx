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
  id: number;
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
    id: 'entrenamiento',
    nombre: 'Entrenamiento',
    color: '#4F46E5',
    subcategorias: [
      { id: 'personal', nombre: 'Personal' },
      { id: 'grupo', nombre: 'Grupo' }
    ]
  },
  {
    id: 'nutricion',
    nombre: 'Nutrición',
    color: '#059669',
    subcategorias: [
      { id: 'consulta', nombre: 'Consulta' },
      { id: 'seguimiento', nombre: 'Seguimiento' }
    ]
  }
];

const today = new Date();
const EVENTOS_EJEMPLO: Evento[] = [
  {
    id: 1,
    title: 'Entrenamiento Personal - Juan García',
    start: setMinutes(setHours(today, 10), 0),
    end: setMinutes(setHours(today, 11), 0),
    descripcion: 'Sesión de entrenamiento de fuerza y resistencia',
    color: '#4F46E5',
    categoria: 'entrenamiento',
    subcategoria: 'personal',
    cliente: 'Juan García',
    ubicacion: 'Sala de Pesas',
    recordatorios: ['30 minutos antes'],
    notas: 'Enfoque en ejercicios de pierna'
  },
  {
    id: 2,
    title: 'Clase Grupal - Yoga',
    start: setMinutes(setHours(addDays(today, 1), 17), 0),
    end: setMinutes(setHours(addDays(today, 1), 18), 0),
    descripcion: 'Clase de yoga para principiantes',
    color: '#4F46E5',
    subcategoria: 'grupo',
    categoria: 'entrenamiento',
    cliente: 'Grupo',
    ubicacion: 'Sala de Yoga',
    recordatorios: ['1 hora antes'],
    notas: 'Preparar música relajante'
  },
  {
    id: 3,
    title: 'Consulta Nutrición - María López',
    start: setMinutes(setHours(addDays(today, 2), 15), 30),
    end: setMinutes(setHours(addDays(today, 2), 16), 30),
    descripcion: 'Primera consulta nutricional y evaluación',
    color: '#059669',
    categoria: 'nutricion',
    subcategoria: 'consulta',
    cliente: 'María López',
    ubicacion: 'Consultorio 2',
    recordatorios: ['1 día antes', '1 hora antes'],
    notas: 'Primera consulta - realizar evaluación completa'
  },
  {
    id: 4,
    title: 'Seguimiento Nutrición - Carlos Ruiz',
    start: setMinutes(setHours(today, 14), 0),
    end: setMinutes(setHours(today, 15), 0),
    descripcion: 'Revisión de progreso y ajuste de plan alimenticio',
    color: '#059669',
    categoria: 'nutricion',
    subcategoria: 'seguimiento',
    cliente: 'Carlos Ruiz',
    ubicacion: 'Consultorio 1',
    recordatorios: ['2 horas antes'],
    notas: 'Revisar registro alimenticio de la semana'
  },
  {
    id: 5,
    title: 'Entrenamiento Personal - Ana Martínez',
    start: setMinutes(setHours(addDays(today, -1), 9), 0),
    end: setMinutes(setHours(addDays(today, -1), 10), 0),
    descripcion: 'Entrenamiento de alta intensidad',
    color: '#4F46E5',
    categoria: 'entrenamiento',
    subcategoria: 'personal',
    cliente: 'Ana Martínez',
    ubicacion: 'Área Funcional',
    recordatorios: ['1 hora antes'],
    notas: 'Preparar circuito HIIT'
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

  useEffect(() => {
    const headers = document.querySelectorAll('.rbc-header');
    const daysInSpanish = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    headers.forEach((header, index) => {
      header.textContent = daysInSpanish[index];
    });
  }, [view]);

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
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo);
    setShowNewEventModal(true);
  };

  const handleNewEvent = (evento: Evento) => {
    console.log('Nuevo evento:', evento);
    setSelectedSlot(null);
    setShowNewEventModal(false);
  };

  const handleToggleFiltro = (categoriaId: string, subcategoriaId?: string) => {
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
      '--event-color': event.color || '#4F46E5'
    } as React.CSSProperties
  });

  const dayPropGetter = (date: Date) => ({
    className: 'hover-lift',
    style: {
      backgroundColor: 'transparent'
    }
  });

  const eventosFiltrados = useMemo(() => {
    return EVENTOS_EJEMPLO.filter(evento => 
      filtrosActivos.categorias.includes(evento.categoria || '') &&
      filtrosActivos.subcategorias.includes(evento.subcategoria || '')
    );
  }, [filtrosActivos]);


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
}