// CuestionariosLista.tsx
import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../Common/Button';
import CrearCuestionario from './CrearCuestionario';
import VistaCuestionario from './VistaCuestionario';

// Definición de interfaces para Tipos de Datos
interface Pregunta {
  _id: string;
  texto: string;
  categoria: string;
}

interface CuestionarioAPI {
  _id: string;
  titulo: string;
  descripcion: string;
  frecuencia: string;
  preguntas: Pregunta[];
  estado: string;
  responses: number;
  completion: string;
  fechaCreacion: string;
  lastUpdate: string;
  // Otros campos que puedan venir de la API
}

interface Cuestionario {
  id: string;
  titulo: string;
  descripcion: string;
  frecuencia: string;
  preguntas: {
    id: string;
    texto: string;
    categoria: string;
  }[];
  status: string;
  responses: number;
  completion: string;
  fechaCreacion: string;
  lastUpdate: string;
}

const CuestionariosLista: React.FC = () => {
  const { theme } = useTheme();
  const [showCrearCuestionario, setShowCrearCuestionario] = useState(false);
  const [selectedCuestionario, setSelectedCuestionario] = useState<Cuestionario | null>(null);
  const [questionnaires, setQuestionnaires] = useState<Cuestionario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener el token del caché (localStorage en este caso)
  const getAuthToken = (): string | null => {
    const token = localStorage.getItem('token'); // Asegúrate de que 'authToken' es la clave correcta
    console.log('[getAuthToken] Obteniendo token de localStorage:', token);
    return token;
  };

  // Función para transformar los datos de la API al formato usado en el frontend
  const transformCuestionario = (apiData: CuestionarioAPI): Cuestionario => {
    return {
      id: apiData._id,
      titulo: apiData.titulo,
      descripcion: apiData.descripcion,
      frecuencia: apiData.frecuencia,
      preguntas: apiData.preguntas.map(p => ({
        id: p._id,
        texto: p.texto,
        categoria: p.categoria,
      })),
      status: apiData.estado.charAt(0).toUpperCase() + apiData.estado.slice(1), // Capitalizar
      responses: apiData.responses,
      completion: apiData.completion,
      fechaCreacion: new Date(apiData.fechaCreacion).toLocaleDateString(),
      lastUpdate: new Date(apiData.lastUpdate).toLocaleDateString(),
    };
  };

  // Obtener los cuestionarios desde la API
  const fetchCuestionarios = async () => {
    console.log('[fetchCuestionarios] Iniciando fetchCuestionarios...');
    setLoading(true);
    setError(null);
    const token = getAuthToken();

    if (!token) {
      console.error('[fetchCuestionarios] No se encontró el token de autenticación.');
      setError('No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.');
      setLoading(false);
      // Opcional: Redirigir al usuario a la página de inicio de sesión
      // window.location.href = '/login';
      return;
    }

    console.log('[fetchCuestionarios] Token encontrado:', token);

    try {
      const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com//api/cuestionarios/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('[fetchCuestionarios] Respuesta de la API:', response);

      if (response.status === 401) {
        console.error('[fetchCuestionarios] Autenticación fallida.');
        throw new Error('Autenticación fallida. Por favor, inicia sesión nuevamente.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[fetchCuestionarios] Error en la respuesta de la API:', errorData);
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data: CuestionarioAPI[] = await response.json();
      console.log('[fetchCuestionarios] Datos obtenidos de la API:', data);

      const transformedData = data.map(transformCuestionario);
      console.log('[fetchCuestionarios] Datos transformados:', transformedData);

      setQuestionnaires(transformedData);
      console.log('[fetchCuestionarios] Estado actualizado con los cuestionarios.');
      setError(null);
    } catch (err: any) {
      console.error('[fetchCuestionarios] Error al cargar los cuestionarios:', err);
      setError(err.message || 'Error al cargar los cuestionarios.');
    } finally {
      setLoading(false);
      console.log('[fetchCuestionarios] Finalizado fetchCuestionarios.');
    }
  };

  // Función para guardar un nuevo cuestionario
  const handleSaveCuestionario = async (
    cuestionario: Omit<
      CuestionarioAPI,
      '_id' | 'responses' | 'completion' | 'fechaCreacion' | 'lastUpdate'
    >
  ) => {
    console.log('[handleSaveCuestionario] Intentando guardar un nuevo cuestionario:', cuestionario);
    const token = getAuthToken();

    if (!token) {
      console.error('[handleSaveCuestionario] No se encontró el token de autenticación.');
      alert('No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.');
      // Opcional: Redirigir al usuario a la página de inicio de sesión
      // window.location.href = '/login';
      return;
    }

    console.log('[handleSaveCuestionario] Token encontrado:', token);

    try {
      const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com//api/cuestionarios/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(cuestionario),
      });

      console.log('[handleSaveCuestionario] Respuesta de la API (POST):', response);

      if (response.status === 401) {
        console.error('[handleSaveCuestionario] Autenticación fallida al guardar el cuestionario.');
        throw new Error('Autenticación fallida. Por favor, inicia sesión nuevamente.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[handleSaveCuestionario] Error al guardar el cuestionario:', errorData);
        throw new Error(`Error al guardar el cuestionario: ${response.status} ${response.statusText}`);
      }

      const newCuestionario: CuestionarioAPI = await response.json();
      console.log('[handleSaveCuestionario] Cuestionario guardado exitosamente:', newCuestionario);

      const transformedCuestionario = transformCuestionario(newCuestionario);
      console.log('[handleSaveCuestionario] Cuestionario transformado:', transformedCuestionario);

      setQuestionnaires(prev => [...prev, transformedCuestionario]);
      console.log('[handleSaveCuestionario] Estado actualizado con el nuevo cuestionario.');
      setShowCrearCuestionario(false);
    } catch (err: any) {
      console.error('[handleSaveCuestionario] Error al guardar el cuestionario:', err);
      alert(err.message || 'Error al guardar el cuestionario.');
    }
  };

  // Función para eliminar un cuestionario
  const handleDeleteCuestionario = async () => {
    if (!selectedCuestionario) {
      console.warn('[handleDeleteCuestionario] No hay cuestionario seleccionado para eliminar.');
      return;
    }

    console.log('[handleDeleteCuestionario] Intentando eliminar el cuestionario con ID:', selectedCuestionario.id);
    const token = getAuthToken();

    if (!token) {
      console.error('[handleDeleteCuestionario] No se encontró el token de autenticación.');
      alert('No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.');
      // Opcional: Redirigir al usuario a la página de inicio de sesión
      // window.location.href = '/login';
      return;
    }

    console.log('[handleDeleteCuestionario] Token encontrado:', token);

    try {
      const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com//api/cuestionarios/${selectedCuestionario.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('[handleDeleteCuestionario] Respuesta de la API (DELETE):', response);

      if (response.status === 401) {
        console.error('[handleDeleteCuestionario] Autenticación fallida al eliminar el cuestionario.');
        throw new Error('Autenticación fallida. Por favor, inicia sesión nuevamente.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[handleDeleteCuestionario] Error al eliminar el cuestionario:', errorData);
        throw new Error(`Error al eliminar el cuestionario: ${response.status} ${response.statusText}`);
      }

      console.log('[handleDeleteCuestionario] Cuestionario eliminado exitosamente:', selectedCuestionario.id);
      setQuestionnaires(prev => prev.filter(q => q.id !== selectedCuestionario.id));
      setSelectedCuestionario(null);
    } catch (err: any) {
      console.error('[handleDeleteCuestionario] Error al eliminar el cuestionario:', err);
      alert(err.message || 'Error al eliminar el cuestionario.');
    }
  };

  // Función para actualizar un cuestionario existente
  const handleUpdateCuestionario = async (updatedCuestionario: CuestionarioAPI) => {
    console.log('[handleUpdateCuestionario] Intentando actualizar el cuestionario:', updatedCuestionario);
    const token = getAuthToken();

    if (!token) {
      console.error('[handleUpdateCuestionario] No se encontró el token de autenticación.');
      alert('No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.');
      // Opcional: Redirigir al usuario a la página de inicio de sesión
      // window.location.href = '/login';
      return;
    }

    console.log('[handleUpdateCuestionario] Token encontrado:', token);

    try {
      const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com//api/cuestionarios/${updatedCuestionario._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCuestionario),
      });

      console.log('[handleUpdateCuestionario] Respuesta de la API (PUT):', response);

      if (response.status === 401) {
        console.error('[handleUpdateCuestionario] Autenticación fallida al actualizar el cuestionario.');
        throw new Error('Autenticación fallida. Por favor, inicia sesión nuevamente.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[handleUpdateCuestionario] Error al actualizar el cuestionario:', errorData);
        throw new Error(`Error al actualizar el cuestionario: ${response.status} ${response.statusText}`);
      }

      const data: CuestionarioAPI = await response.json();
      console.log('[handleUpdateCuestionario] Cuestionario actualizado exitosamente:', data);

      const transformedCuestionario = transformCuestionario(data);
      console.log('[handleUpdateCuestionario] Cuestionario transformado:', transformedCuestionario);

      setQuestionnaires(prev => prev.map(q => (q.id === data._id ? transformedCuestionario : q)));
      console.log('[handleUpdateCuestionario] Estado actualizado con el cuestionario modificado.');
      setSelectedCuestionario(null);
      setShowCrearCuestionario(false);
    } catch (err: any) {
      console.error('[handleUpdateCuestionario] Error al actualizar el cuestionario:', err);
      alert(err.message || 'Error al actualizar el cuestionario.');
    }
  };

  useEffect(() => {
    console.log('[useEffect] Montando CuestionariosLista y llamando a fetchCuestionarios.');
    fetchCuestionarios();
  }, []);

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Cuestionarios
        </h2>
        <Button variant="create" onClick={() => {
          console.log('[Button] Abrir CrearCuestionario modal.');
          setShowCrearCuestionario(true);
        }}>
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Cuestionario
        </Button>
      </div>

      {/* Manejo de estados de carga y error */}
      {loading && <p className="text-center text-gray-500">Cargando cuestionarios...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid gap-4">
          {questionnaires.map((questionnaire, index) => (
            <motion.div
              key={questionnaire.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              } p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-102 cursor-pointer`}
              onClick={() => {
                console.log('[Cuestionario] Seleccionado:', questionnaire);
                setSelectedCuestionario(questionnaire);
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{questionnaire.titulo}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">{questionnaire.descripcion}</p>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1 text-blue-500" />
                      <span>{questionnaire.responses} respuestas</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-purple-500" />
                      <span>Actualizado: {questionnaire.lastUpdate}</span>
                    </div>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  questionnaire.status === 'Activo' ? 'bg-green-100 text-green-800' :
                  questionnaire.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {questionnaire.status}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Completado</span>
                  <span className="text-sm font-medium">{questionnaire.completion}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className={`h-2.5 rounded-full ${
                      parseInt(questionnaire.completion) === 100 ? 'bg-green-600' :
                      parseInt(questionnaire.completion) > 50 ? 'bg-blue-600' :
                      'bg-yellow-600'
                    }`}
                    style={{ width: `${questionnaire.completion}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showCrearCuestionario && (
          <CrearCuestionario
            onClose={() => {
              console.log('[CrearCuestionario] Cerrar modal.');
              setShowCrearCuestionario(false);
            }}
            onSave={handleSaveCuestionario}
          />
        )}
        {selectedCuestionario && (
          <VistaCuestionario
            cuestionario={selectedCuestionario}
            onClose={() => {
              console.log('[VistaCuestionario] Cerrar vista del cuestionario.');
              setSelectedCuestionario(null);
            }}
            onEdit={() => {
              console.log('[VistaCuestionario] Editar cuestionario:', selectedCuestionario);
              setSelectedCuestionario(null);
              setShowCrearCuestionario(true);
            }}
            onDelete={handleDeleteCuestionario}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CuestionariosLista;
