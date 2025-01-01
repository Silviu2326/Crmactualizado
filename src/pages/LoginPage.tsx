// src/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Dumbbell, Snowflake, Gift, TreeDeciduous, Star, Bell } from 'lucide-react';
import Button from '../components/Common/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showSnow, setShowSnow] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estilos navideños
  const christmasStyles = {
    container: `min-h-screen flex items-center justify-center relative ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-green-900/20 to-red-900/20'
        : 'bg-gradient-to-br from-red-50 via-green-50 to-red-50'
    }`,
    card: `max-w-md w-full mx-4 ${
      theme === 'dark'
        ? 'bg-gray-800/50 backdrop-blur-lg'
        : 'bg-white/70 backdrop-blur-lg'
    } rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 transform hover:scale-[1.02]`,
    header: 'relative h-40 bg-gradient-to-r from-red-600 to-green-600',
    snowflake: 'absolute animate-fall pointer-events-none',
    title: `text-2xl font-bold text-center mb-8 ${
      theme === 'dark' ? 'text-white' : 'text-gray-800'
    }`,
  };

  // Generar copos de nieve
  const snowflakes = showSnow ? Array.from({ length: 30 }).map((_, i) => ({
    style: {
      position: 'absolute',
      left: `${Math.random() * 100}%`,
      top: `-20px`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 2}s`,
      opacity: Math.random() * 0.5 + 0.5
    }
  })) : [];

  useEffect(() => {
    const styles = `
      @keyframes fall {
        0% {
          transform: translateY(-10vh) rotate(0deg);
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
        }
      }
      
      .animate-fall {
        animation: fall linear infinite;
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(formData.email, formData.password);
    } catch (error: any) {
      setError(error.message || 'Credenciales inválidas. Usa admin@example.com / password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={christmasStyles.container}>
      {showSnow && snowflakes.map((snowflake, i) => (
        <div key={i} className={christmasStyles.snowflake} style={snowflake.style}>
          <Snowflake size={16} className={`${theme === 'dark' ? 'text-gray-300' : 'text-red-200'}`} />
        </div>
      ))}

      <div className={christmasStyles.card}>
        <div className={christmasStyles.header}>
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute inset-0">
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-20"></div>
          </div>
          <div className="relative flex flex-col items-center justify-center h-full">
            <div className="flex items-center gap-4">
              <TreeDeciduous className="w-12 h-12 text-white animate-bounce" />
              <h1 className="text-3xl font-bold text-white tracking-wider">FitOffice</h1>
              <Gift className="w-12 h-12 text-white animate-bounce" />
            </div>
            <div className="absolute top-2 right-2">
              <button
                onClick={() => setShowSnow(!showSnow)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Snowflake size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <h2 className={christmasStyles.title}>
            <span className="flex items-center justify-center gap-3">
              <Bell className="w-6 h-6 text-red-500" />
              ¡Bienvenido de Nuevo!
              <Star className="w-6 h-6 text-yellow-500" />
            </span>
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative animate-shake" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Correo Electrónico
            </label>
            <div className="relative group">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-500'
              } transition-colors`} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-700/50 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white/50 border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300`}
                placeholder="juan.perez@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Contraseña
            </label>
            <div className="relative group">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-500'
              } transition-colors`} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-700/50 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white/50 border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300`}
                placeholder="contraseña123"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 group-hover:scale-110 transition-transform"
              >
                {showPassword ? (
                  <EyeOff className={`w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-500'
                  }`} />
                ) : (
                  <Eye className={`w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-500'
                  }`} />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                checked={formData.remember}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
              />
              <label htmlFor="remember" className={`ml-2 block text-sm ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Recordarme
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <Button
            variant="create"
            type="submit"
            className="w-full py-3 text-lg font-semibold transition-all duration-300 bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Iniciando sesión...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Gift className="w-5 h-5" />
                Iniciar Sesión
              </div>
            )}
          </Button>

          <p className={`text-center text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            ¿No tienes una cuenta?{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Regístrate aquí
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
