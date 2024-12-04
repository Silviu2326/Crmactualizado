import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../Common/Button';

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
  console.log('Modal Props - Initial Data:', initialData);
  
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
    console.log('useEffect triggered with initialData:', initialData);
    if (initialData) {
      console.log('Setting form data with:', {
        nombre: initialData.nombre,
        descripcion: initialData.descripcion,
        gruposMusculares: initialData.gruposMusculares,
        equipamiento: initialData.equipamiento,
        videoUrl: initialData.videoUrl
      });
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
    console.log('Input Change:', { name, value });
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (type: 'gruposMusculares' | 'equipamiento', value: string) => {
    console.log('Checkbox Change:', { type, value });
    setFormData((prev) => {
      const currentArray = prev[type];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      console.log('Updated array for', type, ':', newArray);
      return {
        ...prev,
        [type]: newArray
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    console.log('Is Editing:', isEditing);
    console.log('Exercise ID:', initialData?._id);
    
    setLoading(true);
    setError(null);

    try {
      if (!formData.nombre.trim()) {
        throw new Error('El nombre del ejercicio es obligatorio');
      }

      if (isEditing && initialData?._id) {
        console.log('Sending PUT request with data:', {
          ...formData,
          grupoMuscular: formData.gruposMusculares,
          equipo: formData.equipamiento
        });
        await axios.put(`https://fitoffice2-f70b52bef77e.herokuapp.com//api/exercises/${initialData._id}`, {
          ...formData,
          grupoMuscular: formData.gruposMusculares,
          equipo: formData.equipamiento
        });
      } else {
        console.log('Sending POST request with data:', {
          ...formData,
          grupoMuscular: formData.gruposMusculares,
          equipo: formData.equipamiento
        });
        await axios.post('https://fitoffice2-f70b52bef77e.herokuapp.com//api/exercises', {
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
      console.error('Error in submit:', error);
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
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl my-8"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEditing ? 'Editar Ejercicio' : 'Crear Nuevo Ejercicio'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}

              {/* Nombre y Descripción */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre del ejercicio *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Grupos Musculares y Equipamiento */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                    Grupos Musculares
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {gruposMusculares.map((musculo) => (
                      <label key={musculo} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.gruposMusculares.includes(musculo)}
                          onChange={() => handleCheckboxChange('gruposMusculares', musculo)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{musculo}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                    Equipamiento
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {equipamientoDisponible.map((equipo) => (
                      <label key={equipo} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.equipamiento.includes(equipo)}
                          onChange={() => handleCheckboxChange('equipamiento', equipo)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{equipo}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Link Video Tutorial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Link video tutorial
                </label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  variant="secondary"
                  onClick={onClose}
                  type="button"
                >
                  Cerrar
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (isEditing ? 'Guardando...' : 'Creando...') : isEditing ? 'Guardar' : 'Crear'}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateExerciseModal;
