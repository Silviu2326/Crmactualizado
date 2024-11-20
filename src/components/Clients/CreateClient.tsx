import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://fitoffice2-f70b52bef77e.herokuapp.com/api';

const CreateClient: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post(`${API_URL}/clientes/registro`, {
        nombre,
        email,
        password,
      });

      setSuccessMessage('Cliente registrado exitosamente');
      setNombre('');
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('Error al registrar el cliente:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.mensaje || 'Error al registrar el cliente');
      } else {
        setError('Error al registrar el cliente');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Registrar Nuevo Cliente</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar Cliente'}
        </button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
    </div>
  );
};

export default CreateClient;
