import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface CreateExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExerciseCreated: () => void;
  initialData?: {
    _id?: string;
    nombre?: string;
    descripcion?: string;
    gruposMusculares?: string[];
    equipamiento?: string[];
    videoUrl?: string;
  };
  isEditing?: boolean;
}

interface ExerciseFormData {
  nombre: string;
  descripcion: string;
  gruposMusculares: string[];
  equipamiento: string[];
  videoUrl: string;
}

const gruposMusculares = [
  'Soleo',
  'Gemelo',
  'Tríceps femoral',
  'Abductor',
  'Glúteo',
  'Abdominales',
  'Lumbar',
  'Dorsales',
  'Trapecio',
  'Hombro anterior',
  'Hombro lateral',
  'Hombro posterior',
  'Pecho',
  'Tríceps',
  'Bíceps',
  'Cuello',
  'Antebrazo'
];

const equipamientoDisponible = [
  'Pesas',
  'Mancuernas',
  'Barra',
  'Kettlebell',
  'Banda de resistencia',
  'Esterilla',
  'Banco',
  'Máquina de cable',
  'TRX',
  'Rueda de abdominales',
  'Cuerda para saltar',
  'Balón medicinal',
  'Plataforma de step'
];

const CreateExerciseModal: React.FC<CreateExerciseModalProps> = ({
  isOpen,
  onClose,
  onExerciseCreated,
  initialData,
  isEditing = false,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<ExerciseFormData>({
    nombre: '',
    descripcion: '',
    gruposMusculares: [],
    equipamiento: [],
    videoUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        gruposMusculares: initialData.gruposMusculares || [],
        equipamiento: initialData.equipamiento || [],
        videoUrl: initialData.videoUrl || ''
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        gruposMusculares: [],
        equipamiento: [],
        videoUrl: ''
      });
    }
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (type: 'gruposMusculares' | 'equipamiento', value: string) => {
    setFormData((prev) => {
      const currentArray = prev[type];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return {
        ...prev,
        [type]: newArray
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.nombre.trim()) {
        throw new Error('El nombre del ejercicio es obligatorio');
      }

      if (isEditing && initialData?._id) {
        await axios.put(`http://localhost:3000/api/exercises/${initialData._id}`, {
          ...formData,
          grupoMuscular: formData.gruposMusculares,
          equipo: formData.equipamiento
        });
      } else {
        await axios.post('http://localhost:3000/api/exercises', {
          ...formData,
          grupoMuscular: formData.gruposMusculares,
          equipo: formData.equipamiento
        });
      }
      onExerciseCreated();
      onClose();
      setFormData({
        nombre: '',
        descripcion: '',
        gruposMusculares: [],
        equipamiento: [],
        videoUrl: ''
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Error al guardar el ejercicio. Por favor, intente de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        } p-8 rounded-lg shadow-lg relative w-[800px] max-h-[90vh] overflow-y-auto`}
        style={{
          backgroundColor: theme === 'dark' ? 'rgb(31, 41, 55)' : '#ffffff'
        }}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6">
          {isEditing ? 'Editar Ejercicio' : 'Crear Nuevo Ejercicio'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block mb-2 font-medium">
                Nombre del ejercicio *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                }`}
                required
              />
            </div>

            <div>
              <label htmlFor="descripcion" className="block mb-2 font-medium">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Grupos Musculares
              </h3>
              <div className={`space-y-2 max-h-60 overflow-y-auto p-4 rounded border ${
                theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
              }`}>
                {gruposMusculares.map((musculo) => (
                  <label key={musculo} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.gruposMusculares.includes(musculo)}
                      onChange={() => handleCheckboxChange('gruposMusculares', musculo)}
                      className={`form-checkbox h-4 w-4 ${
                        theme === 'dark'
                          ? 'text-blue-500 border-gray-600'
                          : 'text-blue-600 border-gray-300'
                      }`}
                    />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      {musculo}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                Equipamiento
              </h3>
              <div className={`space-y-2 max-h-60 overflow-y-auto p-4 rounded border ${
                theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
              }`}>
                {equipamientoDisponible.map((equipo) => (
                  <label key={equipo} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.equipamiento.includes(equipo)}
                      onChange={() => handleCheckboxChange('equipamiento', equipo)}
                      className={`form-checkbox h-4 w-4 ${
                        theme === 'dark'
                          ? 'text-blue-500 border-gray-600'
                          : 'text-blue-600 border-gray-300'
                      }`}
                    />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      {equipo}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="videoUrl" className="block mb-2 font-medium">
              Link video tutorial
            </label>
            <input
              type="url"
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
              }`}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                theme === 'dark'
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (isEditing ? 'Guardando...' : 'Creando...') : (isEditing ? 'Guardar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExerciseModal;
