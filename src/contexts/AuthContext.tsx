// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  nombre: string;
  rol: string;
  // Agrega otros campos si es necesario
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// URL de la API directamente en el código
const API_URL = 'https://fitoffice2-f70b52bef77e.herokuapp.com/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      try {
        const parsedUser: User = JSON.parse(savedUser);

        // Validar que parsedUser tenga las propiedades esperadas
        if (parsedUser && parsedUser.id && parsedUser.email) {
          setUser(parsedUser);
          // Configurar el header de autorización para futuras solicitudes
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          if (location.pathname === '/login') {
            navigate('/');
          }
        } else {
          throw new Error('Datos de usuario inválidos');
        }
      } catch (error) {
        console.error('Error al parsear el usuario guardado:', error);
        // Si hay un error al parsear, limpiar localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, [navigate, location]);

  const login = async (email: string, password: string) => {
    try {
      // Enviar solicitud de login al backend
      const response = await axios.post(`${API_URL}/auth/login/entrenador`, {
        email,
        password
      });

      const { token, user: loggedInUser } = response.data;

      if (!loggedInUser || !token) {
        throw new Error('Respuesta del servidor incompleta');
      }

      // Actualizar el estado y almacenar en localStorage
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('token', token);

      // Configurar el header de autorización para futuras solicitudes
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Redirigir al usuario después del login exitoso
      navigate('/');
    } catch (error: any) {
      console.error('Error en el inicio de sesión:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Error en el inicio de sesión. Inténtalo de nuevo.');
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
