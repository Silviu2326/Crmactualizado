import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Clock } from 'lucide-react';

interface CalendarioHeaderProps {
  label: string;
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
  onViewChange: (view: string) => void;
  onNewEvent: () => void;
  onShowEntrenador: () => void;
  view: string;
}

const views = [
  { label: 'Mes', value: 'month' },
  { label: 'Semana', value: 'week' },
  { label: 'Día', value: 'day' },
  { label: 'Agenda', value: 'agenda' }
];

export default function CalendarioHeader({ 
  label, 
  onNavigate, 
  onViewChange, 
  onNewEvent,
  onShowEntrenador,
  view 
}: CalendarioHeaderProps) {
  return (
    <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200/80 shadow-sm">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-xl">
            <Calendar className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Calendario</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('TODAY')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            Hoy
          </button>
          <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-1.5">
            <button
              onClick={() => onNavigate('PREV')}
              className="p-1.5 text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('NEXT')}
              className="p-1.5 text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <span className="text-lg font-semibold text-gray-900 min-w-[140px]">{label}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {views.map((viewOption) => (
            <button
              key={viewOption.value}
              onClick={() => onViewChange(viewOption.value)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                view === viewOption.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              {viewOption.label}
            </button>
          ))}
        </div>
        <button
          onClick={onShowEntrenador}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
        >
          <Clock className="w-4 h-4" />
          Horario Entrenador
        </button>
        <button 
          onClick={onNewEvent}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Evento
        </button>
      </div>
    </div>
  );
}