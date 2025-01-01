import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../Common/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface Exercise {
  _id: string;
  nombre: string;
}

interface Cliente {
  _id: string;
  nombre: string;
}

interface RMData {
  cliente: string;
  ejercicio: string;
  rm: number;
  fecha: string;
}

interface RMResponse {
  _id: string;
  cliente: {
    _id: string;
    nombre: string;
  };
  ejercicio: {
    _id: string;
    nombre: string;
  };
  trainer: {
    _id: string;
    nombre: string;
  };
  rm: number;
  fecha: string;
}

interface ExerciseResponse {
  success: boolean;
  data: Exercise[];
}

interface ClienteResponse {
  success: boolean;
  data: Cliente[];
}

interface PopupRMProps {
  isOpen?: boolean;
  onClose: () => void;
  planningId: string;
}

const PopupRM: React.FC<PopupRMProps> = ({ isOpen = true, onClose, planningId }) => {
  const [rms, setRMs] = useState<RMResponse[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newRM, setNewRM] = useState<RMData>({
    cliente: '',
    ejercicio: '',
    rm: 0,
    fecha: new Date().toISOString()
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        // Obtener ejercicios
        const exercisesResponse = await fetch('http://localhost:3000/api/exercises', {
          headers
        });
        if (!exercisesResponse.ok) {
          throw new Error('Error al cargar ejercicios');
        }
        const exercisesData: ExerciseResponse = await exercisesResponse.json();
        console.log('Respuesta ejercicios:', exercisesData);
        setExercises(exercisesData.data || []);

        // Obtener clientes
        console.log('Haciendo fetch a clientes...');
        const clientesResponse = await fetch('http://localhost:3000/api/clientes', {
          headers
        });
        console.log('Respuesta clientes status:', clientesResponse.status);
        
        if (!clientesResponse.ok) {
          throw new Error('Error al cargar clientes');
        }
        
        const clientesData = await clientesResponse.json();
        console.log('Datos completos de clientes:', clientesData);
        
        // La API devuelve directamente el array de clientes
        if (Array.isArray(clientesData)) {
          console.log('Número de clientes:', clientesData.length);
          setClientes(clientesData);
        } else {
          console.log('Formato de respuesta inesperado:', clientesData);
          setClientes([]);
        }

      } catch (error) {
        console.error('Error detallado:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar datos');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`http://localhost:3000/api/rms`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newRM),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar RM');
      }

      const responseData: RMResponse = await response.json();
      // Actualizar la lista de RMs con la respuesta del servidor
      setRMs(prev => [...prev, responseData]);
      
      // Limpiar el formulario
      setNewRM({
        cliente: '',
        ejercicio: '',
        rm: 0,
        fecha: new Date().toISOString()
      });
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Error al guardar RM');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-[9999]"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Registrar RM (Record Máximo)
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Cliente */}
              <div>
                <label 
                  htmlFor="cliente" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Cliente
                </label>
                <select
                  id="cliente"
                  value={newRM.cliente}
                  onChange={(e) => setNewRM({ ...newRM, cliente: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Selecciona un cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente._id} value={cliente._id}>
                      {cliente.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campo Ejercicio */}
              <div>
                <label 
                  htmlFor="ejercicio" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Ejercicio
                </label>
                <select
                  id="ejercicio"
                  value={newRM.ejercicio}
                  onChange={(e) => setNewRM({ ...newRM, ejercicio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Selecciona un ejercicio</option>
                  {exercises.map((exercise) => (
                    <option key={exercise._id} value={exercise._id}>
                      {exercise.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campo RM */}
              <div>
                <label 
                  htmlFor="rm" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  RM (kg)
                </label>
                <input
                  type="number"
                  id="rm"
                  value={newRM.rm}
                  onChange={(e) => setNewRM({ ...newRM, rm: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           dark:bg-gray-700 dark:text-white"
                  min="0"
                  required
                />
              </div>

              {/* Campo Fecha */}
              <div>
                <label 
                  htmlFor="fecha" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Fecha
                </label>
                <input
                  type="datetime-local"
                  id="fecha"
                  value={newRM.fecha.slice(0, 16)}
                  onChange={(e) => setNewRM({ ...newRM, fecha: new Date(e.target.value).toISOString() })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  variant="secondary"
                  onClick={onClose}
                  type="button"
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
          )}

          {/* Lista de RMs */}
          {!isLoading && !error && rms.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Historial de RMs
              </h3>
              <div className="space-y-3">
                {rms.map((rm, index) => (
                  <div
                    key={rm._id || index}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {rm.ejercicio.nombre || 'Ejercicio no encontrado'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Cliente: {rm.cliente.nombre || 'Cliente no encontrado'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {rm.rm} kg - {new Date(rm.fecha).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PopupRM;
