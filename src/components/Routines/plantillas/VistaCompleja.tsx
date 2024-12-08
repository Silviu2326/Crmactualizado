import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Plus, Calendar, Search, Trash2 } from 'lucide-react';
import Button from '../../Common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import ExerciseSelector from './ExerciseSelector';
import SesionEntrenamiento from './SesionEntrenamiento';

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
  _id: string;
  name: string;
  tipo: 'Normal' | 'Superset';
  rondas: number;
  exercises: ExerciseWithSets[];
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
  plan: Array<{
    weekNumber: number;
    days: Array<{
      dayNumber: number;
      sessions: Session[];
      _id: string;
    }>;
    _id: string;
  }>;
  isActive: boolean;
  difficulty: string;
  category: string;
  assignedClients: string[];
}

interface VistaComplejaProps {
  plantilla: Template | null;
  semana: number;
  dia: number;
}

export const VistaCompleja: React.FC<VistaComplejaProps> = ({
  plantilla,
  semana,
  dia
}) => {
  const { theme } = useTheme();
  const [diaSeleccionado, setDiaSeleccionado] = useState(dia);
  const [filtro, setFiltro] = useState('');
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showSessionPopup, setShowSessionPopup] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [sessionType, setSessionType] = useState<'Normal' | 'Superset'>('Normal');
  const [sessionRounds, setSessionRounds] = useState<number>(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [showSesionEntrenamiento, setShowSesionEntrenamiento] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Estado local para los datos del ejercicio
  const [exerciseData, setExerciseData] = useState<{
    templateId: string;
    weekNumber: number;
    dayNumber: number;
    sessionId: string | null;
  }>({
    templateId: plantilla?._id || '',
    weekNumber: semana,
    dayNumber: diaSeleccionado,
    sessionId: null
  });

  // Actualizar datos cuando cambien las props o el día seleccionado
  useEffect(() => {
    if (plantilla?._id && semana && diaSeleccionado) {
      setExerciseData({
        templateId: plantilla._id,
        weekNumber: semana,
        dayNumber: diaSeleccionado,
        sessionId: selectedSessionId
      });
    }
  }, [plantilla?._id, semana, diaSeleccionado, selectedSessionId]);
  
  // Log de datos recibidos
  useEffect(() => {
    console.log('VistaCompleja - Datos actualizados:', {
      plantilla: {
        _id: plantilla?._id,
        nombre: plantilla?.nombre,
      },
      semana,
      dia,
      diaSeleccionado,
      exerciseData
    });
  }, [plantilla, semana, dia, diaSeleccionado, exerciseData]);

  // Usamos números en lugar de nombres de días
  const dias = Array.from({ length: 7 }, (_, i) => i + 1);

  const getSessions = (dia: number): Session[] => {
    if (!plantilla?.plan) {
      console.log('VistaCompleja - No hay plan disponible');
      return [];
    }
    
    const weekPlan = plantilla.plan.find(w => w.weekNumber === semana);
    if (!weekPlan) {
      console.log('VistaCompleja - No se encontró la semana:', semana);
      return [];
    }
    
    const dayPlan = weekPlan.days.find(d => d.dayNumber === dia);
    if (!dayPlan) {
      console.log('VistaCompleja - No se encontró el día:', dia);
      return [];
    }
    
    console.log('VistaCompleja - Sesiones encontradas para día ' + dia + ':', dayPlan.sessions);
    return dayPlan.sessions;
  };

  const handleAddSession = () => {
    console.log('VistaCompleja - Agregar sesión');
    setShowSessionPopup(true);
  };

  const handleCreateSession = () => {
    console.log('VistaCompleja - Crear sesión:', {
      sessionName,
      sessionType,
      sessionRounds
    });
    // Por ahora solo cerramos el popup
    setShowSessionPopup(false);
    setSessionName('');
    setSessionType('Normal');
    setSessionRounds(1);
  };

  const handleAddExercise = (sessionId: string) => {
    console.log('VistaCompleja - Iniciando handleAddExercise:', {
      templateId: plantilla?._id,
      semana,
      diaSeleccionado,
      sessionId
    });

    if (!plantilla?._id || !semana || !diaSeleccionado || !sessionId) {
      console.error('VistaCompleja - Faltan datos requeridos:', {
        templateId: plantilla?._id,
        semana,
        diaSeleccionado,
        sessionId
      });
      return;
    }

    setSelectedSessionId(sessionId);
    setExerciseData({
      templateId: plantilla._id,
      weekNumber: semana,
      dayNumber: diaSeleccionado,
      sessionId: sessionId
    });
    setShowExerciseSelector(true);
  };

  const handleSelectExercise = (exerciseWithSets: ExerciseWithSets) => {
    console.log('VistaCompleja - Ejercicio seleccionado:', {
      exercise: exerciseWithSets,
      sessionId: selectedSessionId,
      templateId: plantilla?._id,
      weekNumber: semana,
      dayNumber: diaSeleccionado
    });
  };

  const filteredSessions = (dia: number) => {
    const sessions = getSessions(dia);
    if (!filtro) return sessions;
    return sessions.filter(session =>
      session.name.toLowerCase().includes(filtro.toLowerCase()) ||
      session.exercises.some(ex => ex.exercise.nombre.toLowerCase().includes(filtro.toLowerCase()))
    );
  };

  const handleDeleteSession = (sessionId: string) => {
    console.log('VistaCompleja - Eliminar sesión:', sessionId);
    setIsDeleteModalOpen(false);
    setSessionToDelete(null);
  };

  const openDeleteModal = (sessionId: string) => {
    console.log('VistaCompleja - Abrir modal de eliminación:', sessionId);
    setSessionToDelete(sessionId);
    setIsDeleteModalOpen(true);
  };

  const handleShowSesionEntrenamiento = (session: Session) => {
    console.log('VistaCompleja - Mostrar SesionEntrenamiento:', session);
    setShowSesionEntrenamiento(true);
    setSelectedSession(session);
  };

  return (
    <>
      {showExerciseSelector && selectedSessionId && exerciseData.templateId && (
        <ExerciseSelector
          isOpen={showExerciseSelector}
          onClose={() => {
            console.log('VistaCompleja - Cerrando ExerciseSelector');
            setShowExerciseSelector(false);
            setSelectedSessionId(null);
          }}
          onSelectExercise={handleSelectExercise}
          templateId={exerciseData.templateId}
          weekNumber={exerciseData.weekNumber}
          dayNumber={exerciseData.dayNumber}
          sessionId={selectedSessionId}
        />
      )}

      {showSesionEntrenamiento && selectedSession && (
        <SesionEntrenamiento
          session={selectedSession}
          onClose={() => {
            setShowSesionEntrenamiento(false);
            setSelectedSession(null);
          }}
          planningId={plantilla._id}
          weekNumber={semana}
          selectedDay={diaSeleccionado}
          templateId={exerciseData.templateId}
          dayNumber={exerciseData.dayNumber}
          sessionId={selectedSessionId || ''}
        />
      )}

      <div className="space-y-6">
        {/* Grid de días de la semana */}
        <div className="grid grid-cols-7 gap-2">
          {dias.map((diaNum) => (
            <motion.div
              key={diaNum}
              onClick={() => {
                console.log('VistaCompleja - Seleccionar día:', diaNum);
                setDiaSeleccionado(diaNum);
              }}
              className={`p-4 rounded-lg cursor-pointer transition-colors duration-200 ${
                diaSeleccionado === diaNum
                  ? theme === 'dark'
                    ? 'bg-blue-600'
                    : 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="text-lg font-semibold text-center">Día {diaNum}</h3>
            </motion.div>
          ))}
        </div>

        {/* Contenido del día seleccionado */}
        <AnimatePresence mode="wait">
          <motion.div
            key={diaSeleccionado}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold">Día {diaSeleccionado}</h2>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={filtro}
                    onChange={(e) => {
                      console.log('VistaCompleja - Filtro:', e.target.value);
                      setFiltro(e.target.value);
                    }}
                    placeholder="Filtrar..."
                    className={`pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all
                      ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <Button
                  onClick={handleAddSession}
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span>Añadir Sesión</span>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredSessions(diaSeleccionado).map((session) => (
                <SesionEntrenamiento
                  key={session._id}
                  session={session}
                  onDeleteSession={() => openDeleteModal(session._id)}
                  onAddExercise={() => handleAddExercise(session._id)}
                  onShowSesionEntrenamiento={() => handleShowSesionEntrenamiento(session)}
                  templateId={exerciseData.templateId}
                  weekNumber={exerciseData.weekNumber}
                  dayNumber={exerciseData.dayNumber}
                  

                />
              ))}

              {filteredSessions(diaSeleccionado).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay sesiones programadas para este día
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Popup para crear nueva sesión */}
      {showSessionPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-lg max-w-md w-full`}>
            <h3 className="text-lg font-semibold mb-4">Crear Nueva Sesión</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Nombre de la sesión</label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => {
                  console.log('VistaCompleja - Nombre de sesión:', e.target.value);
                  setSessionName(e.target.value);
                }}
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500`}
                placeholder="Nombre de la sesión"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tipo de sesión</label>
              <select
                value={sessionType}
                onChange={(e) => {
                  console.log('VistaCompleja - Tipo de sesión:', e.target.value);
                  setSessionType(e.target.value as 'Normal' | 'Superset');
                }}
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500`}
              >
                <option value="Normal">Normal</option>
                <option value="Superset">Superset</option>
              </select>
            </div>

            {sessionType === 'Superset' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Número de rondas</label>
                <input
                  type="number"
                  value={sessionRounds}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1) {
                      console.log('VistaCompleja - Número de rondas:', value);
                      setSessionRounds(value);
                    }
                  }}
                  min="1"
                  className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  console.log('VistaCompleja - Cancelar creación de sesión');
                  setShowSessionPopup(false);
                }}
                className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateSession}
                disabled={!sessionName.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-lg`}>
            <h3 className="text-lg font-semibold mb-4">¿Estás seguro de que deseas eliminar esta sesión?</h3>
            <p className="mb-4">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  console.log('VistaCompleja - Cancelar eliminación de sesión');
                  setIsDeleteModalOpen(false);
                }}
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
    </>
  );
};

export default VistaCompleja;
