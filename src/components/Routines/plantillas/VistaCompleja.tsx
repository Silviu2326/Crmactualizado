import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SesionEntrenamiento } from './SesionEntrenamiento';
import { useTheme } from '../../../contexts/ThemeContext';
import { Search, Plus } from 'lucide-react';
import Button from '../ui/Button';
import { ExerciseSelector } from './ExerciseSelector';

interface Exercise {
  _id: string;
  name: string;
  description: string;
  category: string;
  sets: number;
  reps: number;
  weight: number;
}

interface Session {
  _id: string;
  name: string;
  tipo: 'Normal' | 'Superset';
  rondas?: number;
  exercises: Exercise[];
}

interface VistaComplejaProps {
  plantilla: any;
  semana: number;
  onUpdateSessions?: (sessions: Session[]) => void;
}

export const VistaCompleja: React.FC<VistaComplejaProps> = ({
  plantilla,
  semana,
  onUpdateSessions
}) => {
  const { theme } = useTheme();
  const [sesiones, setSesiones] = useState<Session[]>([]);
  const [filtro, setFiltro] = useState('');
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [sessionName, setSessionName] = useState('');
  const [sessionType, setSessionType] = useState<'Normal' | 'Superset'>('Normal');
  const [sessionRounds, setSessionRounds] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (plantilla?.planSemanal?.[semana]?.sesiones) {
      setSesiones(plantilla.planSemanal[semana].sesiones);
    } else {
      setSesiones([]);
    }
  }, [plantilla, semana]);

  const handleAddSession = () => {
    const newSession: Session = {
      _id: `session-${Date.now()}`,
      name: sessionName,
      tipo: sessionType,
      rondas: sessionRounds,
      exercises: []
    };

    const updatedSessions = [...sesiones, newSession];
    setSesiones(updatedSessions);
    onUpdateSessions?.(updatedSessions);

    setIsCreatingSession(false);
    setSessionName('');
    setSessionType('Normal');
    setSessionRounds(undefined);
  };

  const handleAddExercise = (sessionId: string) => {
    setShowExerciseSelector(true);
    setSelectedSessionId(sessionId);
  };

  const handleSelectExercise = (exercise: Exercise) => {
    if (!selectedSessionId) return;

    const sessionIndex = sesiones.findIndex((s) => s._id === selectedSessionId);
    if (sessionIndex === -1) return;

    const exerciseExists = sesiones[sessionIndex].exercises.some(
      (e) => e._id === exercise._id
    );
    if (exerciseExists) return;

    const updatedSessions = [...sesiones];
    updatedSessions[sessionIndex].exercises.push({
      ...exercise,
      sets: 3,
      reps: 12,
      weight: 0
    });

    setSesiones(updatedSessions);
    onUpdateSessions?.(updatedSessions);
    setShowExerciseSelector(false);
  };

  const handleDeleteSession = (sessionId: string) => {
    const updatedSessions = sesiones.filter((s) => s._id !== sessionId);
    setSesiones(updatedSessions);
    onUpdateSessions?.(updatedSessions);
    setIsDeleteModalOpen(false);
    setSessionToDelete(null);
  };

  const filteredSessions = sesiones.filter(session =>
    !filtro ? true :
    session.name.toLowerCase().includes(filtro.toLowerCase()) ||
    session.exercises.some(exercise =>
      exercise.name.toLowerCase().includes(filtro.toLowerCase())
    )
  );

  return (
    <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Filtrar..."
            className={`pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all
              ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
          />
        </div>
        <Button
          variant="create"
          onClick={() => {
            setIsCreatingSession(true);
            setSessionName('');
            setSessionType('Normal');
            setSessionRounds(undefined);
          }}
          className="flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Añadir Sesión</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSessions.map((sesion, index) => (
          <motion.div
            key={sesion._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <SesionEntrenamiento
              sesion={sesion}
              onDeleteSession={() => {
                setSessionToDelete(sesion._id);
                setIsDeleteModalOpen(true);
              }}
              onAddExercise={() => handleAddExercise(sesion._id)}
              onUpdateSession={(updatedSession) => {
                const updatedSessions = sesiones.map(s => 
                  s._id === updatedSession._id ? updatedSession : s
                );
                setSesiones(updatedSessions);
                onUpdateSessions?.(updatedSessions);
              }}
            />
          </motion.div>
        ))}
      </div>

      {isCreatingSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-lg max-w-md w-full`}>
            <h3 className="text-lg font-semibold mb-4">Crear Nueva Sesión</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Nombre de la Sesión</label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                placeholder="Nombre de la sesión"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tipo de Sesión</label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value as 'Normal' | 'Superset')}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="Normal">Normal</option>
                <option value="Superset">Superset</option>
              </select>
            </div>

            {sessionType === 'Superset' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Número de Rondas</label>
                <input
                  type="number"
                  value={sessionRounds || ''}
                  onChange={(e) => setSessionRounds(parseInt(e.target.value) || undefined)}
                  className={`w-full p-2 rounded border ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  placeholder="Número de rondas"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsCreatingSession(false)}
                className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddSession}
                disabled={!sessionName.trim() || (sessionType === 'Superset' && !sessionRounds)}
                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {showExerciseSelector && (
        <ExerciseSelector
          isOpen={showExerciseSelector}
          onClose={() => setShowExerciseSelector(false)}
          onSelectExercise={handleSelectExercise}
        />
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-lg`}>
            <h3 className="text-lg font-semibold mb-4">¿Eliminar sesión?</h3>
            <p className="mb-4">¿Estás seguro de que deseas eliminar esta sesión?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Cancelar
              </button>
              <button
                onClick={() => sessionToDelete && handleDeleteSession(sessionToDelete)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VistaCompleja;
