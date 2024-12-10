import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Cliente {
  _id: string;
  nombre: string;
  email: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAsociar: (clienteId: string, metodoPago: string) => void;
  isDarkMode: boolean;
}

const AsociarPlanClientePopup: React.FC<Props> = ({ isOpen, onClose, onAsociar, isDarkMode }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<string>('');
  const [metodoPago, setMetodoPago] = useState<string>('efectivo');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchClientes();
    }
  }, [isOpen]);

  const fetchClientes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://fitoffice2-f70b52bef77e.herokuapp.com/api/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCliente) {
      onAsociar(selectedCliente, metodoPago);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-xl ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold mb-4">Asociar Plan a Cliente</h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Cliente</label>
              <select
                value={selectedCliente}
                onChange={(e) => setSelectedCliente(e.target.value)}
                className={`w-full p-2 rounded border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}
                required
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente._id} value={cliente._id}>
                    {cliente.nombre} - {cliente.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium">Método de Pago</label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className={`w-full p-2 rounded border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}
                required
              >
                <option value="efectivo">Efectivo</option>
                <option value="stripe">Stripe</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Asociar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AsociarPlanClientePopup;
