import React, { useState, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
  User, Ruler, Scale, Mail, Phone, MapPin, Calendar,
  Tag, FileText, AlertCircle, MessageCircle, Instagram,
  Facebook, Twitter, Edit2, ChevronDown, ChevronUp, Save,
  X, Check
} from 'lucide-react';
import Button from '../Common/Button';
import toast from 'react-hot-toast';
import PanelChat from './PanelChat';

interface SocialMedia {
  platform: 'instagram' | 'facebook' | 'twitter';
  username: string;
}

interface Tag {
  name: string;
  color: string;
}

interface Direccion {
  calle: string;
  numero?: string;
  ciudad: string;
  provincia: string;
  codigoPostal?: string;
}

interface Cliente {
  _id: string;
  nombre: string;
  fechaNacimiento: string;
  genero: 'Masculino' | 'Femenino' | 'Otro' | 'Prefiero no decirlo';
  telefono: string;
  email: string;
  direccion: Direccion;
  redesSociales: SocialMedia[];
  altura?: number;
  peso?: number;
  condicionesMedicas: string[];
  tags: Tag[];
}

interface PanelPersonalProps {
  cliente: Cliente;
  onEdit?: () => void;
}

const validateInfoBasica = (info: typeof infoBasica) => {
  const errors: Partial<Record<keyof typeof infoBasica, string>> = {};
  if (!info.nombre.trim()) errors.nombre = 'El nombre es requerido';
  if (!info.email.trim()) errors.email = 'El email es requerido';
  if (!info.fechaNacimiento) errors.fechaNacimiento = 'La fecha de nacimiento es requerida';
  if (!info.telefono.trim()) errors.telefono = 'El teléfono es requerido';
  if (!info.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = 'Email inválido';
  return errors;
};

const validateInfoFisica = (info: typeof infoFisica) => {
  const errors: Partial<Record<keyof typeof infoFisica, string>> = {};
  if (info.altura && (info.altura < 0 || info.altura > 300)) errors.altura = 'Altura inválida';
  if (info.peso && (info.peso < 0 || info.peso > 500)) errors.peso = 'Peso inválido';
  return errors;
};

const PanelPersonal: React.FC<PanelPersonalProps> = ({ cliente, onEdit }) => {
  const { theme } = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [loadingSection, setLoadingSection] = useState<string | null>(null);

  // Estados para cada sección
  const [infoBasica, setInfoBasica] = useState({
    nombre: cliente.nombre,
    email: cliente.email,
    fechaNacimiento: cliente.fechaNacimiento,
    genero: cliente.genero,
    telefono: cliente.telefono
  });

  const [infoFisica, setInfoFisica] = useState({
    altura: cliente.altura,
    peso: cliente.peso
  });

  const [condicionesMedicas, setCondicionesMedicas] = useState(cliente.condicionesMedicas);
  const [redesSociales, setRedesSociales] = useState(cliente.redesSociales);
  const [contacto, setContacto] = useState({
    direccion: cliente.direccion
  });

  // Función para obtener el token
  const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No se encontró el token de autenticación');
      return null;
    }
    return token;
  };

  // Función para hacer peticiones API
  const apiRequest = async (url: string, data: any) => {
    const token = getToken();
    if (!token) return false;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Error en la petición');
      return true;
    } catch (error) {
      console.error('Error en la petición:', error);
      return false;
    }
  };

  // Funciones de actualización individuales
  const actualizarInformacionBasica = async () => {
    const validationErrors = validateInfoBasica(infoBasica);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(prev => ({ ...prev, infoBasica: validationErrors }));
      toast.error('Por favor, corrija los errores antes de guardar');
      return false;
    }

    setLoadingSection('infoBasica');
    try {
      const success = await apiRequest(
        `http://localhost:3000/api/clientes/${cliente._id}/info-basica`,
        infoBasica
      );

      if (success) {
        toast.success('Información básica actualizada');
        if (onEdit) onEdit();
      } else {
        toast.error('Error al actualizar información básica');
      }
      return success;
    } finally {
      setLoadingSection(null);
    }
  };

  const actualizarInformacionFisica = async () => {
    const validationErrors = validateInfoFisica(infoFisica);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(prev => ({ ...prev, infoFisica: validationErrors }));
      toast.error('Por favor, corrija los errores antes de guardar');
      return false;
    }

    setLoadingSection('infoFisica');
    try {
      const success = await apiRequest(
        `http://localhost:3000/api/clientes/${cliente._id}/info-fisica`,
        infoFisica
      );

      if (success) {
        toast.success('Información física actualizada');
        if (onEdit) onEdit();
      } else {
        toast.error('Error al actualizar información física');
      }
      return success;
    } finally {
      setLoadingSection(null);
    }
  };

  const actualizarCondicionesMedicas = async () => {
    setLoadingSection('condicionesMedicas');
    try {
      const success = await apiRequest(
        `http://localhost:3000/api/clientes/${cliente._id}/condiciones-medicas`,
        { condicionesMedicas }
      );

      if (success) {
        toast.success('Condiciones médicas actualizadas');
        if (onEdit) onEdit();
      } else {
        toast.error('Error al actualizar condiciones médicas');
      }
      return success;
    } finally {
      setLoadingSection(null);
    }
  };

  const actualizarRedesSociales = async () => {
    setLoadingSection('redesSociales');
    try {
      const success = await apiRequest(
        `http://localhost:3000/api/clientes/${cliente._id}/redes-sociales`,
        { redesSociales }
      );

      if (success) {
        toast.success('Redes sociales actualizadas');
        if (onEdit) onEdit();
      } else {
        toast.error('Error al actualizar redes sociales');
      }
      return success;
    } finally {
      setLoadingSection(null);
    }
  };

  const actualizarContacto = async () => {
    setLoadingSection('contacto');
    try {
      const success = await apiRequest(
        `http://localhost:3000/api/clientes/${cliente._id}/contacto`,
        contacto
      );

      if (success) {
        toast.success('Información de contacto actualizada');
        if (onEdit) onEdit();
      } else {
        toast.error('Error al actualizar contacto');
      }
      return success;
    } finally {
      setLoadingSection(null);
    }
  };

  return (
    <motion.div 
      className="space-y-6 p-4 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Barra de acciones */}
      <div className="flex justify-end space-x-2 mb-6">
        {editMode ? (
          <>
            <Button
              variant="danger"
              onClick={() => setEditMode(false)}
              disabled={loading}
              className="shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </>
        ) : (
          <Button
            variant="primary"
            onClick={() => setEditMode(true)}
            className="shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Editar
          </Button>
        )}
      </div>

      {/* Información Básica */}
      <section className={`
        rounded-lg border-2 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}
        shadow-lg hover:shadow-xl transition-all duration-200
        overflow-hidden
      `}>
        <div className={`
          flex justify-between items-center p-4 border-b-2
          ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-100 bg-gray-50'}
        `}>
          <h2 className="text-xl font-bold flex items-center">
            <User className={`w-5 h-5 mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
            Información Básica
          </h2>
          {editMode && (
            <Button
              variant="primary"
              onClick={actualizarInformacionBasica}
              disabled={loadingSection === 'infoBasica'}
              className="shadow hover:shadow-lg transition-shadow duration-200"
            >
              {loadingSection === 'infoBasica' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Guardar
            </Button>
          )}
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              {editMode ? (
                <input
                  type="text"
                  value={infoBasica.nombre}
                  onChange={e => {
                    setInfoBasica({...infoBasica, nombre: e.target.value});
                    if (errors.infoBasica?.nombre) {
                      setErrors(prev => ({
                        ...prev,
                        infoBasica: { ...prev.infoBasica, nombre: undefined }
                      }));
                    }
                  }}
                  className={`w-full p-2 rounded border ${errors.infoBasica?.nombre ? 'border-red-500' : ''}`}
                />
              ) : (
                <p>{infoBasica.nombre}</p>
              )}
              {errors.infoBasica?.nombre && (
                <p className="text-sm text-red-500 mt-1">{errors.infoBasica.nombre}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              {editMode ? (
                <input
                  type="email"
                  value={infoBasica.email}
                  onChange={e => {
                    setInfoBasica({...infoBasica, email: e.target.value});
                    if (errors.infoBasica?.email) {
                      setErrors(prev => ({
                        ...prev,
                        infoBasica: { ...prev.infoBasica, email: undefined }
                      }));
                    }
                  }}
                  className={`w-full p-2 rounded border ${errors.infoBasica?.email ? 'border-red-500' : ''}`}
                />
              ) : (
                <p>{infoBasica.email}</p>
              )}
              {errors.infoBasica?.email && (
                <p className="text-sm text-red-500 mt-1">{errors.infoBasica.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de Nacimiento</label>
              {editMode ? (
                <input
                  type="date"
                  value={infoBasica.fechaNacimiento}
                  onChange={e => setInfoBasica({...infoBasica, fechaNacimiento: e.target.value})}
                  className={`w-full p-2 rounded border ${errors.infoBasica?.fechaNacimiento ? 'border-red-500' : ''}`}
                />
              ) : (
                <p>{new Date(infoBasica.fechaNacimiento).toLocaleDateString()}</p>
              )}
              {errors.infoBasica?.fechaNacimiento && (
                <p className="text-sm text-red-500 mt-1">{errors.infoBasica.fechaNacimiento}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Género</label>
              {editMode ? (
                <select
                  value={infoBasica.genero}
                  onChange={e => setInfoBasica({...infoBasica, genero: e.target.value as any})}
                  className={`w-full p-2 rounded border ${errors.infoBasica?.genero ? 'border-red-500' : ''}`}
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                  <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                </select>
              ) : (
                <p>{infoBasica.genero}</p>
              )}
              {errors.infoBasica?.genero && (
                <p className="text-sm text-red-500 mt-1">{errors.infoBasica.genero}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              {editMode ? (
                <input
                  type="tel"
                  value={infoBasica.telefono}
                  onChange={e => {
                    setInfoBasica({...infoBasica, telefono: e.target.value});
                    if (errors.infoBasica?.telefono) {
                      setErrors(prev => ({
                        ...prev,
                        infoBasica: { ...prev.infoBasica, telefono: undefined }
                      }));
                    }
                  }}
                  className={`w-full p-2 rounded border ${errors.infoBasica?.telefono ? 'border-red-500' : ''}`}
                />
              ) : (
                <p>{infoBasica.telefono}</p>
              )}
              {errors.infoBasica?.telefono && (
                <p className="text-sm text-red-500 mt-1">{errors.infoBasica.telefono}</p>
              )}
            </div>
          </div>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-between`}>
            <div className="flex items-center space-x-2">
              {loadingSection === 'infoBasica' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent" />
              ) : null}
              <span>{infoBasica.nombre}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Información Física */}
      <section className={`
        rounded-lg border-2 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}
        shadow-lg hover:shadow-xl transition-all duration-200
        overflow-hidden
      `}>
        <div className={`
          flex justify-between items-center p-4 border-b-2
          ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-100 bg-gray-50'}
        `}>
          <h2 className="text-xl font-bold flex items-center">
            <Scale className={`w-5 h-5 mr-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />
            Información Física
          </h2>
          {editMode && (
            <Button
              variant="primary"
              onClick={actualizarInformacionFisica}
              disabled={loadingSection === 'infoFisica'}
              className="shadow hover:shadow-lg transition-shadow duration-200"
            >
              {loadingSection === 'infoFisica' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Guardar
            </Button>
          )}
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Altura (cm)</label>
              {editMode ? (
                <input
                  type="number"
                  value={infoFisica.altura}
                  onChange={e => setInfoFisica({...infoFisica, altura: parseFloat(e.target.value)})}
                  className={`w-full p-2 rounded border ${errors.infoFisica?.altura ? 'border-red-500' : ''}`}
                />
              ) : (
                <p>{infoFisica.altura} cm</p>
              )}
              {errors.infoFisica?.altura && (
                <p className="text-sm text-red-500 mt-1">{errors.infoFisica.altura}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Peso (kg)</label>
              {editMode ? (
                <input
                  type="number"
                  value={infoFisica.peso}
                  onChange={e => setInfoFisica({...infoFisica, peso: parseFloat(e.target.value)})}
                  className={`w-full p-2 rounded border ${errors.infoFisica?.peso ? 'border-red-500' : ''}`}
                />
              ) : (
                <p>{infoFisica.peso} kg</p>
              )}
              {errors.infoFisica?.peso && (
                <p className="text-sm text-red-500 mt-1">{errors.infoFisica.peso}</p>
              )}
            </div>
          </div>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-between`}>
            <div className="flex items-center space-x-2">
              {loadingSection === 'infoFisica' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent" />
              ) : null}
              <span>{infoFisica.altura} cm, {infoFisica.peso} kg</span>
            </div>
          </div>
        </div>
      </section>

      {/* Condiciones Médicas */}
      <section className={`
        rounded-lg border-2 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}
        shadow-lg hover:shadow-xl transition-all duration-200
        overflow-hidden
      `}>
        <div className={`
          flex justify-between items-center p-4 border-b-2
          ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-100 bg-gray-50'}
        `}>
          <h2 className="text-xl font-bold flex items-center">
            <AlertCircle className={`w-5 h-5 mr-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'}`} />
            Condiciones Médicas
          </h2>
          {editMode && (
            <Button
              variant="primary"
              onClick={actualizarCondicionesMedicas}
              disabled={loadingSection === 'condicionesMedicas'}
              className="shadow hover:shadow-lg transition-shadow duration-200"
            >
              {loadingSection === 'condicionesMedicas' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Guardar
            </Button>
          )}
        </div>
        <div className="p-6">
          <div className="space-y-2">
            {editMode ? (
              condicionesMedicas.map((condicion, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={condicion}
                    onChange={e => {
                      const newCondiciones = [...condicionesMedicas];
                      newCondiciones[index] = e.target.value;
                      setCondicionesMedicas(newCondiciones);
                    }}
                    className="flex-1 p-2 rounded border"
                  />
                  <Button
                    variant="danger"
                    onClick={() => {
                      const newCondiciones = condicionesMedicas.filter((_, i) => i !== index);
                      setCondicionesMedicas(newCondiciones);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))
            ) : (
              condicionesMedicas.map((condicion, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <span>{condicion}</span>
                </div>
              ))
            )}
            {editMode && (
              <Button
                variant="secondary"
                onClick={() => {
                  setCondicionesMedicas([...condicionesMedicas, '']);
                }}
              >
                Añadir Condición Médica
              </Button>
            )}
          </div>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-between`}>
            <div className="flex items-center space-x-2">
              {loadingSection === 'condicionesMedicas' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent" />
              ) : null}
              <span>{condicionesMedicas.join(', ')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Redes Sociales */}
      <section className={`
        rounded-lg border-2 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}
        shadow-lg hover:shadow-xl transition-all duration-200
        overflow-hidden
      `}>
        <div className={`
          flex justify-between items-center p-4 border-b-2
          ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-100 bg-gray-50'}
        `}>
          <h2 className="text-xl font-bold flex items-center">
            <MessageCircle className={`w-5 h-5 mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />
            Redes Sociales
          </h2>
          {editMode && (
            <Button
              variant="primary"
              onClick={actualizarRedesSociales}
              disabled={loadingSection === 'redesSociales'}
              className="shadow hover:shadow-lg transition-shadow duration-200"
            >
              {loadingSection === 'redesSociales' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Guardar
            </Button>
          )}
        </div>
        <div className="p-6">
          <div className="space-y-2">
            {editMode ? (
              redesSociales.map((red, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <select
                    value={red.platform}
                    onChange={e => {
                      const newRedes = [...redesSociales];
                      newRedes[index] = {...red, platform: e.target.value as any};
                      setRedesSociales(newRedes);
                    }}
                    className="p-2 rounded border"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                  </select>
                  <input
                    type="text"
                    value={red.username}
                    onChange={e => {
                      const newRedes = [...redesSociales];
                      newRedes[index] = {...red, username: e.target.value};
                      setRedesSociales(newRedes);
                    }}
                    className="flex-1 p-2 rounded border"
                    placeholder="Usuario"
                  />
                  <Button
                    variant="danger"
                    onClick={() => {
                      const newRedes = redesSociales.filter((_, i) => i !== index);
                      setRedesSociales(newRedes);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))
            ) : (
              redesSociales.map((red, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {red.platform === 'instagram' && <Instagram className="w-4 h-4" />}
                  {red.platform === 'facebook' && <Facebook className="w-4 h-4" />}
                  {red.platform === 'twitter' && <Twitter className="w-4 h-4" />}
                  <span>{red.username}</span>
                </div>
              ))
            )}
            {editMode && (
              <Button
                variant="secondary"
                onClick={() => {
                  setRedesSociales([...redesSociales, { platform: 'instagram', username: '' }]);
                }}
              >
                Añadir Red Social
              </Button>
            )}
          </div>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-between`}>
            <div className="flex items-center space-x-2">
              {loadingSection === 'redesSociales' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent" />
              ) : null}
              <span>{redesSociales.map(red => red.username).join(', ')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Chat del Cliente */}
      <section className={`
        rounded-lg border-2 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}
        shadow-lg hover:shadow-xl transition-all duration-200
        overflow-hidden mt-6
      `}>
        <div className={`
          flex justify-between items-center p-4 border-b-2
          ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-100 bg-gray-50'}
        `}>
          <h2 className="text-xl font-bold flex items-center">
            <MessageCircle className={`w-5 h-5 mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
            Chat con {cliente.nombre}
          </h2>
        </div>
        <div className="p-0">
          {cliente._id && (
            <PanelChat 
              clienteId={cliente._id}
              clienteName={cliente.nombre}
            />
          )}
        </div>
      </section>

      {/* Contacto */}
      <section className={`
        rounded-lg border-2 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}
        shadow-lg hover:shadow-xl transition-all duration-200
        overflow-hidden
      `}>
        <div className={`
          flex justify-between items-center p-4 border-b-2
          ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-100 bg-gray-50'}
        `}>
          <h2 className="text-xl font-bold flex items-center">
            <MapPin className={`w-5 h-5 mr-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`} />
            Contacto
          </h2>
          {editMode && (
            <Button
              variant="primary"
              onClick={actualizarContacto}
              disabled={loadingSection === 'contacto'}
              className="shadow hover:shadow-lg transition-shadow duration-200"
            >
              {loadingSection === 'contacto' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Guardar
            </Button>
          )}
        </div>
        <div className="p-6">
          <div>
            <label className="block text-sm font-medium mb-1">Dirección</label>
            {editMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Calle"
                  value={contacto.direccion.calle}
                  onChange={e => setContacto({
                    ...contacto,
                    direccion: {...contacto.direccion, calle: e.target.value}
                  })}
                  className="w-full p-2 rounded border"
                />
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={contacto.direccion.ciudad}
                  onChange={e => setContacto({
                    ...contacto,
                    direccion: {...contacto.direccion, ciudad: e.target.value}
                  })}
                  className="w-full p-2 rounded border"
                />
                <input
                  type="text"
                  placeholder="Provincia"
                  value={contacto.direccion.provincia}
                  onChange={e => setContacto({
                    ...contacto,
                    direccion: {...contacto.direccion, provincia: e.target.value}
                  })}
                  className="w-full p-2 rounded border"
                />
                <input
                  type="text"
                  placeholder="Código Postal"
                  value={contacto.direccion.codigoPostal}
                  onChange={e => setContacto({
                    ...contacto,
                    direccion: {...contacto.direccion, codigoPostal: e.target.value}
                  })}
                  className="w-full p-2 rounded border"
                />
              </div>
            ) : (
              <p>
                {contacto.direccion.calle}, {contacto.direccion.ciudad}, {contacto.direccion.provincia}
                {contacto.direccion.codigoPostal && ` (${contacto.direccion.codigoPostal})`}
              </p>
            )}
          </div>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-between`}>
            <div className="flex items-center space-x-2">
              {loadingSection === 'contacto' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent" />
              ) : null}
              <span>{contacto.direccion.calle}, {contacto.direccion.ciudad}, {contacto.direccion.provincia}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Estilos para inputs y selects */}
      <style jsx>{`
        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="number"],
        input[type="date"],
        select {
          @apply rounded-lg border-2 focus:ring-2 focus:ring-opacity-50 transition-all duration-200;
          ${theme === 'dark' 
            ? 'background-color: rgb(31, 41, 55); border-color: rgb(55, 65, 81);' 
            : 'background-color: white; border-color: rgb(229, 231, 235);'}
        }

        input[type="text"]:focus,
        input[type="email"]:focus,
        input[type="tel"]:focus,
        input[type="number"]:focus,
        input[type="date"]:focus,
        select:focus {
          ${theme === 'dark'
            ? 'border-color: rgb(59, 130, 246); background-color: rgb(17, 24, 39);'
            : 'border-color: rgb(59, 130, 246); background-color: white;'}
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default PanelPersonal;
