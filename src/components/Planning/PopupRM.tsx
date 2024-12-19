import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../Common/Button';

interface Exercise {
  _id: string;
  nombre: string;
  grupoMuscular: string[];
  descripcion: string;
  equipo: string[];
  fechaCreacion: string;
}

interface ExerciseResponse {
  message: string;
  data: Exercise[];
}

interface RMData {
  ejercicio: string;
  peso: number;
  fecha: string;
}

interface PopupRMProps {
  onClose: () => void;
  planningId: string;
}

const PopupRM: React.FC<PopupRMProps> = ({ onClose, planningId }) => {
  const [rms, setRMs] = useState<RMData[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newRM, setNewRM] = useState<RMData>({
    ejercicio: '',
    peso: 0,
    fecha: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        console.log('Fetching exercises...');
        const response = await fetch('http://localhost:3000/api/exercises');
        if (response.ok) {
          const data: ExerciseResponse = await response.json();
          console.log('Exercises fetched successfully:', data);
          setExercises(data.data);
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    fetchExercises();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(`http://localhost:3000/api/plannings/${planningId}/rm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRM),
      });

      if (!response.ok) throw new Error('Error al guardar RM');

      // Actualizar la lista de RMs
      setRMs([...rms, newRM]);
      // Limpiar el formulario
      setNewRM({
        ejercicio: '',
        peso: 0,
        fecha: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Registrar RM (Record Máximo)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ejercicio
            </label>
            <select
              value={newRM.ejercicio}
              onChange={(e) => setNewRM({ ...newRM, ejercicio: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">Selecciona un ejercicio</option>
              {exercises.map((exercise) => (
                <option key={exercise._id} value={exercise.nombre}>
                  {exercise.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Peso (kg)
            </label>
            <input
              type="number"
              value={newRM.peso}
              onChange={(e) => setNewRM({ ...newRM, peso: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fecha
            </label>
            <input
              type="date"
              value={newRM.fecha}
              onChange={(e) => setNewRM({ ...newRM, fecha: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
            >
              Guardar RM
            </Button>
          </div>
        </form>

        {/* Lista de RMs */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Historial de RMs
          </h3>
          <div className="space-y-3">
            {rms.map((rm, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{rm.ejercicio}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {rm.peso} kg - {new Date(rm.fecha).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupRM;
