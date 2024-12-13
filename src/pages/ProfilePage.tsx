import React, { useState, useRef } from 'react';
import { Camera, User, Mail, Users, Calendar, Save, Edit2 } from 'lucide-react';
import Button from '../components/Common/Button';
import { useTheme } from '../contexts/ThemeContext';

const ProfilePage: React.FC = () => {
  const { theme } = useTheme();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: 'Juan',
    apellidos: 'Pérez',
    correo: 'juan.perez@example.com',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Banner de perfil con animación de gradiente */}
      <div className={`h-64 w-full relative overflow-hidden ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900'
          : 'bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500'
      }`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiIGlkPSJhIj48c3RvcCBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9Ii4xIiBvZmZzZXQ9IjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMCAwaDcyMHY1MTJIMHoiIGZpbGw9InVybCgjYSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] bg-cover opacity-50"></div>
        <div className="container mx-auto px-4 h-full flex items-end relative z-10">
          <h1 className="text-white text-4xl font-bold mb-8 tracking-tight">Mi Perfil</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-32">
        <div className={`max-w-4xl mx-auto ${
          theme === 'dark' ? 'bg-gray-800/95 backdrop-blur-xl' : 'bg-white/95 backdrop-blur-xl'
        } rounded-2xl shadow-2xl p-8 relative overflow-hidden`}>
          {/* Efecto de decoración */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8 relative">
            {/* Sección de foto de perfil */}
            <div className="flex flex-col md:flex-row items-center gap-12 pb-8 border-b border-gray-200/20">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 animate-tilt"></div>
                <div className="relative">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Perfil"
                      className="w-48 h-48 rounded-full object-cover ring-4 ring-white/10 dark:ring-gray-800/50 transform transition-all duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`w-48 h-48 rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-105 ${
                      theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/80'
                    }`}>
                      <User size={72} className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="absolute bottom-3 right-3 p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-12 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Camera size={24} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* Información básica */}
              <div className="flex-1 space-y-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <label htmlFor="nombre" className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
                      Nombre
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                          theme === 'dark'
                            ? 'bg-gray-700/50 border-gray-600 text-white focus:border-blue-500'
                            : 'bg-white/50 border-gray-200 focus:border-blue-500'
                        } focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
                      />
                      <Edit2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                    </div>
                  </div>

                  <div className="relative group">
                    <label htmlFor="apellidos" className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
                      Apellidos
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="apellidos"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                          theme === 'dark'
                            ? 'bg-gray-700/50 border-gray-600 text-white focus:border-blue-500'
                            : 'bg-white/50 border-gray-200 focus:border-blue-500'
                        } focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
                      />
                      <Edit2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                    </div>
                  </div>

                  <div className="relative group md:col-span-2">
                    <label htmlFor="correo" className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
                      Correo
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="correo"
                        name="correo"
                        value={formData.correo}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                          theme === 'dark'
                            ? 'bg-gray-700/50 border-gray-600 text-white focus:border-blue-500'
                            : 'bg-white/50 border-gray-200 focus:border-blue-500'
                        } focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div className={`p-8 rounded-2xl relative overflow-hidden group transition-all duration-300 transform hover:scale-105 ${
                theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50/80'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-500/10'}`}>
                      <Users className={`w-7 h-7 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                    </div>
                    <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Clientes Totales
                    </h3>
                  </div>
                  <p className={`mt-6 text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>150</p>
                </div>
              </div>

              <div className={`p-8 rounded-2xl relative overflow-hidden group transition-all duration-300 transform hover:scale-105 ${
                theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50/80'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-500/10'}`}>
                      <Calendar className={`w-7 h-7 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />
                    </div>
                    <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Próximo Pago
                    </h3>
                  </div>
                  <p className={`mt-6 text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>15/11/2024</p>
                </div>
              </div>
            </div>

            {/* Botón de guardar */}
            <div className="pt-8">
              <Button
                variant="create"
                type="submit"
                className="group w-full md:w-auto flex items-center justify-center space-x-3 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Save size={22} className="transform transition-transform group-hover:rotate-12" />
                <span>Guardar Cambios</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;