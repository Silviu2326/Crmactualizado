import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { Plus, X, Save, List, Edit3, Trash2 } from 'lucide-react';
import Button from '../Common/Button';
import axios from 'axios';
import jwtDecode from 'jwt-decode'; // Importar jwt-decode

interface PreguntaPredefinida {
  id: string;
  texto: string;
  categoria: string;
}

const preguntasPredefinidas: PreguntaPredefinida[] = [
  {
    id: '1',
    texto: 'Especifica tu edad en años',
    categoria: 'Datos Personales',
  },
  { id: '2', texto: 'Selecciona tu género', categoria: 'Datos Personales' },
  {
    id: '3',
    texto: 'Especifica tu peso actual en kilogramos',
    categoria: 'Datos Corporales',
  },
  {
    id: '4',
    texto: 'Especifica tu altura en centímetros',
    categoria: 'Datos Corporales',
  },
  {
    id: '5',
    texto:
      'Detalla cualquier lesión o condición médica que pueda afectar tu entrenamiento',
    categoria: 'Salud',
  },
  {
    id: '6',
    texto: 'Selecciona tu nivel de experiencia en entrenamiento físico',
    categoria: 'Experiencia',
  },
  {
    id: '7',
    texto:
      'Selecciona tu nivel de actividad física fuera de las sesiones de entrenamiento',
    categoria: 'Actividad Diaria',
  },
  {
    id: '8',
    texto:
      '¿Cuántas horas por semana puedes dedicar al entrenamiento? ¿Cuántas sesiones por semana?',
    categoria: 'Disponibilidad',
  },
  {
    id: '9',
    texto:
      'Selecciona el equipamiento con el que cuentas para tus entrenamientos',
    categoria: 'Equipamiento',
  },
  {
    id: '10',
    texto: 'Especifica los deportes que has practicado previamente',
    categoria: 'Experiencia',
  },
  {
    id: '11',
    texto: 'Selecciona tu principal objetivo de entrenamiento',
    categoria: 'Objetivo',
  },
  {
    id: '12',
    texto:
      'Si tienes experiencia en el gimnasio, selecciona tus ejercicios favoritos',
    categoria: 'Preferencias',
  },
  {
    id: '13',
    texto:
      'Indica el peso máximo que puedes levantar en una repetición para ejercicios como sentadilla, press de banca y peso muerto (si lo sabes)',
    categoria: 'Rendimiento',
  },
  {
    id: '14',
    texto:
      'Si lo prefieres, proporciona tus medidas (circunferencia de cintura, cadera, brazos, etc.) o sube una foto de progreso (opcional)',
    categoria: 'Datos Corporales',
  },
  {
    id: '15',
    texto: 'Si conoces tu porcentaje de grasa corporal, por favor indícalo',
    categoria: 'Datos Corporales',
  },
  {
    id: '16',
    texto:
      'En una escala del 1 al 10, ¿cómo describirías tu nivel de estrés actual?',
    categoria: 'Bienestar',
  },
  {
    id: '17',
    texto:
      'En una escala del 1 al 10, ¿qué tan motivado te sientes para entrenar?',
    categoria: 'Motivación',
  },
  {
    id: '18',
    texto:
      'Deja cualquier comentario adicional o información que creas que deberíamos saber para personalizar mejor tu entrenamiento',
    categoria: 'Comentarios',
  },
];
interface CuestionarioPlantilla {
  id: string;
  titulo: string;
  preguntas: PreguntaPredefinida[];
}

const cuestionariosPlantilla: CuestionarioPlantilla[] = [
  {
    id: 'pre-entrenamiento',
    titulo: 'Cuestionario Pre-entrenamiento',
    preguntas: [
      {
        id: 'p1',
        texto: '¿Cómo de fatigado te sientes el día de hoy?',
        categoria: 'Fatiga',
      },
      {
        id: 'p2',
        texto: '¿Cómo te sientes el día de hoy? ¿Cómo de motivado te sientes?',
        categoria: 'Motivación',
      },
      {
        id: 'p3',
        texto: '¿Cómo has comido el día de hoy?',
        categoria: 'Nutrición',
      },
    ],
  },
  {
    id: 'post-entrenamiento',
    titulo: 'Cuestionario Post-entrenamiento',
    preguntas: [
      {
        id: 'p4',
        texto: '¿Cómo de intenso has percibido esta sesión de entrenamiento?',
        categoria: 'Intensidad',
      },
    ],
  },
];


interface CrearCuestionarioProps {
  onClose: () => void;
  onSave: (cuestionario: any) => void;
}

interface DecodedToken {
  id: string; // Asegúrate de que este campo coincide con el que contiene el ID del entrenador en tu token
  // Otros campos que puedas tener en el token
}

const CrearCuestionario: React.FC<CrearCuestionarioProps> = ({
  onClose,
  onSave,
}) => {
  const { theme } = useTheme();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [frecuencia, setFrecuencia] = useState('semanal');
  const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState<PreguntaPredefinida[]>([]);
  const [nuevaPregunta, setNuevaPregunta] = useState('');
  const [categoriaNuevaPregunta, setCategoriaNuevaPregunta] = useState('');
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<CuestionarioPlantilla | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para manejar la solicitud de guardar el cuestionario
  const handleGuardar = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Obtener el token desde localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación.');
      }

      // Decodificar el token para obtener el ID del entrenador
      const decoded: DecodedToken = jwtDecode(token);
      const entrenadorId = decoded.id;

      if (!entrenadorId) {
        throw new Error('No se pudo extraer el ID del entrenador del token.');
      }

      // Construir el objeto del cuestionario
      const cuestionario = {
        titulo,
        descripcion,
        frecuencia,
        preguntas: preguntasSeleccionadas.map(p => ({
          texto: p.texto,
          categoria: p.categoria,
        })),
        entrenador: entrenadorId,
      };

      // Realizar la solicitud POST al backend
      const response = await axios.post(
        'https://fitoffice2-f70b52bef77e.herokuapp.com/api/cuestionarios/',
        cuestionario,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Manejar la respuesta exitosa
      onSave(response.data);
      onClose();
    } catch (err: any) {
      console.error('Error al crear el cuestionario:', err);
      setError(err.response?.data?.mensaje || err.message || 'Error al crear el cuestionario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Funciones para manejar preguntas y plantillas (sin cambios)
  const handleAgregarPreguntaPredefinida = (pregunta: PreguntaPredefinida) => {
    if (!preguntasSeleccionadas.find((p) => p.id === pregunta.id)) {
      setPreguntasSeleccionadas([...preguntasSeleccionadas, pregunta]);
    }
  };

  const handleAgregarPreguntaPersonalizada = () => {
    if (nuevaPregunta.trim() && categoriaNuevaPregunta.trim()) {
      const nuevaPreguntaObj = {
        id: `custom-${Date.now()}`,
        texto: nuevaPregunta,
        categoria: categoriaNuevaPregunta,
      };
      setPreguntasSeleccionadas([...preguntasSeleccionadas, nuevaPreguntaObj]);
      setNuevaPregunta('');
      setCategoriaNuevaPregunta('');
    }
  };

  const handleRemoverPregunta = (id: string) => {
    setPreguntasSeleccionadas(
      preguntasSeleccionadas.filter((p) => p.id !== id)
    );
  };

  const handleSeleccionarPlantilla = (plantilla: CuestionarioPlantilla) => {
    setPlantillaSeleccionada(plantilla);
    setTitulo(plantilla.titulo);
    setPreguntasSeleccionadas(plantilla.preguntas);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-2xl w-full max-w-4xl max-h-[98vh] overflow-hidden`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Crear Nuevo Cuestionario
          </h2>
          <Button variant="normal" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] scrollbar-thin">
          <div className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className={`w-full p-3 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500`}
                  placeholder="Nombre del cuestionario"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className={`w-full p-3 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500`}
                  rows={3}
                  placeholder="Describe el propósito del cuestionario"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Frecuencia de Completado
                </label>
                <select
                  value={frecuencia}
                  onChange={(e) => setFrecuencia(e.target.value)}
                  className={`w-full p-3 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="diario">Diario</option>
                  <option value="semanal">Semanal</option>
                  <option value="quincenal">Quincenal</option>
                  <option value="mensual">Mensual</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="antes de entrenar">Antes de entrenar</option>
                  <option value="después de entrenar">
                    Después de entrenar
                  </option>
                  <option value="después de comer">Después de comer</option>
                </select>
              </div>
            </div>

            {/* Selección de plantilla */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <List className="w-5 h-5 mr-2" />
                Seleccionar Plantilla
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cuestionariosPlantilla.map((plantilla) => (
                  <motion.div
                    key={plantilla.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    } cursor-pointer transition-all duration-300`}
                    onClick={() => handleSeleccionarPlantilla(plantilla)}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{plantilla.titulo}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Preguntas predefinidas */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <List className="w-5 h-5 mr-2" />
                Preguntas Predefinidas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {preguntasPredefinidas.map((pregunta) => (
                  <motion.div
                    key={pregunta.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    } cursor-pointer transition-all duration-300`}
                    onClick={() => handleAgregarPreguntaPredefinida(pregunta)}
                  >
                    <div className="flex justify-between items-start">
                      <p className="flex-1">{pregunta.texto}</p>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                        }`}
                      >
                        {pregunta.categoria}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Nueva pregunta personalizada */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Edit3 className="w-5 h-5 mr-2" />
                Agregar Pregunta Personalizada
              </h3>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={nuevaPregunta}
                  onChange={(e) => setNuevaPregunta(e.target.value)}
                  placeholder="Escribe tu pregunta"
                  className={`flex-1 p-3 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500`}
                />
                <input
                  type="text"
                  value={categoriaNuevaPregunta}
                  onChange={(e) => setCategoriaNuevaPregunta(e.target.value)}
                  placeholder="Categoría"
                  className={`w-40 p-3 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500`}
                />
                <Button
                  variant="create"
                  onClick={handleAgregarPreguntaPersonalizada}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Preguntas seleccionadas */}
            {preguntasSeleccionadas.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Preguntas Seleccionadas
                </h3>
                <div className="space-y-2">
                  {preguntasSeleccionadas.map((pregunta, index) => (
                    <motion.div
                      key={pregunta.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                    >
                      <span className="mr-4">{index + 1}.</span>
                      <p className="flex-1">{pregunta.texto}</p>
                      <span
                        className={`mx-2 px-2 py-1 rounded-full text-xs ${
                          theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                        }`}
                      >
                        {pregunta.categoria}
                      </span>
                      <Button
                        variant="danger"
                        onClick={() => handleRemoverPregunta(pregunta.id)}
                        className="ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Mostrar mensaje de error si existe */}
            {error && (
              <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
          <Button variant="normal" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="create"
            onClick={handleGuardar}
            disabled={!titulo || preguntasSeleccionadas.length === 0 || isSubmitting}
          >
            <Save className="w-5 h-5 mr-2" />
            {isSubmitting ? 'Guardando...' : 'Guardar Cuestionario'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CrearCuestionario;
