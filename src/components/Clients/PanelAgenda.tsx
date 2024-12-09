import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Filter,
} from 'lucide-react';
import Button from '../Common/Button';
import Calendar from 'react-calendar';
import './PanelAgenda.css';

interface PanelAgendaProps {
  clienteId: string;
}

interface Cita {
  id: string;
  fecha: Date;
  hora: string;
  tipo: 'entrenamiento' | 'consulta' | 'evaluacion';
  estado: 'programada' | 'completada' | 'cancelada';
  notas?: string;
}

const PanelAgenda: React.FC<PanelAgendaProps> = ({ clienteId }) => {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showNewAppointmentForm, setShowNewAppointmentForm] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  // Datos de ejemplo
  const [citas, setCitas] = useState<Cita[]>([
    {
      id: '1',
      fecha: new Date(),
      hora: '09:00',
      tipo: 'entrenamiento',
      estado: 'programada',
      notas: 'Primera sesión de entrenamiento'
    },
    {
      id: '2',
      fecha: new Date(new Date().setDate(new Date().getDate() + 1)),
      hora: '10:30',
      tipo: 'consulta',
      estado: 'programada'
    }
  ]);

  const [nuevaCita, setNuevaCita] = useState<Partial<Cita>>({
    fecha: new Date(),
    hora: '',
    tipo: 'entrenamiento',
    estado: 'programada'
  });

  const filtrarCitas = () => {
    return citas.filter(cita => {
      const cumpleFiltroTipo = filtroTipo === 'todos' || cita.tipo === filtroTipo;
      const cumpleFiltroEstado = filtroEstado === 'todos' || cita.estado === filtroEstado;
      return cumpleFiltroTipo && cumpleFiltroEstado;
    });
  };

  const handleNewAppointment = () => {
    setShowNewAppointmentForm(true);
  };

  const handleSaveAppointment = () => {
    if (nuevaCita.hora && nuevaCita.tipo) {
      const citaCompleta: Cita = {
        id: Date.now().toString(),
        fecha: nuevaCita.fecha || new Date(),
        hora: nuevaCita.hora,
        tipo: nuevaCita.tipo as 'entrenamiento' | 'consulta' | 'evaluacion',
        estado: 'programada',
        notas: nuevaCita.notas
      };
      setCitas([...citas, citaCompleta]);
      setShowNewAppointmentForm(false);
      setNuevaCita({
        fecha: new Date(),
        hora: '',
        tipo: 'entrenamiento',
        estado: 'programada'
      });
    }
  };

  const handleDeleteAppointment = (id: string) => {
    setCitas(citas.filter(cita => cita.id !== id));
  };

  const handleUpdateStatus = (id: string, nuevoEstado: 'programada' | 'completada' | 'cancelada') => {
    setCitas(citas.map(cita => 
      cita.id === id ? { ...cita, estado: nuevoEstado } : cita
    ));
  };

  return (
    <div className={`flex flex-col gap-6 p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Encabezado y Botón de Nueva Cita */}
      <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg flex justify-between items-center`}>
        <h2 className="text-2xl font-bold">Agenda</h2>
        <Button
          variant="primary"
          onClick={handleNewAppointment}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Cita</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendario */}
        <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className={`${theme === 'dark' ? 'dark-calendar' : ''} w-full`}
          />
        </div>

        {/* Lista de Citas */}
        <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Citas</h3>
            <div className="flex gap-2">
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className={`rounded px-2 py-1 text-sm ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <option value="todos">Todos los tipos</option>
                <option value="entrenamiento">Entrenamiento</option>
                <option value="consulta">Consulta</option>
                <option value="evaluacion">Evaluación</option>
              </select>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className={`rounded px-2 py-1 text-sm ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <option value="todos">Todos los estados</option>
                <option value="programada">Programada</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            {filtrarCitas().map(cita => (
              <motion.div
                key={cita.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{cita.fecha.toLocaleDateString()}</span>
                      <Clock className="w-4 h-4 ml-2" />
                      <span>{cita.hora}</span>
                    </div>
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        cita.tipo === 'entrenamiento' ? 'bg-blue-500' :
                        cita.tipo === 'consulta' ? 'bg-green-500' :
                        'bg-purple-500'
                      } text-white`}>
                        {cita.tipo}
                      </span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                        cita.estado === 'programada' ? 'bg-yellow-500' :
                        cita.estado === 'completada' ? 'bg-green-500' :
                        'bg-red-500'
                      } text-white`}>
                        {cita.estado}
                      </span>
                    </div>
                    {cita.notas && (
                      <p className="mt-2 text-sm opacity-70">{cita.notas}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {cita.estado === 'programada' && (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => handleUpdateStatus(cita.id, 'completada')}
                          className="p-1"
                        >
                          <Check className="w-4 h-4 text-green-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleUpdateStatus(cita.id, 'cancelada')}
                          className="p-1"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => handleDeleteAppointment(cita.id)}
                      className="p-1"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Nueva Cita */}
      {showNewAppointmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-full max-w-md`}
          >
            <h3 className="text-xl font-bold mb-4">Nueva Cita</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Fecha</label>
                <input
                  type="date"
                  value={nuevaCita.fecha?.toISOString().split('T')[0]}
                  onChange={(e) => setNuevaCita({
                    ...nuevaCita,
                    fecha: new Date(e.target.value)
                  })}
                  className={`w-full p-2 rounded ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hora</label>
                <input
                  type="time"
                  value={nuevaCita.hora}
                  onChange={(e) => setNuevaCita({
                    ...nuevaCita,
                    hora: e.target.value
                  })}
                  className={`w-full p-2 rounded ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
                  value={nuevaCita.tipo}
                  onChange={(e) => setNuevaCita({
                    ...nuevaCita,
                    tipo: e.target.value as 'entrenamiento' | 'consulta' | 'evaluacion'
                  })}
                  className={`w-full p-2 rounded ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  <option value="entrenamiento">Entrenamiento</option>
                  <option value="consulta">Consulta</option>
                  <option value="evaluacion">Evaluación</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notas</label>
                <textarea
                  value={nuevaCita.notas}
                  onChange={(e) => setNuevaCita({
                    ...nuevaCita,
                    notas: e.target.value
                  })}
                  className={`w-full p-2 rounded ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowNewAppointmentForm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveAppointment}
                >
                  Guardar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PanelAgenda;
