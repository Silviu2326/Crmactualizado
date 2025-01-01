import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const API_URL = 'https://fitoffice2-f70b52bef77e.herokuapp.com/api';

interface CreateClientProps {
  onClose: () => void;
  onClientCreated?: () => void;
}

const CreateClient: React.FC<CreateClientProps> = ({ onClose, onClientCreated }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(' Iniciando proceso de registro de cliente...');
    console.log(' Datos del formulario:', { nombre, email, password: '****' });

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      console.log(` Enviando solicitud POST a ${API_URL}/clientes/registro`);

      const response = await axios.post(`${API_URL}/clientes/registro`, {
        nombre,
        email,
        password,
      });

      console.log(' Cliente registrado exitosamente:', response.data);
      console.log(' Limpiando formulario...');

      setSuccessMessage('Cliente registrado exitosamente');
      setNombre('');
      setEmail('');
      setPassword('');

      if (onClientCreated) {
        console.log(' Notificando creación exitosa al componente padre...');
        onClientCreated();
      }

      console.log(' Iniciando cierre automático del modal...');
      setTimeout(() => {
        console.log(' Cerrando modal de registro...');
        onClose();
      }, 2000);

    } catch (error: any) {
      console.error(' Error al registrar el cliente:', error);
      console.log(' Detalles del error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      // Manejo específico de errores
      if (error.response?.data) {
        const errorMessage = error.response.data.mensaje;
        if (errorMessage?.toLowerCase().includes('contraseña')) {
          setError('Error en la contraseña: La contraseña debe tener al menos 6 caracteres, incluir una mayúscula, un número y un carácter especial');
        } else if (errorMessage?.toLowerCase().includes('correo') || errorMessage?.toLowerCase().includes('email')) {
          setError('Error en el correo electrónico: ' + errorMessage);
        } else if (errorMessage) {
          setError(errorMessage);
        } else {
          setError('Error al registrar el cliente');
        }
      } else {
        setError('Error de conexión: Por favor, intente nuevamente');
      }
    } finally {
      console.log(' Finalizando proceso de registro...');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
        <button
          onClick={() => {
            console.log(' Usuario canceló el registro');
            onClose();
          }}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Registrar Nuevo Cliente</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => {
                  console.log(' Actualizando nombre:', e.target.value);
                  setNombre(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  console.log(' Actualizando email:', e.target.value);
                  setEmail(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    console.log(' Actualizando contraseña');
                    setPassword(e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  La contraseña debe tener al menos 6 caracteres, incluir una mayúscula, un número y un carácter especial
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-green-100 border border-green-200 text-green-700 rounded-md">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-medium 
                ${loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'} 
                transition-colors duration-200`}
            >
              {loading ? 'Registrando...' : 'Registrar Cliente'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateClient;