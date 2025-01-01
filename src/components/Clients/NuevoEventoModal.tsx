import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Tag, AlignLeft, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Alert {
  type: 'email' | 'push' | 'sms' | 'popup';
  timeBeforeEvent: number;
}

interface NuevoEventoModalProps {
  onClose: () => void;
  onSave: (evento: any) => void;
  initialDate?: Date;
  initialEndDate?: Date;
  clientId?: string;
  trainerId?: string;
}

const TIPOS_EVENTO = [
  { id: 'TAREA_PROPIA', nombre: 'Tarea Propia' },
  { id: 'CITA_CON_CLIENTE', nombre: 'Cita con Cliente' },
  { id: 'RUTINA_CLIENTE', nombre: 'Rutina de Cliente' },
  { id: 'PAGO_CLIENTE', nombre: 'Pago de Cliente' },
  { id: 'ALARMA', nombre: 'Alarma' },
  { id: 'GENERAL', nombre: 'General' }
];

const TIPOS_ALERTA = [
  { id: 'email', nombre: 'Email' },
  { id: 'push', nombre: 'Notificación Push' },
  { id: 'sms', nombre: 'SMS' },
  { id: 'popup', nombre: 'Popup' }
];

const TIEMPOS_ALERTA = [
  { value: 15, label: '15 minutos antes' },
  { value: 30, label: '30 minutos antes' },
  { value: 60, label: '1 hora antes' },
  { value: 120, label: '2 horas antes' },
  { value: 1440, label: '1 día antes' }
];

export default function NuevoEventoModal({ 
  onClose, 
  onSave, 
  initialDate,
  initialEndDate,
  clientId,
  trainerId
}: NuevoEventoModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(format(initialDate || new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState(format(initialDate || new Date(), 'HH:mm'));
  const [endDate, setEndDate] = useState(format(initialEndDate || new Date(), 'yyyy-MM-dd'));
  const [endTime, setEndTime] = useState(format(initialEndDate || new Date(), 'HH:mm'));
  const [type, setType] = useState('GENERAL');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialDate) {
      setStartDate(format(initialDate, 'yyyy-MM-dd'));
      setStartTime(format(initialDate, 'HH:mm'));
    }
    if (initialEndDate) {
      setEndDate(format(initialEndDate, 'yyyy-MM-dd'));
      setEndTime(format(initialEndDate, 'HH:mm'));
    }
  }, [initialDate, initialEndDate]);

  const handleAddAlert = () => {
    setAlerts([...alerts, { type: 'popup', timeBeforeEvent: 30 }]);
  };

  const handleRemoveAlert = (index: number) => {
    setAlerts(alerts.filter((_, i) => i !== index));
  };

  const handleUpdateAlert = (index: number, field: keyof Alert, value: string | number) => {
    const newAlerts = [...alerts];
    newAlerts[index] = { ...newAlerts[index], [field]: value };
    setAlerts(newAlerts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${endDate}T${endTime}`);

      // Datos para la API
      const eventData = {
        title,
        description,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        type,
        origin: clientId ? 'CLIENTE' : 'PROPIO',
        isWorkRelated: true,
        trainer: trainerId,
        client: clientId,
        alerts
      };

      const response = await fetch('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el evento');
      }

      const data = await response.json();
      
      // Formatear el evento para el calendario
      const eventoFormateado = {
        id: data.data.event._id,
        title: data.data.event.title,
        start: startDateTime,
        end: endDateTime,
        descripcion: description || type,
        color: TIPOS_EVENTO.find(t => t.id === type)?.color || '#4F46E5',
        categoria: type,
        subcategoria: '',
        cliente: clientId || 'N/A',
        ubicacion: 'Ubicación por Defecto',
        recordatorios: alerts.map(alert => `${alert.timeBeforeEvent} minutos antes`),
        notas: description || 'Sin notas'
      };

      onSave(eventoFormateado);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear el evento');
      console.error('Error al crear evento:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold dark:text-white">Nuevo Evento</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Evento
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {TIPOS_EVENTO.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hora Inicio
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hora Fin
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={3}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Alertas
                </label>
                <button
                  type="button"
                  onClick={handleAddAlert}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center"
                >
                  <Bell className="w-4 h-4 mr-1" />
                  Añadir Alerta
                </button>
              </div>
              
              {alerts.map((alert, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <select
                    value={alert.type}
                    onChange={(e) => handleUpdateAlert(index, 'type', e.target.value as Alert['type'])}
                    className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {TIPOS_ALERTA.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                    ))}
                  </select>
                  <select
                    value={alert.timeBeforeEvent}
                    onChange={(e) => handleUpdateAlert(index, 'timeBeforeEvent', parseInt(e.target.value))}
                    className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {TIEMPOS_ALERTA.map(tiempo => (
                      <option key={tiempo.value} value={tiempo.value}>{tiempo.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveAlert(index)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}