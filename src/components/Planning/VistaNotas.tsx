import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FileText, Plus, Tag, Clock, Edit2, Trash2 } from 'lucide-react';
import Button from '../Common/Button';

interface Nota {
  id: string;
  titulo: string;
  contenido: string;
  fecha: string;
  etiquetas: string[];
}

interface VistaNotasProps {
  semanaActual: number;
  planSemanal: any;
  updatePlan: (plan: any) => void;
}

const VistaNotas: React.FC<VistaNotasProps> = ({
  semanaActual,
}) => {
  const { theme } = useTheme();
  const [notas, setNotas] = useState<Nota[]>([
    {
      id: '1',
      titulo: 'Progreso en Fuerza',
      contenido: 'Incremento notable en los ejercicios de peso muerto y sentadillas. Mantener la forma y aumentar peso gradualmente.',
      fecha: '2024-03-15',
      etiquetas: ['Fuerza', 'Progreso'],
    },
    {
      id: '2',
      titulo: 'Ajustes de Rutina',
      contenido: 'Modificar el orden de ejercicios para optimizar el rendimiento. Comenzar con compuestos y terminar con aislamientos.',
      fecha: '2024-03-14',
      etiquetas: ['Planificación', 'Optimización'],
    },
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaNota, setNuevaNota] = useState({
    titulo: '',
    contenido: '',
    etiquetas: '',
  });

  const agregarNota = () => {
    if (nuevaNota.titulo && nuevaNota.contenido) {
      const nota: Nota = {
        id: Date.now().toString(),
        titulo: nuevaNota.titulo,
        contenido: nuevaNota.contenido,
        fecha: new Date().toISOString().split('T')[0],
        etiquetas: nuevaNota.etiquetas.split(',').map(tag => tag.trim()),
      };
      setNotas([nota, ...notas]);
      setNuevaNota({ titulo: '', contenido: '', etiquetas: '' });
      setMostrarFormulario(false);
    }
  };

  const eliminarNota = (id: string) => {
    setNotas(notas.filter(nota => nota.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-xl shadow-lg
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">Notas y Observaciones</h2>
          </div>
          <Button
            variant="create"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Nota</span>
          </Button>
        </div>

        {mostrarFormulario && (
          <div className={`mb-6 p-4 rounded-lg
            ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input
                  type="text"
                  value={nuevaNota.titulo}
                  onChange={(e) => setNuevaNota({ ...nuevaNota, titulo: e.target.value })}
                  className={`w-full p-2 rounded-md border
                    ${theme === 'dark'
                      ? 'bg-gray-600 border-gray-500'
                      : 'bg-white border-gray-300'}`}
                  placeholder="Título de la nota"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contenido</label>
                <textarea
                  value={nuevaNota.contenido}
                  onChange={(e) => setNuevaNota({ ...nuevaNota, contenido: e.target.value })}
                  className={`w-full p-2 rounded-md border h-32
                    ${theme === 'dark'
                      ? 'bg-gray-600 border-gray-500'
                      : 'bg-white border-gray-300'}`}
                  placeholder="Contenido de la nota"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Etiquetas (separadas por comas)</label>
                <input
                  type="text"
                  value={nuevaNota.etiquetas}
                  onChange={(e) => setNuevaNota({ ...nuevaNota, etiquetas: e.target.value })}
                  className={`w-full p-2 rounded-md border
                    ${theme === 'dark'
                      ? 'bg-gray-600 border-gray-500'
                      : 'bg-white border-gray-300'}`}
                  placeholder="Fuerza, Progreso, Planificación"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="normal"
                  onClick={() => setMostrarFormulario(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="create"
                  onClick={agregarNota}
                >
                  Guardar Nota
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {notas.map((nota) => (
            <div
              key={nota.id}
              className={`p-4 rounded-lg transition-all duration-300
                ${theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-650'
                  : 'bg-gray-50 hover:bg-gray-100'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{nota.titulo}</h3>
                <div className="flex space-x-2">
                  <button
                    className={`p-2 rounded-full transition-colors
                      ${theme === 'dark'
                        ? 'hover:bg-gray-600'
                        : 'hover:bg-gray-200'}`}
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => eliminarNota(nota.id)}
                    className={`p-2 rounded-full transition-colors
                      ${theme === 'dark'
                        ? 'hover:bg-gray-600'
                        : 'hover:bg-gray-200'}`}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                {nota.contenido}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {nota.etiquetas.map((etiqueta, index) => (
                    <span
                      key={index}
                      className="flex items-center space-x-1 text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{etiqueta}</span>
                    </span>
                  ))}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {nota.fecha}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VistaNotas;