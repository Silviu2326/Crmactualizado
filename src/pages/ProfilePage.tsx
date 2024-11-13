import React, { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
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
    // Aquí iría la lógica para guardar los cambios
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className={`max-w-md mx-auto ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <h2 className="text-2xl font-bold mb-6">Mi Perfil</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6 text-center">
              <div className="relative inline-block">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Perfil"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                  />
                ) : (
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
                    Perfil
                  </div>
                )}
                <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer">
                  <Camera className="w-5 h-5 text-white" />
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <p className="mt-2 text-sm text-blue-500 cursor-pointer" onClick={triggerFileInput}>Cambiar Foto</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label htmlFor="apellidos" className="block text-sm font-medium mb-1">Apellidos</label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label htmlFor="correo" className="block text-sm font-medium mb-1">Correo</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label htmlFor="clientes" className="block text-sm font-medium mb-1">Número de Clientes Totales</label>
                <input
                  type="text"
                  id="clientes"
                  value="150"
                  readOnly
                  className={`w-full px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-gray-200 border-gray-300'} cursor-not-allowed`}
                />
              </div>
              <div>
                <label htmlFor="proximoPago" className="block text-sm font-medium mb-1">Día de Próximo Pago</label>
                <input
                  type="text"
                  id="proximoPago"
                  value="15/11/2024"
                  readOnly
                  className={`w-full px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-gray-200 border-gray-300'} cursor-not-allowed`}
                />
              </div>
            </div>

            <div className="mt-6">
              <Button variant="create" type="submit" className="w-full">
                Guardar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;