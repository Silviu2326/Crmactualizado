import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import Button from '../../Common/Button';

interface NuevoGasto {
  importe: number;
  moneda: string;
  fecha: string;
  descripcion: string;
  categoria: string;
  tipo: 'fijo' | 'variable';
  estado: string;
}

interface NuevoGastoPopupProps {
  onClose: () => void;
  onSubmit: (gasto: NuevoGasto) => void;
}

const NuevoGastoPopup: React.FC<NuevoGastoPopupProps> = ({ onClose, onSubmit }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<NuevoGasto>({
    importe: 0,
    moneda: 'EUR',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    categoria: 'otros',
    tipo: 'variable',
    estado: 'pendiente'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'importe' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/gastos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el gasto');
      }

      const nuevoGasto = await response.json();
      onSubmit(nuevoGasto);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el gasto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-${theme === 'dark' ? 'gray-800' : 'white'} rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold text-${theme === 'dark' ? 'white' : 'black'}`}>
            Nuevo Gasto
          </h2>
          <button
            onClick={onClose}
            className={`text-${theme === 'dark' ? 'gray-400' : 'gray-500'} hover:text-${theme === 'dark' ? 'white' : 'gray-700'}`}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium text-${theme === 'dark' ? 'white' : 'gray-700'}`}>
              Importe *
            </label>
            <input
              type="number"
              name="importe"
              value={formData.importe}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              required
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-${theme === 'dark' ? 'white' : 'gray-700'}`}>
              Moneda *
            </label>
            <select
              name="moneda"
              value={formData.moneda}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              required
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium text-${theme === 'dark' ? 'white' : 'gray-700'}`}>
              Categoría *
            </label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              required
            >
              <option value="alquiler">Alquiler</option>
              <option value="servicios">Servicios</option>
              <option value="equipamiento">Equipamiento</option>
              <option value="marketing">Marketing</option>
              <option value="personal">Personal</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium text-${theme === 'dark' ? 'white' : 'gray-700'}`}>
              Tipo *
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              required
            >
              <option value="fijo">Fijo</option>
              <option value="variable">Variable</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium text-${theme === 'dark' ? 'white' : 'gray-700'}`}>
              Estado *
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              required
            >
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium text-${theme === 'dark' ? 'white' : 'gray-700'}`}>
              Fecha *
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-${theme === 'dark' ? 'white' : 'gray-700'}`}>
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              placeholder="Descripción del gasto..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              onClick={onClose}
              variant="secondary"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Gasto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoGastoPopup;
